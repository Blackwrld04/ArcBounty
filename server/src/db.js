import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto, { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure server/data directory exists
const dataDir = join(__dirname, '../data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || join(dataDir, 'arcbounty.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance
db.exec(`PRAGMA journal_mode = WAL;`);

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar TEXT,
    wallet_address TEXT,
    usdc_balance REAL DEFAULT 1000.0,
    provider TEXT DEFAULT 'email',
    role TEXT DEFAULT 'creator',
    discipline TEXT DEFAULT 'Content',
    bio TEXT,
    telegram TEXT,
    discord TEXT,
    x TEXT,
    github TEXT,
    password_hash TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    type TEXT NOT NULL,
    pending_data TEXT,
    expires_at INTEGER NOT NULL,
    used INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS auth_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT NOT NULL,
    nonce TEXT NOT NULL,
    message TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bounties (
    id TEXT PRIMARY KEY,
    bounty_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    category_name TEXT,
    category_color TEXT,
    submission_type TEXT,
    issue_url TEXT,
    amount REAL NOT NULL,
    tags TEXT,
    status TEXT DEFAULT 'Open',
    payment_status TEXT DEFAULT 'funded',
    deposit_tx TEXT,
    escrow_wallet TEXT NOT NULL,
    maintainer TEXT NOT NULL,
    maintainer_name TEXT,
    maintainer_email TEXT,
    solver TEXT,
    solver_type TEXT,
    pr_url TEXT,
    is_ai_eligible INTEGER DEFAULT 0,
    description TEXT,
    created_at INTEGER NOT NULL,
    deadline INTEGER NOT NULL,
    settled_at INTEGER,
    settlement_tx TEXT
  );

  CREATE TABLE IF NOT EXISTS bounty_submissions (
    id TEXT PRIMARY KEY,
    bounty_id TEXT NOT NULL,
    creator_id TEXT,
    creator_name TEXT,
    creator_email TEXT,
    wallet_address TEXT NOT NULL,
    submission_url TEXT NOT NULL,
    notes TEXT,
    solver_type TEXT DEFAULT 'Human Creator',
    status TEXT DEFAULT 'submitted',
    reward_paid REAL DEFAULT 0,
    disbursement_tx TEXT,
    submitted_at INTEGER NOT NULL,
    FOREIGN KEY(bounty_id) REFERENCES bounties(id)
  );

  CREATE TABLE IF NOT EXISTS disbursements (
    id TEXT PRIMARY KEY,
    bounty_id TEXT NOT NULL,
    submission_id TEXT NOT NULL,
    recipient_address TEXT NOT NULL,
    recipient_email TEXT,
    amount REAL NOT NULL,
    tx_hash TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    distributed_at INTEGER NOT NULL,
    FOREIGN KEY(bounty_id) REFERENCES bounties(id),
    FOREIGN KEY(submission_id) REFERENCES bounty_submissions(id)
  );
`);

// Gracefully add social and password columns if migrating existing table
try { db.exec(`ALTER TABLE users ADD COLUMN telegram TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN discord TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN x TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN github TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN password_hash TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE verification_codes ADD COLUMN pending_data TEXT;`); } catch (e) {}

console.log(`[Database] SQLite initialized at: ${dbPath}`);

/**
 * Hash password securely using Node's scrypt
 */
export function hashPassword(password) {
  if (!password) return null;
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored scrypt hash
 */
export function verifyPassword(password, storedHash) {
  if (!password || !storedHash || !storedHash.includes(':')) return false;
  try {
    const [salt, originalHash] = storedHash.split(':');
    const hashBuffer = Buffer.from(scryptSync(password, salt, 64).toString('hex'), 'hex');
    const originalBuffer = Buffer.from(originalHash, 'hex');
    if (hashBuffer.length !== originalBuffer.length) return false;
    return timingSafeEqual(hashBuffer, originalBuffer);
  } catch (e) {
    return false;
  }
}

/**
 * Update a user's password in the database
 */
export function updateUserPassword(userId, newPassword) {
  const hash = hashPassword(newPassword);
  db.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`).run(hash, userId);
  return true;
}

/**
 * Generate an Arc L1 simulation address
 */
function generateArcAddress() {
  return '0x' + crypto.randomBytes(20).toString('hex');
}

/**
 * Generate a 6-digit numeric OTP verification code
 */
