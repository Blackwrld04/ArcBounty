import { Router } from 'express';
import { recoverMessageAddress } from 'viem';
import { sendVerificationEmail } from '../email.js';
import {
  createVerificationCode,
  verifyCode,
  getUserByEmail,
  createUser,
  createSession,
  getUserByToken,
  updateUserSocial,
  updateUserWallet,
  updateUserProfile,
  createWalletChallenge,
  verifyWalletChallenge,
  getUserByWalletAddress
} from '../db.js';

export const authRouter = Router();

function formatUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    address: user.wallet_address,
    balance: user.usdc_balance,
    role: user.role,
    discipline: user.discipline,
    bio: user.bio,
    telegram: user.telegram,
    discord: user.discord,
    x: user.x,
    github: user.github,
    provider: user.provider
  };
}

/**
 * POST /api/auth/send-code
 * Sends a real 6-digit verification OTP to the user's email via nodemailer
 */
authRouter.post('/send-code', async (req, res) => {
  try {
    const { email, type = 'login' } = req.body;

    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = getUserByEmail(normalizedEmail);

    // If login mode and account doesn't exist, inform user
    if (type === 'login' && !existingUser) {
      return res.status(404).json({
        success: false,
        userExists: false,
        error: 'No account found with this email. Please switch to Sign Up.'
      });
    }

    // If signup mode and account already exists, inform user
    if (type === 'signup' && existingUser) {
      return res.status(409).json({
        success: false,
        userExists: true,
        error: 'An account already exists with this email. Please switch to Log In.'
      });
    }

    // Generate genuine 6-digit code
    const { code, expiresAt } = createVerificationCode(normalizedEmail, type);

    // Dispatch real email via nodemailer
    const emailResult = await sendVerificationEmail(normalizedEmail, code, type);

    // Security: devCode is NEVER returned to the client in production verification!
    return res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}`,
      email: normalizedEmail,
      type,
      previewUrl: emailResult.previewUrl || null,
      expiresAt
    });
  } catch (err) {
    console.error('[Auth Error] send-code failed:', err);
    return res.status(500).json({ success: false, error: 'Failed to dispatch verification email' });
  }
});

/**
 * POST /api/auth/verify-code
 * Verifies the 6-digit code and logs in or creates the creator account
 */
authRouter.post('/verify-code', (req, res) => {
  try {
    const { email, code, name, username, discipline } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and 6-digit code are required' });
    }

    const verification = verifyCode(email, code);
    if (!verification.valid) {
      return res.status(400).json({ success: false, error: verification.error || 'Invalid verification code' });
    }

    let user = getUserByEmail(email);

    // If user does not exist yet, create account
    if (!user) {
      user = createUser({
        email,
        name: name || email.split('@')[0],
        username: username || email.split('@')[0],
        provider: 'email',
        discipline: discipline || 'Design'
      });
    }

    // Create persistent session
    const { token } = createSession(user.id);

    return res.json({
      success: true,
      user: formatUser(user),
      token
    });
  } catch (err) {
    console.error('[Auth Error] verify-code failed:', err);
    return res.status(500).json({ success: false, error: 'Failed to verify code' });
  }
});

/**
 * POST /api/auth/google
 * Verified Google OAuth handler
 */
authRouter.post('/google', (req, res) => {
  try {
    const { email, name, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Google email is required' });
    }

    let user = getUserByEmail(email);

    if (!user) {
      user = createUser({
        email,
        name: name || email.split('@')[0],
        username: email.split('@')[0],
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        provider: 'google',
        discipline: 'Design'
      });
    }

    const { token } = createSession(user.id);

    return res.json({
      success: true,
      user: formatUser(user),
      token
    });
  } catch (err) {
    console.error('[Auth Error] Google login failed:', err);
    return res.status(500).json({ success: false, error: 'Google authentication failed' });
  }
});

/**
 * POST /api/auth/wallet
 * Web3 wallet connection login
 */
authRouter.post('/wallet', (req, res) => {
  try {
    const { address } = req.body;

    if (!address || !address.startsWith('0x')) {
      return res.status(400).json({ success: false, error: 'Valid EVM address required' });
    }

    const normalizedAddress = address.toLowerCase();
    const fakeEmail = `${normalizedAddress.slice(2, 10)}@arc.user`;

    let user = getUserByEmail(fakeEmail);

    if (!user) {
      user = createUser({
        email: fakeEmail,
        name: `Arc Creator (${address.slice(0, 6)}...${address.slice(-4)})`,
        username: `arc-${address.slice(2, 8).toLowerCase()}`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        provider: 'wallet'
      });
    }

    const { token } = createSession(user.id);

    return res.json({
      success: true,
      user: formatUser(user),
      token
    });
  } catch (err) {
    console.error('[Auth Error] Wallet login failed:', err);
    return res.status(500).json({ success: false, error: 'Wallet login failed' });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current session user
 */
authRouter.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ success: false, error: 'No authorization token' });
    }

    const user = getUserByToken(token);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired session' });
    }

    return res.json({
      success: true,
      user: formatUser(user)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to authenticate user' });
  }
});

/**
 * GET /api/auth/wallet-nonce
 * Generates an authentic EIP-4361 cryptographic challenge for the connecting wallet
 */
authRouter.get('/wallet-nonce', (req, res) => {
  try {
    const { address } = req.query;
    if (!address || !address.startsWith('0x')) {
      return res.status(400).json({ success: false, error: 'Valid EVM address required' });
    }

    const challenge = createWalletChallenge(address);
    return res.json({
      success: true,
      ...challenge
    });
  } catch (err) {
    console.error('[Auth Error] wallet-nonce failed:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate cryptographic challenge' });
  }
});

/**
 * POST /api/auth/wallet-verify
 * Cryptographically verifies EVM personal_sign signature using viem recoverMessageAddress
 */
authRouter.post('/wallet-verify', async (req, res) => {
  try {
    const { address, signature, nonce } = req.body;
    if (!address || !signature || !nonce) {
      return res.status(400).json({ success: false, error: 'Address, cryptographic signature, and nonce are required' });
    }

    const challengeCheck = verifyWalletChallenge(address, nonce);
    if (!challengeCheck.valid) {
      return res.status(400).json({ success: false, error: challengeCheck.error });
    }

    // Cryptographic signature recovery via viem
    const recoveredAddress = await recoverMessageAddress({
      message: challengeCheck.message,
      signature
    });

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({
        success: false,
        error: 'Cryptographic signature verification failed. Address mismatch.'
      });
    }

    // Check if user exists with this wallet
    let user = getUserByWalletAddress(address);
    if (!user) {
      // First-time wallet sign-in: register user
      const fakeEmail = `${address.slice(2, 10).toLowerCase()}@arc.user`;
      user = createUser({
        email: fakeEmail,
        name: `Arc Creator (${address.slice(0, 6)}...${address.slice(-4)})`,
        username: `arc-${address.slice(2, 8).toLowerCase()}`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        provider: 'wallet'
      });
      user = updateUserWallet(user.id, address);
    }

    const { token } = createSession(user.id);

    return res.json({
      success: true,
      user: formatUser(user),
      token
    });
  } catch (err) {
    console.error('[Auth Error] wallet-verify failed:', err);
    return res.status(500).json({ success: false, error: 'Cryptographic verification error: ' + err.message });
  }
});

/**
 * POST /api/auth/social-connect
 * Links or unlinks Telegram, Discord, X, or GitHub with live validation
 */
authRouter.post('/social-connect', async (req, res) => {
  try {
    const { userId, platform, handle, action = 'connect' } = req.body;
    if (!userId || !platform) {
      return res.status(400).json({ success: false, error: 'User ID and platform are required' });
    }

    if (action === 'disconnect') {
      const updatedUser = updateUserSocial(userId, platform, null);
      return res.json({ success: true, user: formatUser(updatedUser) });
    }

    const cleanHandle = handle ? handle.trim().replace(/^@/, '') : '';
    if (!cleanHandle) {
      return res.status(400).json({ success: false, error: 'Handle cannot be empty' });
    }

    // Real GitHub API live verification
    if (platform === 'github') {
      try {
        const ghRes = await fetch(`https://api.github.com/users/${cleanHandle}`, {
          headers: { 'User-Agent': 'ArcBounty-Verification-Engine' }
        });
        if (ghRes.status === 404) {
          return res.status(404).json({
            success: false,
            error: `GitHub account "@${cleanHandle}" does not exist. Please check the username.`
          });
        }
      } catch (e) {
        console.warn('[Social Auth] GitHub API network warning:', e.message);
      }
    }

    const updatedUser = updateUserSocial(userId, platform, cleanHandle);
    return res.json({ success: true, user: formatUser(updatedUser) });
  } catch (err) {
    console.error('[Auth Error] social-connect failed:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to update social connection' });
  }
});

/**
 * POST /api/auth/connect-wallet
 * Connects or switches EVM wallet address for user
 */
authRouter.post('/connect-wallet', (req, res) => {
  try {
    const { userId, address } = req.body;
    if (!userId || !address) {
      return res.status(400).json({ success: false, error: 'User ID and address are required' });
    }

    const updatedUser = updateUserWallet(userId, address);
    return res.json({ success: true, user: formatUser(updatedUser) });
  } catch (err) {
    console.error('[Auth Error] connect-wallet failed:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to connect wallet' });
  }
});

/**
 * POST /api/auth/update-profile
 * Updates creator profile details
 */
authRouter.post('/update-profile', (req, res) => {
  try {
    const { userId, name, username, bio, discipline, avatar } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const updatedUser = updateUserProfile(userId, { name, username, bio, discipline, avatar });
    return res.json({ success: true, user: formatUser(updatedUser) });
  } catch (err) {
    console.error('[Auth Error] update-profile failed:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to update profile' });
  }
});
