import { Router } from 'express';
import {
  createVerificationCode,
  verifyCode,
  getUserByEmail,
  createUser,
  createSession,
  getUserByToken,
  updateUserSocial,
  updateUserWallet,
  updateUserProfile
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
 * Sends a 6-digit verification OTP to the user's email
 */
authRouter.post('/send-code', (req, res) => {
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
        error: 'No account found with this email. Please sign up to create your creator profile.'
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

    // Generate real 6-digit code
    const { code, expiresAt } = createVerificationCode(normalizedEmail, type);

    return res.json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}`,
      email: normalizedEmail,
      type,
      devCode: code, // Provided for instant demo testing
      expiresAt
    });
  } catch (err) {
    console.error('[Auth Error] send-code failed:', err);
    return res.status(500).json({ success: false, error: 'Failed to send verification code' });
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
 * POST /api/auth/social-connect
 * Links or unlinks Telegram, Discord, X, or GitHub
 */
authRouter.post('/social-connect', (req, res) => {
  try {
    const { userId, platform, handle, action = 'connect' } = req.body;
    if (!userId || !platform) {
      return res.status(400).json({ success: false, error: 'User ID and platform are required' });
    }

    const updatedUser = updateUserSocial(userId, platform, action === 'disconnect' ? null : handle);
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