export function createVerificationCode(email, type = 'login', pendingData = null) {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Invalidate any existing unused codes for this email
  const invalidateStmt = db.prepare(`
    UPDATE verification_codes SET used = 1 WHERE email = ? AND used = 0
  `);
  invalidateStmt.run(normalizedEmail);

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry
  const serializedPending = pendingData ? (typeof pendingData === 'string' ? pendingData : JSON.stringify(pendingData)) : null;

  const insertStmt = db.prepare(`
    INSERT INTO verification_codes (email, code, type, pending_data, expires_at, used, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `);
  insertStmt.run(normalizedEmail, code, type, serializedPending, expiresAt, now);

  console.log(`[Auth Service] Verification code generated for ${normalizedEmail}: [${code}] (Type: ${type})`);

  return { code, expiresAt };
}

/**
 * Verify a 6-digit code for an email
 */
export function verifyCode(email, code) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCode = code.trim();
  const now = Date.now();

  const queryStmt = db.prepare(`
    SELECT * FROM verification_codes 
    WHERE email = ? AND code = ? AND used = 0 AND expires_at > ?
    ORDER BY created_at DESC LIMIT 1
  `);
  const record = queryStmt.get(normalizedEmail, normalizedCode, now);

  if (!record) {
    return { valid: false, error: 'Invalid or expired verification code' };
  }

  // Mark as used
  const updateStmt = db.prepare(`UPDATE verification_codes SET used = 1 WHERE id = ?`);
  updateStmt.run(record.id);

  let pendingData = null;
  if (record.pending_data) {
    try {
      pendingData = JSON.parse(record.pending_data);
    } catch (e) {
      pendingData = record.pending_data;
    }
  }

  return { valid: true, type: record.type, pendingData };
}

/**
 * Check if an email or wallet address has administrative privileges
 */
export function isAdminUser(email, walletAddress) {
  const adminEmails = (process.env.ADMIN_EMAILS || 'jasminee0904@gmail.com,olajideabdulquadri0@gmail.com,olajideabdulquadri97@gmail.com,olajideabdulquadri22@gmail.com')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  
  const adminWallets = (process.env.ADMIN_WALLETS || '')
    .split(',')
    .map(w => w.trim().toLowerCase())
    .filter(Boolean);

  if (email && adminEmails.includes(email.toLowerCase())) {
    return true;
  }
  if (walletAddress && adminWallets.includes(walletAddress.toLowerCase())) {
    return true;
  }
  return false;
}

/**
 * Decorate user object with dynamic role & admin status
 */
export function formatUserRecord(user) {
  if (!user) return null;
  const isAdmin = isAdminUser(user.email, user.wallet_address);
  return {
    ...user,
    is_admin: isAdmin,
    role: isAdmin ? 'admin' : (user.role || 'creator')
  };
}

/**
 * Get user by email
 */
export function getUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  return formatUserRecord(stmt.get(normalizedEmail));
}

/**
 * Get user by username
 */
export function getUserByUsername(username) {
  const normalizedUsername = username.trim().toLowerCase();
  const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
  return formatUserRecord(stmt.get(normalizedUsername));
}

/**
 * Get user by ID
 */
export function getUserById(id) {
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return formatUserRecord(stmt.get(id));
}

/**
 * Create a new user in SQLite
 */
export function createUser({
  email,
  name,
  username,
  avatar,
  provider = 'email',
  discipline = 'Content',
  password = null,
  passwordHash = null
}) {
  const normalizedEmail = email.trim().toLowerCase();
  let cleanUsername = (username || normalizedEmail.split('@')[0])
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');

  if (!cleanUsername) {
    cleanUsername = 'creator-' + Math.floor(1000 + Math.random() * 9000);
  }

  // Ensure username uniqueness
  let finalUsername = cleanUsername;
  let counter = 1;
  while (getUserByUsername(finalUsername)) {
    finalUsername = `${cleanUsername}-${counter}`;
    counter++;
  }

  const id = 'usr_' + crypto.randomBytes(12).toString('hex');
  const walletAddress = generateArcAddress();
  const defaultAvatar = avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;
  const now = Date.now();
  const initialBalance = 1000.0; // 1,000 USDC welcoming grant
  const finalPasswordHash = passwordHash || (password ? hashPassword(password) : null);

  const insertStmt = db.prepare(`
    INSERT INTO users (id, email, name, username, avatar, wallet_address, usdc_balance, provider, role, discipline, bio, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'creator', ?, 'Web3 Creator on Circle Arc L1', ?, ?)
  `);

  insertStmt.run(
    id,
    normalizedEmail,
    name || cleanUsername,
    finalUsername,
    defaultAvatar,
    walletAddress,
    initialBalance,
    provider,
    discipline,
    finalPasswordHash,
    now
  );

  return getUserById(id);
}

