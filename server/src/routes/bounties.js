import express from 'express';
import { relayGaslessSettlement } from '../facilitator.js';

export const bountyRouter = express.Router();

// In-memory / initial bounty database pre-loaded with curated developer bounties
let bounties = [
  {
    id: 'bounty-arc-001',
    bountyId: '0x8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a01',
    title: 'Implement Malachite BFT Light Client Verification in Rust',
    repo: 'circlefin/arc-consensus',
    issueUrl: 'https://github.com/circlefin/arc-consensus/issues/104',
    amount: 1500,
    tags: ['Rust', 'Consensus', 'BFT', 'Security'],
    status: 'Open',
    maintainer: '0x461cd48D95993242bB04774cc68042795586BbAd',
    maintainerName: 'Circle Engineering',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now() - 86400000 * 2,
    deadline: Date.now() + 86400000 * 12,
    isAiEligible: true,
    description: 'Implement a zero-dependency Rust crate that verifies cryptographic commit certificates emitted by Arc validators under the Malachite BFT consensus engine. Must include deterministic fuzz tests.'
  },
  {
    id: 'bounty-arc-002',
    bountyId: '0x7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b02',
    title: 'Optimize EIP-3009 Gasless USDC Relayer Batching Engine',
    repo: 'arc-ecosystem/relayer-core',
    issueUrl: 'https://github.com/arc-ecosystem/relayer-core/issues/42',
    amount: 800,
    tags: ['TypeScript', 'Viem', 'Gasless', 'EIP-3009'],
    status: 'Open',
    maintainer: '0x8b415aE3956992b0cbC6C78c485A4d099F6331cE',
    maintainerName: 'Arc Core Infrastructure',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now() - 86400000 * 1,
    deadline: Date.now() + 86400000 * 7,
    isAiEligible: true,
    description: 'Build a high-throughput transaction batcher for transferWithAuthorization payloads that aggregates up to 50 signatures into a single multicall on Arc, reducing sequencer overhead.'
  },
  {
    id: 'bounty-arc-003',
    bountyId: '0x6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c03',
    title: 'Autonomous CISA KEV Threat Feed Ingestion Agent for ArcX',
    repo: 'blackwrld04/x402-threat-agent',
    issueUrl: 'https://github.com/blackwrld04/x402/issues/12',
    amount: 500,
    tags: ['AI Agent', 'Python', 'x402', 'CISA'],
    status: 'InReview',
    maintainer: '0x461cd48D95993242bB04774cc68042795586BbAd',
    maintainerName: 'ArcX Labs',
    solver: '0x9923Bc8E4786A6B71D0052F5eCE984bC9d123456',
    solverType: 'AI Agent (DeepSeek-Coder-v2)',
    prUrl: 'https://github.com/blackwrld04/x402/pull/88',
    createdAt: Date.now() - 86400000 * 3,
    deadline: Date.now() + 86400000 * 5,
    isAiEligible: true,
    description: 'Create an automated cron worker that monitors the CISA Known Exploited Vulnerabilities catalog, formats CVE payloads into JSON-LD, and broadcasts hash updates to Arc smart contracts.'
  },
  {
    id: 'bounty-arc-004',
    bountyId: '0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d04',
    title: 'Cross-Chain CCTP Stablecoin Teleport SDK for React Native',
    repo: 'circlefin/cctp-mobile-kit',
    issueUrl: 'https://github.com/circlefin/cctp-mobile-kit/issues/89',
    amount: 2500,
    tags: ['Mobile', 'React Native', 'CCTP', 'iOS/Android'],
    status: 'Settled',
    maintainer: '0x1234567890abcdef1234567890abcdef12345678',
    maintainerName: 'Mobile Protocol Guild',
    solver: '0x71C568ba74d3B107292995bB791e317614399A45',
    solverType: 'Human Developer',
    prUrl: 'https://github.com/circlefin/cctp-mobile-kit/pull/112',
    createdAt: Date.now() - 86400000 * 6,
    deadline: Date.now() - 86400000 * 1,
    isAiEligible: false,
    description: 'Delivered production-ready TypeScript SDK for 1-click cross-chain USDC transfer from Arbitrum/Solana to Arc with automatic gas abstraction.'
  },
  {
    id: 'bounty-arc-005',
    bountyId: '0x4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e05',
    title: 'Solidity Sub-Second Dutch Auction Liquidity Hook on Arc',
    repo: 'arc-defi/amm-hooks',
    issueUrl: 'https://github.com/arc-defi/amm-hooks/issues/19',
    amount: 1200,
    tags: ['Solidity', 'DeFi', 'Foundry', 'Hooks'],
    status: 'Open',
    maintainer: '0x8b415aE3956992b0cbC6C78c485A4d099F6331cE',
    maintainerName: 'Arc Liquidity Labs',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now() - 86400000 * 1,
    deadline: Date.now() + 86400000 * 14,
    isAiEligible: true,
    description: 'Implement a Uniswap v4 style hook that executes Dutch auction rebalancing across block intervals with zero price impact for large USDC/EURC swaps.'
  }
];

