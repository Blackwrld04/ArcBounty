-- ==========================================================
-- ArcBounty Production Database Schema for Supabase / PostgreSQL
-- High-concurrency relational schema with connection pooling,
-- indexes, and ACID guarantees for Circle Arc L1 USDC Escrow
-- ==========================================================

-- 1. Users & Creators Directory
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(128) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  avatar TEXT,
  wallet_address VARCHAR(66),
  usdc_balance NUMERIC DEFAULT 0.0,
  provider VARCHAR(50) DEFAULT 'email',
  role VARCHAR(50) DEFAULT 'creator',
  discipline VARCHAR(100) DEFAULT 'Content',
  bio TEXT,
  telegram VARCHAR(100),
  discord VARCHAR(100),
  x VARCHAR(100),
  github VARCHAR(100),
  password_hash TEXT,
  created_at BIGINT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower ON users (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users (wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- 2. Email Verification Codes
CREATE TABLE IF NOT EXISTS verification_codes (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL,
  pending_data TEXT,
  expires_at BIGINT NOT NULL,
  used SMALLINT DEFAULT 0,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_verification_email ON verification_codes (email);

-- 3. Authentication Sessions
CREATE TABLE IF NOT EXISTS sessions (
  token VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);

-- 4. Cryptographic Nonce Challenges for Wallet Sign-in
CREATE TABLE IF NOT EXISTS auth_challenges (
  id BIGSERIAL PRIMARY KEY,
  address VARCHAR(66) NOT NULL,
  nonce VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  used SMALLINT DEFAULT 0,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_challenges_address ON auth_challenges (address);

-- 5. Bounties & Escrow Challenges
CREATE TABLE IF NOT EXISTS bounties (
  id VARCHAR(128) PRIMARY KEY,
  bounty_id VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  category_name VARCHAR(100),
  category_color VARCHAR(50),
  submission_type VARCHAR(100),
  issue_url TEXT,
  amount NUMERIC NOT NULL,
  tags TEXT,
  status VARCHAR(50) DEFAULT 'Open',
  payment_status VARCHAR(50) DEFAULT 'funded',
  deposit_tx VARCHAR(255),
  escrow_wallet VARCHAR(66) NOT NULL,
  maintainer VARCHAR(66) NOT NULL,
  maintainer_name VARCHAR(255),
  maintainer_email VARCHAR(255),
  solver VARCHAR(66),
  solver_type VARCHAR(100),
  pr_url TEXT,
  description TEXT,
  created_at BIGINT NOT NULL,
  deadline BIGINT NOT NULL,
  settled_at BIGINT,
  settlement_tx VARCHAR(255),
  reward_distribution TEXT
);

CREATE INDEX IF NOT EXISTS idx_bounties_status ON bounties (status);
CREATE INDEX IF NOT EXISTS idx_bounties_category ON bounties (category);
CREATE INDEX IF NOT EXISTS idx_bounties_maintainer ON bounties (maintainer);

-- 6. Bounty Submissions (Deliverables, Revisions & Co-Creators)
CREATE TABLE IF NOT EXISTS bounty_submissions (
  id VARCHAR(128) PRIMARY KEY,
  bounty_id VARCHAR(128) NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
  user_id VARCHAR(128),
  creator_id VARCHAR(128),
  creator_name VARCHAR(255),
  creator_email VARCHAR(255),
  wallet_address VARCHAR(66) NOT NULL,
  solver_type VARCHAR(100),
  submission_url TEXT NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'submitted',
  reward_paid NUMERIC DEFAULT 0.0,
  disbursement_tx VARCHAR(255),
  submitted_at BIGINT NOT NULL,
  revision_count INTEGER DEFAULT 1,
  revision_history TEXT,
  collaborators TEXT,
  score_code_quality NUMERIC,
  score_creativity NUMERIC,
  score_completeness NUMERIC,
  reviewer_notes TEXT,
  github_pr_status VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_bounty_submissions_bounty_id ON bounty_submissions (bounty_id);
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_wallet ON bounty_submissions (wallet_address);

-- 7. Bounty Q&A Public Discussions
CREATE TABLE IF NOT EXISTS bounty_discussions (
  id VARCHAR(128) PRIMARY KEY,
  bounty_id VARCHAR(128) NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
  user_id VARCHAR(128),
  author_name VARCHAR(255) NOT NULL,
  author_handle VARCHAR(100),
  author_role VARCHAR(50) DEFAULT 'creator',
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bounty_discussions_bounty_id ON bounty_discussions (bounty_id);

-- 8. Immutable Disbursement & Audit Ledger
CREATE TABLE IF NOT EXISTS disbursements (
  id VARCHAR(128),
  disbursement_id VARCHAR(128) PRIMARY KEY,
  bounty_id VARCHAR(128),
  submission_id VARCHAR(128),
  bounty_title VARCHAR(255),
  sponsor_name VARCHAR(255),
  sponsor_wallet VARCHAR(66),
  recipient_address VARCHAR(66) NOT NULL,
  recipient_email VARCHAR(255),
  amount NUMERIC,
  amount_usdc NUMERIC,
  tx_hash VARCHAR(255) NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  distributed_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_disbursements_recipient ON disbursements (recipient_address);
CREATE INDEX IF NOT EXISTS idx_disbursements_bounty_id ON disbursements (bounty_id);