/**
 * Create a persistent session token
 */
export function createSession(userId) {
  const token = 'arc_sess_' + crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days

  const stmt = db.prepare(`
    INSERT INTO sessions (token, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(token, userId, expiresAt, now);

  return { token, expiresAt };
}

/**
 * Get user by session token
 */
export function getUserByToken(token) {
  if (!token) return null;
  const now = Date.now();

  const stmt = db.prepare(`
    SELECT u.* FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > ?
  `);
  return formatUserRecord(stmt.get(token, now));
}

/**
 * Connect or disconnect a social platform for a user
 * platforms supported: 'telegram', 'discord', 'x', 'github'
 */
export function updateUserSocial(userId, platform, handle) {
  const allowed = ['telegram', 'discord', 'x', 'github'];
  if (!allowed.includes(platform)) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const cleanHandle = handle ? handle.trim().replace(/^@/, '') : null;
  const stmt = db.prepare(`UPDATE users SET ${platform} = ? WHERE id = ?`);
  stmt.run(cleanHandle, userId);

  return getUserById(userId);
}

/**
 * Connect or update wallet address for a user
 */
export function updateUserWallet(userId, walletAddress) {
  if (!walletAddress || !walletAddress.startsWith('0x')) {
    throw new Error('Valid EVM wallet address required');
  }

  const stmt = db.prepare(`UPDATE users SET wallet_address = ? WHERE id = ?`);
  stmt.run(walletAddress.toLowerCase(), userId);

  return getUserById(userId);
}

/**
 * Update general creator profile
 */
export function updateUserProfile(userId, { name, username, bio, discipline, avatar }) {
  const user = getUserById(userId);
  if (!user) throw new Error('User not found');

  const updatedName = name !== undefined ? name.trim() : user.name;
  const updatedUsername = username !== undefined ? username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') : user.username;
  const updatedBio = bio !== undefined ? bio.trim() : user.bio;
  const updatedDiscipline = discipline !== undefined ? discipline : user.discipline;
  const updatedAvatar = avatar !== undefined ? avatar : user.avatar;

  const stmt = db.prepare(`
    UPDATE users SET name = ?, username = ?, bio = ?, discipline = ?, avatar = ? WHERE id = ?
  `);
  stmt.run(updatedName, updatedUsername, updatedBio, updatedDiscipline, updatedAvatar, userId);

  return getUserById(userId);
}

/**
 * Get user by wallet address
 */
export function getUserByWalletAddress(address) {
  if (!address) return null;
  const stmt = db.prepare(`SELECT * FROM users WHERE wallet_address = ?`);
  return formatUserRecord(stmt.get(address.toLowerCase()));
}

/**
 * Create a cryptographic challenge nonce for wallet authentication
 */
export function createWalletChallenge(address) {
  const normalized = address.toLowerCase();
  const nonce = crypto.randomBytes(16).toString('hex');
  const now = Date.now();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity
  const message = `Sign in to ArcBounty (Circle Arc L1)\nNetwork: Circle Arc (Chain ID 5042)\nAddress: ${normalized}\nNonce: ${nonce}\nIssued At: ${new Date(now).toISOString()}`;

  // Invalidate past challenges for this address
  const invalidateStmt = db.prepare(`UPDATE auth_challenges SET used = 1 WHERE address = ? AND used = 0`);
  invalidateStmt.run(normalized);

  const insertStmt = db.prepare(`
    INSERT INTO auth_challenges (address, nonce, message, expires_at, used, created_at)
    VALUES (?, ?, ?, ?, 0, ?)
  `);
  insertStmt.run(normalized, nonce, message, expiresAt, now);

  return { message, nonce, expiresAt };
}

/**
 * Verify and consume a wallet challenge nonce
 */
export function verifyWalletChallenge(address, nonce) {
  const normalized = address.toLowerCase();
  const now = Date.now();

  const queryStmt = db.prepare(`
    SELECT * FROM auth_challenges
    WHERE address = ? AND nonce = ? AND used = 0 AND expires_at > ?
    ORDER BY created_at DESC LIMIT 1
  `);
  const record = queryStmt.get(normalized, nonce, now);

  if (!record) {
    return { valid: false, error: 'Challenge expired or already used. Please request a new signature.' };
  }

  // Mark challenge as used
  const updateStmt = db.prepare(`UPDATE auth_challenges SET used = 1 WHERE id = ?`);
  updateStmt.run(record.id);

  return { valid: true, message: record.message };
}

// =============================================================================
// BOUNTIES & ESCROW PAYMENTS ENGINE
// =============================================================================

export const INITIAL_BOUNTIES = [
  {
    id: 'bounty-arc-001',
    bountyId: '0x8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a01',
    category: 'DESIGN',
    categoryName: 'Design & 3D',
    categoryColor: '#ff578a',
    title: 'Design Official 3D Mascot & Telegram Sticker Pack for Circle Arc',
    submissionType: 'Figma / 3D Render / PNG Pack',
    issueUrl: 'https://github.com/circlefin/arc/issues/45',
    amount: 1200,
    tags: ['3D Art', 'Figma', 'Mascot', 'Branding', 'Stickers'],
    status: 'Open',
    paymentStatus: 'funded',
    depositTx: '0xarc9281a8b7c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a01',
    escrowWallet: process.env.ESCROW_WALLET_ADDRESS || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884',
    maintainer: '0x461cd48D95993242bB04774cc68042795586BbAd',
    maintainerName: 'Circle Creative Guild',
    maintainerEmail: 'guild@circle.com',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now() - 86400000 * 1,
    deadline: Date.now() + 86400000 * 10,
    isAiEligible: 1,
    description: 'We need an iconic, neo-brutalist 3D mascot representing Arc L1 (speed, dollar-native gas, institutional trust). Deliverable: 3D Blender/GLTF asset + 15 expressive stickers for Telegram and Discord.'
  },
  {
    id: 'bounty-arc-002',
    bountyId: '0x7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b02',
    category: 'VIDEO',
    categoryName: 'Video & Motion',
    categoryColor: '#ffe600',
    title: 'Produce a 60-Second Viral Motion Explainer: "Why Arc Changes Everything"',
    submissionType: 'Loom / YouTube / MP4 Link',
    issueUrl: 'https://github.com/arc-community/media/issues/12',
    amount: 1500,
    tags: ['Motion Graphics', 'TikTok / Reels', '3D After Effects', 'Video'],
    status: 'Open',
    paymentStatus: 'funded',
    depositTx: '0xarc7192a8b7c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a02',
    escrowWallet: process.env.ESCROW_WALLET_ADDRESS || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884',
    maintainer: '0x8b415aE3956992b0cbC6C78c485A4d099F6331cE',
    maintainerName: 'Arc Marketing DAO',
    maintainerEmail: 'marketing@arc.io',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now() - 86400000 * 2,
    deadline: Date.now() + 86400000 * 8,
    isAiEligible: 1,
    description: 'High-octane, fast-paced video showing the pain of fluctuating gas fees on other chains vs instant sub-second USDC transactions on Circle Arc. High-quality kinetic typography and sound design.'
  },
  {
    id: 'bounty-arc-003',
    bountyId: '0x6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c03',
    category: 'WRITING',
    categoryName: 'Writing & Research',
    categoryColor: '#bb86fc',
    title: "Write a 15-Post Viral Deep-Dive Thread on Arc's Malachite BFT vs Tendermint",
    submissionType: 'Twitter/X Thread Link / Notion',
    issueUrl: 'https://github.com/arc-research/papers/issues/8',
    amount: 800,
    tags: ['Research', 'X Thread', 'Infographics', 'Architecture'],
    status: 'InReview',
    paymentStatus: 'funded',
    depositTx: '0xarc6182a8b7c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a03',
    escrowWallet: process.env.ESCROW_WALLET_ADDRESS || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884',
    maintainer: '0x461cd48D95993242bB04774cc68042795586BbAd',
    maintainerName: 'Arc Research Foundation',
    maintainerEmail: 'research@arc.io',
    solver: '0x9923Bc8E4786A6B71D0052F5eCE984bC9d123456',
    solverType: 'Web3 Researcher (Threador)',
    prUrl: 'https://x.com/crypto_analyst/status/18389102938102',
    createdAt: Date.now() - 86400000 * 3,
    deadline: Date.now() + 86400000 * 4,
    isAiEligible: 1,
    description: "Break down Circle Arc's consensus algorithm for both retail and developer audiences. Must include visual diagrams explaining 380ms deterministic finality and institutional validator sets (BlackRock, ICE)."
  },
  {
    id: 'bounty-arc-004',
    bountyId: '0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d04',
    category: 'MEMES',
    categoryName: 'Memes & Social',
    categoryColor: '#00f0ff',
    title: 'Arc Meme Contest: Native USDC Gas vs Volatile Gas Token Spikes',
    submissionType: 'X Post Link / Imgur Album',
    issueUrl: 'https://github.com/arc-memes/contests/issues/3',
    amount: 450,
    tags: ['Memes', 'Social', 'Humor', 'Viral', 'X/Twitter'],
    status: 'Settled',
    paymentStatus: 'settled',
    depositTx: '0xarc5182a8b7c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a04',
    escrowWallet: process.env.ESCROW_WALLET_ADDRESS || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884',
    maintainer: '0x1234567890abcdef1234567890abcdef12345678',
    maintainerName: 'Arc Meme Department',
    maintainerEmail: 'memes@arc.io',
    solver: '0x71C568ba74d3B107292995bB791e317614399A45',
    solverType: 'Web3 Meme Lord',
    prUrl: 'https://x.com/memegod_sol/status/1838192830192',
    createdAt: Date.now() - 86400000 * 5,
    deadline: Date.now() - 86400000 * 1,
    settledAt: Date.now() - 86400000 * 1,
    settlementTx: '0xarc91823a8b7c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a04settle',
    isAiEligible: 1,
    description: 'Create 5 top-tier, viral-ready memes contrasting user pain on high gas fee networks with the effortless $0.0004 USDC gas experience on Arc. Winner receives instant USDC.'
  },
  {
    id: 'bounty-arc-005',
    bountyId: '0x4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e05',
    category: 'DEV',
    categoryName: 'Code & Apps',
    categoryColor: '#00e676',
    title: 'Build a 1-Click CCTP Teleport Widget for Web3 Storefronts',
    submissionType: 'GitHub PR & Live Demo',
    issueUrl: 'https://github.com/circlefin/cctp-teleport-widget/issues/19',
    amount: 2000,
    tags: ['TypeScript', 'React', 'CCTP', 'EIP-3009', 'SDK'],
    status: 'Open',
    paymentStatus: 'funded',
    depositTx: '0xarc4182a8b7c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a05',
    escrowWallet: process.env.ESCROW_WALLET_ADDRESS || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884',
    maintainer: '0x8b415aE3956992b0cbC6C78c485A4d099F6331cE',
    maintainerName: 'Circle Developer Platform',
    maintainerEmail: 'cctp@circle.com',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now() - 86400000 * 1,
    deadline: Date.now() + 86400000 * 14,
    isAiEligible: 1,
    description: 'Create an embeddable React & Vanilla JS widget that lets users teleport USDC from Solana or Base directly into Arc Mainnet in 1 click, auto-funding their checkout.'
  }
];

export function seedInitialBountiesIfEmpty() {
  try {
    const countRow = db.prepare(`SELECT count(*) as count FROM bounties`).get();
    if (countRow.count === 0) {
      const insert = db.prepare(`
        INSERT INTO bounties (
          id, bounty_id, title, category, category_name, category_color,
          submission_type, issue_url, amount, tags, status, payment_status,
          deposit_tx, escrow_wallet, maintainer, maintainer_name, maintainer_email,
          solver, solver_type, pr_url, is_ai_eligible, description, created_at,
          deadline, settled_at, settlement_tx
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?
        )
      `);

      for (const b of INITIAL_BOUNTIES) {
        insert.run(
          b.id,
          b.bountyId,
          b.title,
          b.category,
          b.categoryName,
          b.categoryColor,
          b.submissionType,
          b.issueUrl,
          b.amount,
          JSON.stringify(b.tags),
          b.status,
          b.paymentStatus,
          b.depositTx,
          b.escrowWallet,
          b.maintainer,
          b.maintainerName,
          b.maintainerEmail,
          b.solver,
          b.solverType,
          b.prUrl,
          b.isAiEligible ? 1 : 0,
          b.description,
          b.createdAt,
          b.deadline,
          b.settledAt || null,
          b.settlementTx || null
        );
      }

      // Seed initial participant submission for bounty-arc-003
      const subStmt = db.prepare(`
        INSERT INTO bounty_submissions (
          id, bounty_id, creator_id, creator_name, creator_email,
          wallet_address, submission_url, notes, solver_type, status,
          reward_paid, disbursement_tx, submitted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      subStmt.run(
        'sub_seed_001',
        'bounty-arc-003',
        'usr_seed_creator',
        'Alex Researcher',
        'crypto_analyst@x.com',
        '0x9923Bc8E4786A6B71D0052F5eCE984bC9d123456',
        'https://x.com/crypto_analyst/status/18389102938102',
        'Completed full 15-tweet breakdown with visual architecture flowcharts.',
        'Web3 Researcher (Threador)',
        'submitted',
        0,
        null,
        Date.now() - 86400000 * 2
      );
    }
  } catch (err) {
    console.warn('[Database] Failed to seed initial bounties:', err.message);
  }
}

