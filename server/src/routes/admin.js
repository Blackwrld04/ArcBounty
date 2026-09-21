import express from 'express';
import { randomBytes } from 'crypto';
import {
  getUserByToken,
  isAdminUser,
  getAdminOverviewStats,
  getAllBounties,
  getBountyById,
  getBountySubmissions,
  disburseBountyReward,
  db
} from '../db.js';

export const adminRouter = express.Router();

// In-memory store for authenticated admin password sessions
export const activeAdminTokens = new Map();

/**
 * POST /api/admin/login
 * Public authentication route: validates master administrator password
 */
adminRouter.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = (process.env.ADMIN_PASSWORD || 'arcbounty2026_admin!').trim();

  if (!password || password.trim() !== adminPassword) {
    return res.status(401).json({
      success: false,
      error: 'Invalid administrator password. Access denied.'
    });
  }

  const token = `arc_adm_${randomBytes(24).toString('hex')}`;
  activeAdminTokens.set(token, {
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });

  return res.json({
    success: true,
    message: 'Master administrator access granted',
    token,
    admin: {
      role: 'admin',
      name: 'Master Administrator',
      email: process.env.GMAIL_USER || 'admin@arcbounty.io'
    }
  });
});

/**
 * Middleware: Verify Admin Access
 * Validates either dedicated admin password token or authorized admin user session
 */
export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please enter administrator credentials.'
    });
  }

  const token = authHeader.split(' ')[1];

  // 1. Check dedicated admin password session
  if (activeAdminTokens.has(token)) {
    const session = activeAdminTokens.get(token);
    if (Date.now() < session.expiresAt) {
      req.user = {
        id: 'admin_master',
        email: process.env.GMAIL_USER || 'admin@arcbounty.io',
        name: 'Master Administrator',
        role: 'admin',
        wallet_address: process.env.ESCROW_WALLET_ADDRESS || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884'
      };
      return next();
    } else {
      activeAdminTokens.delete(token);
      return res.status(401).json({
        success: false,
        error: 'Admin session has expired. Please re-enter password.'
      });
    }
  }

  // 2. Fallback: check SQLite database user session token
  const user = getUserByToken(token);
  if (user) {
    const isAdmin = isAdminUser(user.email, user.wallet_address);
    if (isAdmin || user.role === 'admin') {
      req.user = user;
      return next();
    }
    return res.status(403).json({
      success: false,
      error: 'Access denied. Your account does not have administrative privileges.'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid or expired session token.'
  });
}

/**
 * POST /api/admin/logout
 * Invalidate admin session
 */
adminRouter.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeAdminTokens.delete(token);
  }
  res.json({ success: true, message: 'Admin logged out successfully' });
});

// Protect subsequent routes in this router with requireAdmin
adminRouter.use(requireAdmin);

/**
 * GET /api/admin/verify-token
 * Lightweight check to confirm admin token is still valid
 */
adminRouter.get('/verify-token', (req, res) => {
  res.json({
    success: true,
    admin: {
      role: 'admin',
      name: req.user.name,
      email: req.user.email
    }
  });
});

/**
 * GET /api/admin/stats
 * Overview metrics for Admin Dashboard
 */
adminRouter.get('/stats', (req, res) => {
  try {
    const stats = getAdminOverviewStats();
    res.json({
      success: true,
      stats,
      admin: {
        email: req.user.email,
        name: req.user.name,
        walletAddress: req.user.wallet_address
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/bounties
 * All bounties across the platform with full status details & submission counts
 */
adminRouter.get('/bounties', (req, res) => {
  try {
    const bounties = getAllBounties();
    res.json({
      success: true,
      total: bounties.length,
      bounties
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/bounties/:id/submissions
 * Review all creator submissions and participants for a specific challenge
 */
adminRouter.get('/bounties/:id/submissions', (req, res) => {
  try {
    const bounty = getBountyById(req.params.id);
    if (!bounty) {
      return res.status(404).json({ success: false, error: 'Bounty not found' });
    }

    const submissions = getBountySubmissions(bounty.id);
    res.json({
      success: true,
      bounty,
      totalSubmissions: submissions.length,
      submissions
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/distribute
 * Admin dispatches USDC prize directly to the winning creator
 */
adminRouter.post('/distribute', async (req, res) => {
  try {
    const { bountyId, submissionId, amount } = req.body;

    if (!bountyId || !submissionId) {
      return res.status(400).json({
        success: false,
        error: 'bountyId and submissionId are required to disburse funds'
      });
    }

    const settlement = disburseBountyReward({
      bountyId,
      submissionId,
      adminEmail: req.user.email,
      customAmount: amount
    });

    res.json({
      success: true,
      message: `Successfully disbursed $${settlement.amount} USDC to creator!`,
      settlement
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/verify-bounty
 * Admin updates deposit status or confirms on-chain escrow funding
 */
adminRouter.post('/verify-bounty', (req, res) => {
  try {
    const { bountyId, paymentStatus } = req.body;
    if (!bountyId) {
      return res.status(400).json({ success: false, error: 'bountyId is required' });
    }

    const validStatus = paymentStatus || 'funded';
    db.prepare(`UPDATE bounties SET payment_status = ? WHERE id = ?`).run(validStatus, bountyId);

    const updated = getBountyById(bountyId);
    res.json({
      success: true,
      message: `Bounty deposit status updated to ${validStatus}`,
      bounty: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
