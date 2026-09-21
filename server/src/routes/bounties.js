import express from 'express';
import {
  getAllBounties,
  getBountyById,
  createBountyRecord,
  createBountySubmission,
  disburseBountyReward,
  getUserByToken
} from '../db.js';

export const bountyRouter = express.Router();

/**
 * GET /api/bounties/escrow-wallet
 * Retrieve platform escrow wallet address and chain metadata for deposit
 */
bountyRouter.get('/escrow-wallet', (req, res) => {
  const escrowWallet = process.env.ESCROW_WALLET_ADDRESS || '0x8b415aE3956992b0cbC6C78c485A4d099F6331cE';
  res.json({
    success: true,
    escrowWallet,
    chainId: parseInt(process.env.ARC_CHAIN_ID || '5042', 10),
    networkName: 'Circle Arc L1',
    token: 'Canonical USDC',
    tokenAddress: '0x3600000000000000000000000000000000000000'
  });
});

/**
 * GET /api/bounties
 * List bounties with filtering (persisted in SQLite)
 */
bountyRouter.get('/', (req, res) => {
  try {
    const list = getAllBounties(req.query);
    res.json({
      success: true,
      total: list.length,
      bounties: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/bounties/:id
 * Retrieve specific bounty by ID or hash, including all participant submissions
 */
bountyRouter.get('/:id', (req, res) => {
  try {
    const bounty = getBountyById(req.params.id);
    if (!bounty) {
      return res.status(404).json({ success: false, error: 'Bounty not found' });
    }
    res.json({ success: true, bounty });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/bounties
 * Create a new bounty with verified escrow deposit instructions
 */
bountyRouter.post('/', (req, res) => {
  try {
    const { title, amount } = req.body;
    if (!title || !amount) {
      return res.status(400).json({ success: false, error: 'Title and amount are required' });
    }

    // Optional auth token to link maintainer email
    const authHeader = req.headers.authorization;
    let maintainerEmail = req.body.maintainerEmail;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const user = getUserByToken(authHeader.split(' ')[1]);
      if (user) {
        maintainerEmail = maintainerEmail || user.email;
      }
    }

    const newBounty = createBountyRecord({
      ...req.body,
      maintainerEmail
    });

    res.status(201).json({
      success: true,
      message: 'Bounty created and designated for Arc Escrow locking',
      bounty: newBounty
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/bounties/:id/participate
 * Submit a deliverable to participate in a bounty challenge
 */
bountyRouter.post('/:id/participate', (req, res) => {
  try {
    const { submissionUrl, walletAddress, notes, creatorName, creatorEmail, solverType } = req.body;

    if (!submissionUrl) {
      return res.status(400).json({ success: false, error: 'Deliverable submission URL is required' });
    }
    if (!walletAddress) {
      return res.status(400).json({ success: false, error: 'Payout wallet address is required' });
    }

    // Check optional session token
    let authUser = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      authUser = getUserByToken(authHeader.split(' ')[1]);
    }

    const submission = createBountySubmission({
      bountyId: req.params.id,
      creatorId: authUser?.id || null,
      creatorName: creatorName || authUser?.name || 'Anonymous Creator',
      creatorEmail: creatorEmail || authUser?.email || null,
      walletAddress: walletAddress || authUser?.wallet_address,
      submissionUrl,
      notes,
      solverType: solverType || 'Human Creator'
    });

    const updatedBounty = getBountyById(req.params.id);

    res.json({
      success: true,
      message: 'Submission successfully recorded! Visible to challenge maintainer & admin.',
      submission,
      bounty: updatedBounty
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * Backwards compatibility for /api/bounties/:id/claim
 */
bountyRouter.post('/:id/claim', (req, res) => {
  try {
    const { prUrl, submissionUrl, solverAddress, walletAddress, solverType, notes } = req.body;
    const effectiveUrl = submissionUrl || prUrl;
    const effectiveWallet = walletAddress || solverAddress;

    if (!effectiveUrl) {
      return res.status(400).json({ success: false, error: 'Deliverable proof URL is required' });
    }
    if (!effectiveWallet) {
      return res.status(400).json({ success: false, error: 'Wallet address is required' });
    }

    const submission = createBountySubmission({
      bountyId: req.params.id,
      walletAddress: effectiveWallet,
      submissionUrl: effectiveUrl,
      solverType: solverType || 'Human Creator',
      notes: notes || 'Deliverable proof submitted'
    });

    const updatedBounty = getBountyById(req.params.id);

    res.json({
      success: true,
      message: 'Deliverable proof submitted for review',
      submission,
      bounty: updatedBounty
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/bounties/:id/release
 * Maintainer approves PR and disburses bounty
 */
bountyRouter.post('/:id/release', (req, res) => {
  try {
    const bounty = getBountyById(req.params.id);
    if (!bounty) {
      return res.status(404).json({ success: false, error: 'Bounty not found' });
    }

    if (!bounty.submissions || bounty.submissions.length === 0) {
      return res.status(400).json({ success: false, error: 'No submissions exist to release reward to' });
    }

    const winningSub = bounty.submissions[0];
    const result = disburseBountyReward({
      bountyId: bounty.id,
      submissionId: winningSub.id,
      adminEmail: 'maintainer'
    });

    res.json({
      success: true,
      message: 'USDC reward disbursed to creator on Arc Mainnet',
      settlement: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