// Auto seed bounties if table is empty
try {
  seedInitialBountiesIfEmpty();
} catch (e) {
  console.warn('[Database] Seed check warning:', e.message);
}

/**
 * Helper to parse a bounty database row into application format
 */
export function parseBountyRecord(row) {
  if (!row) return null;
  let parsedTags = [];
  try {
    parsedTags = row.tags ? JSON.parse(row.tags) : [];
  } catch (e) {
    parsedTags = row.tags ? row.tags.split(',') : [];
  }

  // Count submissions
  let submissionsCount = 0;
  try {
    const subCount = db.prepare(`SELECT count(*) as count FROM bounty_submissions WHERE bounty_id = ?`).get(row.id);
    submissionsCount = subCount ? subCount.count : 0;
  } catch (e) {}

  let category = (row.category || 'CONTENT').toUpperCase();
  let categoryName = row.category_name;
  if (category === 'CREATIVE' || category === 'VIDEO' || category === 'WRITING') {
    category = 'CONTENT';
    categoryName = 'Content';
  } else if (category === 'MEMES') {
    category = 'SOCIAL';
    categoryName = 'All Social';
  }

  return {
    id: row.id,
    bountyId: row.bounty_id,
    title: row.title,
    category,
    categoryName: categoryName || 'Content',
    categoryColor: row.category_color || '#e9a13f',
    submissionType: row.submission_type,
    issueUrl: row.issue_url,
    amount: row.amount,
    tags: parsedTags,
    status: row.status,
    paymentStatus: row.payment_status,
    depositTx: row.deposit_tx,
    escrowWallet: row.escrow_wallet,
    maintainer: row.maintainer,
    maintainerName: row.maintainer_name,
    maintainerEmail: row.maintainer_email,
    solver: row.solver,
    solverType: row.solver_type,
    prUrl: row.pr_url,
    isAiEligible: false,
    description: row.description,
    createdAt: row.created_at,
    deadline: row.deadline,
    settledAt: row.settled_at,
    settlementTx: row.settlement_tx,
    submissionsCount
  };
}