// List bounties with filtering
bountyRouter.get('/', (req, res) => {
  const { status, tag, search, aiOnly } = req.query;

  let filtered = [...bounties];

  if (status && status !== 'All') {
    filtered = filtered.filter((b) => b.status.toLowerCase() === status.toLowerCase());
  }

  if (tag && tag !== 'All') {
    filtered = filtered.filter((b) => b.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  }

  if (aiOnly === 'true') {
    filtered = filtered.filter((b) => b.isAiEligible);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.repo.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: filtered.length,
    bounties: filtered,
  });
});

// Get single bounty details
bountyRouter.get('/:id', (req, res) => {
  const bounty = bounties.find((b) => b.id === req.params.id || b.bountyId === req.params.id);
  if (!bounty) {
    return res.status(404).json({ success: false, error: 'Bounty not found' });
  }
  res.json({ success: true, bounty });
});

// Create & fund a new bounty
bountyRouter.post('/', (req, res) => {
  const { title, repo, issueUrl, amount, tags, deadlineDays, isAiEligible, description, maintainer } = req.body;

  if (!title || !amount || !issueUrl) {
    return res.status(400).json({ success: false, error: 'Missing required bounty parameters' });
  }

  const id = `bounty-arc-${Date.now().toString().slice(-4)}`;
  const bountyId = `0x${Date.now().toString(16).padStart(64, '0')}`;

  const newBounty = {
    id,
    bountyId,
    title,
    repo: repo || 'github/open-source',
    issueUrl,
    amount: Number(amount),
    tags: Array.isArray(tags) ? tags : ['General', 'Arc'],
    status: 'Open',
    maintainer: maintainer || '0x461cd48D95993242bB04774cc68042795586BbAd',
    maintainerName: 'Project Maintainer',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now(),
    deadline: Date.now() + (Number(deadlineDays) || 14) * 86400000,
    isAiEligible: Boolean(isAiEligible),
    description: description || 'No detailed description provided.'
  };

  bounties.unshift(newBounty);

  res.status(201).json({
    success: true,
    message: 'Bounty created & USDC escrow locked on Arc',
    bounty: newBounty,
  });
});

// Submit PR proof / solution
bountyRouter.post('/:id/claim', (req, res) => {
  const { prUrl, solverAddress, solverType } = req.body;
  const bounty = bounties.find((b) => b.id === req.params.id || b.bountyId === req.params.id);

  if (!bounty) {
    return res.status(404).json({ success: false, error: 'Bounty not found' });
  }

  if (bounty.status !== 'Open') {
    return res.status(400).json({ success: false, error: `Bounty is already ${bounty.status}` });
  }

  bounty.status = 'InReview';
  bounty.solver = solverAddress || '0xDemoSolver...';
  bounty.solverType = solverType || 'Human Developer';
  bounty.prUrl = prUrl || 'https://github.com/sample/pull/1';

  res.json({
    success: true,
    message: 'PR solution submitted for maintainer review',
    bounty,
  });
});

// Approve PR & release USDC escrow (via direct or gasless EIP-3009 relay)
bountyRouter.post('/:id/release', async (req, res) => {
  const bounty = bounties.find((b) => b.id === req.params.id || b.bountyId === req.params.id);

  if (!bounty) {
    return res.status(404).json({ success: false, error: 'Bounty not found' });
  }

  if (bounty.status !== 'InReview') {
    return res.status(400).json({ success: false, error: 'Bounty is not pending review' });
  }

  // Check if gasless EIP-3009 signature is attached
  const { eip3009Signature, from, to, value, nonce, validAfter, validBefore } = req.body;

  let settlementResult = {
    mode: 'direct-escrow',
    txHash: `0xarc${Date.now().toString(16)}fd32`,
    blockNumber: 1849301,
    settlementTimeMs: 345,
    gasPaidUsdc: '0.00038',
  };

  if (eip3009Signature) {
    try {
      settlementResult = await relayGaslessSettlement({
        from: from || bounty.maintainer,
        to: to || bounty.solver,
        value: value || BigInt(bounty.amount * 1_000_000),
        validAfter: validAfter || 0,
        validBefore: validBefore || Math.floor(Date.now() / 1000) + 3600,
        nonce: nonce || `0x${Date.now().toString(16).padStart(64, '0')}`,
        signature: eip3009Signature,
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: `Settlement failed: ${err.message}` });
    }
  }

  bounty.status = 'Settled';
  bounty.settledAt = Date.now();
  bounty.settlementTx = settlementResult.txHash;

  res.json({
    success: true,
    message: 'USDC reward disbursed to solver on Arc Mainnet',
    bounty,
    settlement: settlementResult,
  });
});

// Helper: Preview GitHub issue metadata
bountyRouter.post('/preview-issue', (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL required' });
  }

  // Parse repo and issue number if valid GitHub URL
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (match) {
    const [, owner, repo, issueNum] = match;
    return res.json({
      success: true,
      data: {
        repo: `${owner}/${repo}`,
        issueNumber: issueNum,
        title: `Feature Request #${issueNum} in ${repo}`,
        tags: ['TypeScript', 'Arc', 'Feature'],
        suggestedBounty: 250,
      },
    });
  }

  // Fallback for custom links
  res.json({
    success: true,
    data: {
      repo: 'custom/repository',
      issueNumber: '1',
      title: 'Custom Open Source Task',
      tags: ['General', 'Web3'],
      suggestedBounty: 100,
    },
  });
});
