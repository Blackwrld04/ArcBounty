import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure server/data directory exists
const dataDir = join(__dirname, '../data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'arcbounty.db');
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
    discipline TEXT DEFAULT 'Design',
    bio TEXT,
    telegram TEXT,
    discord TEXT,
    x TEXT,
    github TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    type TEXT NOT NULL,
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
`);

// Gracefully add social columns if migrating existing users table
try { db.exec(`ALTER TABLE users ADD COLUMN telegram TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN discord TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN x TEXT;`); } catch (e) {}
try { db.exec(`ALTER TABLE users ADD COLUMN github TEXT;`); } catch (e) {}

console.log(`[Database] SQLite initialized at: ${dbPath}`);

/**
 * Generate an Arc L1 simulation address
 */
function generateArcAddress() {
  return '0x' + crypto.randomBytes(20).toString('hex');
}

/**
 * Generate a 6-digit numeric OTP verification code
 */
export function createVerificationCode(email, type = 'login') {
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

  const insertStmt = db.prepare(`
    INSERT INTO verification_codes (email, code, type, expires_at, used, created_at)
    VALUES (?, ?, ?, ?, 0, ?)
  `);
  insertStmt.run(normalizedEmail, code, type, expiresAt, now);

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

  return { valid: true, type: record.type };
}

/**
 * Get user by email
 */
export function getUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
  return stmt.get(normalizedEmail);
}

/**
 * Get user by username
 */
export function getUserByUsername(username) {
  const normalizedUsername = username.trim().toLowerCase();
  const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
  return stmt.get(normalizedUsername);
}

/**
 * Get user by ID
 */
export function getUserById(id) {
  const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
  return stmt.get(id);
}

/**
 * Create a new user in SQLite
 */
export function createUser({ email, name, username, avatar, provider = 'email', discipline = 'Design' }) {
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

  const insertStmt = db.prepare(`
    INSERT INTO users (id, email, name, username, avatar, wallet_address, usdc_balance, provider, role, discipline, bio, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'creator', ?, 'Web3 Creator on Circle Arc L1', ?)
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
  return stmt.get(token, now);
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
  return stmt.get(address.toLowerCase());
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