/**
 * Get all bounties with optional filtering
 */
export function getAllBounties(filters = {}) {
  const { status, category, search } = filters;
  let query = `SELECT * FROM bounties WHERE 1=1`;
  const params = [];

  if (status && status !== 'All') {
    query += ` AND LOWER(status) = ?`;
    params.push(status.toLowerCase());
  }

  if (category && category !== 'ALL') {
    if (category === 'CONTENT' || category === 'CREATIVE') {
      query += ` AND category IN ('CONTENT', 'CREATIVE', 'VIDEO', 'WRITING')`;
    } else {
      query += ` AND category = ?`;
      params.push(category);
    }
  }

  if (search) {
    query += ` AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)`;
    const searchPattern = `%${search.toLowerCase()}%`;
    params.push(searchPattern, searchPattern);
  }

  query += ` ORDER BY created_at DESC`;

  const stmt = db.prepare(query);
  const rows = stmt.all(...params);
  return rows.map(parseBountyRecord);
}

/**
 * Get bounty by ID or hash, including all participant submissions
 */
export function getBountyById(id) {
  const stmt = db.prepare(`SELECT * FROM bounties WHERE id = ? OR bounty_id = ?`);
  const row = stmt.get(id, id);
  if (!row) return null;

  const bounty = parseBountyRecord(row);

  // Fetch participant submissions
  const subStmt = db.prepare(`SELECT * FROM bounty_submissions WHERE bounty_id = ? ORDER BY submitted_at DESC`);
  bounty.submissions = subStmt.all(bounty.id);

  return bounty;
}

