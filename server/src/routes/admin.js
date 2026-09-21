import express from 'express';
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

/**
 * Middleware: Verify Admin Access
 * Validates session token and guarantees the authenticated user is an authorized admin.
 */
export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in with an authorized admin account.'
    });
  }

  const token = authHeader.split(' ')[1];
  const user = getUserByToken(token);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired session token.'
    });
  }

  const isAdmin = isAdminUser(user.email, user.wallet_address);
  if (!isAdmin && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Your account does not have administrative privileges.'
    });
  }

  req.user = user;
  next();
}

// Protect all routes in this router with requireAdmin
adminRouter.use(requireAdmin);

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