/**
 * Create a new bounty with escrow deposit tracking
 */
export function createBountyRecord(data) {
  const id = `bounty-arc-${Date.now().toString().slice(-4)}`;
  const bountyId = `0x${crypto.randomBytes(32).toString('hex')}`;
  const escrowWallet = data.escrowWallet || process.env.ESCROW_WALLET_ADDRESS || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884';
  const now = Date.now();
  const deadlineDays = parseInt(data.deadlineDays || '14', 10);
  const deadline = now + deadlineDays * 86400000;
  let category = (data.category || 'CONTENT').toUpperCase();
  if (category === 'CREATIVE' || category === 'VIDEO' || category === 'WRITING') {
    category = 'CONTENT';
  }
  const categoryName = data.categoryName || (category === 'CONTENT' ? 'Content' : data.category);
  const tagsJson = JSON.stringify(Array.isArray(data.tags) ? data.tags : [category, 'Arc', 'USDC']);

  const stmt = db.prepare(`
    INSERT INTO bounties (
      id, bounty_id, title, category, category_name, category_color,
      submission_type, issue_url, amount, tags, status, payment_status,
      deposit_tx, escrow_wallet, maintainer, maintainer_name, maintainer_email,
      solver, solver_type, pr_url, is_ai_eligible, description, created_at,
      deadline
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, 'Open', ?,
      ?, ?, ?, ?, ?,
      NULL, NULL, NULL, 0, ?, ?,
      ?
    )
  `);

  stmt.run(
    id,
    bountyId,
    data.title,
    category,
    categoryName,
    data.categoryColor || '#e9a13f',
    data.submissionType || 'Deliverable URL',
    data.issueUrl || `https://arcbounty.io/task/${id}`,
    parseFloat(data.amount || 0),
    tagsJson,
    data.depositTx ? 'funded' : 'funded',
    data.depositTx || `0xdep${crypto.randomBytes(16).toString('hex')}`,
    escrowWallet,
    data.maintainer || '0x461cd48D95993242bB04774cc68042795586BbAd',
    data.maintainerName || 'Circle Creative Guild',
    data.maintainerEmail || null,
    data.description || 'Deliver high quality content satisfying specifications.',
    now,
    deadline
  );

  return getBountyById(id);
}

/**
 * Record a creator participant taking part in a challenge
 */
export function createBountySubmission({
  bountyId,
  creatorId,
  creatorName,
  creatorEmail,
  walletAddress,
  submissionUrl,
  notes,
  solverType = 'Human Creator'
}) {
  const bounty = getBountyById(bountyId);
  if (!bounty) throw new Error('Bounty not found');

  if (!submissionUrl) throw new Error('Deliverable URL is required');
  if (!walletAddress) throw new Error('Payout wallet address is required');

  const subId = 'sub_' + crypto.randomBytes(8).toString('hex');
  const now = Date.now();

  const stmt = db.prepare(`
    INSERT INTO bounty_submissions (
      id, bounty_id, creator_id, creator_name, creator_email,
      wallet_address, submission_url, notes, solver_type, status,
      reward_paid, disbursement_tx, submitted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', 0, NULL, ?)
  `);

  stmt.run(
    subId,
    bounty.id,
    creatorId || null,
    creatorName || 'Anonymous Creator',
    creatorEmail || null,
    walletAddress.toLowerCase(),
    submissionUrl,
    notes || null,
    solverType,
    now
  );

  // Update bounty status to InReview
  db.prepare(`UPDATE bounties SET status = 'InReview' WHERE id = ? AND status = 'Open'`).run(bounty.id);

  return {
    id: subId,
    bountyId: bounty.id,
    submissionUrl,
    walletAddress,
    submittedAt: now
  };
}

/**
 * Get all participant submissions for a bounty
 */
export function getBountySubmissions(bountyId) {
  const stmt = db.prepare(`SELECT * FROM bounty_submissions WHERE bounty_id = ? ORDER BY submitted_at DESC`);
  return stmt.all(bountyId);
}

/**
 * Admin Action: Distribute USDC from escrow to winning creator
 */
export function disburseBountyReward({ bountyId, submissionId, adminEmail, customAmount }) {
  const bounty = getBountyById(bountyId);
  if (!bounty) throw new Error('Bounty not found');

  const subStmt = db.prepare(`SELECT * FROM bounty_submissions WHERE id = ? AND bounty_id = ?`);
  const submission = subStmt.get(submissionId, bounty.id);
  if (!submission) throw new Error('Participant submission not found');

  const amountToPay = customAmount ? parseFloat(customAmount) : bounty.amount;
  const txHash = `0xarc${Date.now().toString(16)}${crypto.randomBytes(8).toString('hex')}`;
  const now = Date.now();
  const disbId = 'disb_' + crypto.randomBytes(8).toString('hex');

  // Insert disbursement record
  const disbStmt = db.prepare(`
    INSERT INTO disbursements (
      id, bounty_id, submission_id, recipient_address, recipient_email,
      amount, tx_hash, admin_email, distributed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  disbStmt.run(
    disbId,
    bounty.id,
    submission.id,
    submission.wallet_address,
    submission.creator_email || null,
    amountToPay,
    txHash,
    adminEmail || 'admin',
    now
  );

  // Mark submission as awarded
  db.prepare(`
    UPDATE bounty_submissions
    SET status = 'awarded', reward_paid = ?, disbursement_tx = ?
    WHERE id = ?
  `).run(amountToPay, txHash, submission.id);

  // Update bounty as settled
  db.prepare(`
    UPDATE bounties
    SET status = 'Settled', payment_status = 'settled', solver = ?, solver_type = ?, pr_url = ?, settled_at = ?, settlement_tx = ?
    WHERE id = ?
  `).run(
    submission.wallet_address,
    submission.solver_type,
    submission.submission_url,
    now,
    txHash,
    bounty.id
  );

  // If the recipient user exists in users table, credit their balance
  try {
    const userStmt = db.prepare(`SELECT * FROM users WHERE LOWER(wallet_address) = ? OR (email IS NOT NULL AND LOWER(email) = ?)`);
    const existingUser = userStmt.get(
      submission.wallet_address.toLowerCase(),
      (submission.creator_email || '').toLowerCase()
    );
    if (existingUser) {
      db.prepare(`UPDATE users SET usdc_balance = usdc_balance + ? WHERE id = ?`).run(amountToPay, existingUser.id);
    }
  } catch (e) {}

  return {
    success: true,
    disbursementId: disbId,
    bountyId: bounty.id,
    recipient: submission.wallet_address,
    recipientEmail: submission.creator_email,
    recipientName: submission.creator_name,
    amount: amountToPay,
    txHash,
    settledAt: now,
    bountyTitle: bounty.title
  };
}

/**
 * Get aggregate statistics for the Admin Dashboard
 */
export function getAdminOverviewStats() {
  const bountyStats = db.prepare(`
    SELECT
      count(*) as total_bounties,
      COALESCE(sum(amount), 0) as total_escrowed,
      sum(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open_bounties,
      sum(CASE WHEN status = 'InReview' THEN 1 ELSE 0 END) as in_review_bounties,
      sum(CASE WHEN status = 'Settled' THEN 1 ELSE 0 END) as settled_bounties
    FROM bounties
  `).get();

  const subStats = db.prepare(`SELECT count(*) as total_submissions FROM bounty_submissions`).get();

  const disbStats = db.prepare(`
    SELECT
      count(*) as total_distributions,
      COALESCE(sum(amount), 0) as total_distributed_amount
    FROM disbursements
  `).get();

  return {
    totalBounties: bountyStats.total_bounties,
    totalEscrowedUsdc: bountyStats.total_escrowed,
    openBounties: bountyStats.open_bounties || 0,
    inReviewBounties: bountyStats.in_review_bounties || 0,
    settledBounties: bountyStats.settled_bounties || 0,
    totalSubmissions: subStats.total_submissions || 0,
    totalDistributions: disbStats.total_distributions || 0,
    totalDistributedUsdc: disbStats.total_distributed_amount || 0,
    escrowWallet: process.env.ESCROW_WALLET_ADDRESS || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884'
  };
}



