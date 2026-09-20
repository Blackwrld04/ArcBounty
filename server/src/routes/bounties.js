import express from 'express';
import { relayGaslessSettlement } from '../facilitator.js';

export const bountyRouter = express.Router();

let bounties = [
  {
    id: 'bounty-arc-001',
    bountyId: '0x8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a01',
    category: 'DESIGN',
    categoryName: 'Design & 3D',
    categoryColor: '#ff578a',
    title: 'Design Official 3D Mascot & Telegram Sticker Pack for Circle Arc',
    repo: 'circlefin/arc-brand-kit',
    submissionType: 'Figma / 3D Render / PNG Pack',
    issueUrl: 'https://github.com/circlefin/arc/issues/45',
    amount: 1200,
    tags: ['3D Art', 'Figma', 'Mascot', 'Branding', 'Stickers'],
    status: 'Open',
    maintainer: '0x461cd48D95993242bB04774cc68042795586BbAd',
    maintainerName: 'Circle Creative Guild',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now() - 86400000 * 1,
    deadline: Date.now() + 86400000 * 10,
    isAiEligible: true,
    description: 'We need an iconic, neo-brutalist 3D mascot representing Arc L1 (speed, dollar-native gas, institutional trust). Deliverable: 3D Blender/GLTF asset + 15 expressive stickers for Telegram and Discord.'
  },
  {
    id: 'bounty-arc-002',
    bountyId: '0x7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b02',
    category: 'VIDEO',
    categoryName: 'Video & Motion',
    categoryColor: '#ffe600',
    title: 'Produce a 60-Second Viral Motion Explainer: "Why Arc Changes Everything"',
    repo: 'arc-community/viral-content',
    submissionType: 'Loom / YouTube / MP4 Link',
    issueUrl: 'https://github.com/arc-community/media/issues/12',
    amount: 1500,
    tags: ['Motion Graphics', 'TikTok / Reels', '3D After Effects', 'Video'],
    status: 'Open',
    maintainer: '0x8b415aE3956992b0cbC6C78c485A4d099F6331cE',
    maintainerName: 'Arc Marketing DAO',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now() - 86400000 * 2,
    deadline: Date.now() + 86400000 * 8,
    isAiEligible: true,
    description: 'High-octane, fast-paced video showing the pain of fluctuating gas fees on other chains vs instant sub-second USDC transactions on Circle Arc. High-quality kinetic typography and sound design.'
  },
  {
    id: 'bounty-arc-003',
    bountyId: '0x6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c03',
    category: 'WRITING',
    categoryName: 'Writing & Research',
    categoryColor: '#bb86fc',
    title: 'Write a 15-Post Viral Deep-Dive Thread on Arc\'s Malachite BFT vs Tendermint',
    repo: 'arc-research/publications',
    submissionType: 'Twitter/X Thread Link / Notion',
    issueUrl: 'https://github.com/arc-research/papers/issues/8',
    amount: 800,
    tags: ['Research', 'X Thread', 'Infographics', 'Architecture'],
    status: 'InReview',
    maintainer: '0x461cd48D95993242bB04774cc68042795586BbAd',
    maintainerName: 'Arc Research Foundation',
    solver: '0x9923Bc8E4786A6B71D0052F5eCE984bC9d123456',
    solverType: 'Web3 Researcher (Threador)',
    prUrl: 'https://x.com/crypto_analyst/status/18389102938102',
    createdAt: Date.now() - 86400000 * 3,
    deadline: Date.now() + 86400000 * 4,
    isAiEligible: true,
    description: 'Break down Circle Arc\'s consensus algorithm for both retail and developer audiences. Must include visual diagrams explaining 380ms deterministic finality and institutional validator sets (BlackRock, ICE).'
  },
  {
    id: 'bounty-arc-004',
    bountyId: '0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d04',
    category: 'MEMES',
    categoryName: 'Memes & Social',
    categoryColor: '#00f0ff',
    title: 'Arc Meme Contest: Native USDC Gas vs Volatile Gas Token Spikes',
    repo: 'arc-memes/vault',
    submissionType: 'X Post Link / Imgur Album',
    issueUrl: 'https://github.com/arc-memes/contests/issues/3',
    amount: 450,
    tags: ['Memes', 'Social', 'Humor', 'Viral', 'X/Twitter'],
    status: 'Settled',
    maintainer: '0x1234567890abcdef1234567890abcdef12345678',
    maintainerName: 'Arc Meme Department',
    solver: '0x71C568ba74d3B107292995bB791e317614399A45',
    solverType: 'Web3 Meme Lord',
    prUrl: 'https://x.com/memegod_sol/status/1838192830192',
    createdAt: Date.now() - 86400000 * 5,
    deadline: Date.now() - 86400000 * 1,
    isAiEligible: true,
    description: 'Create 5 top-tier, viral-ready memes contrasting user pain on high gas fee networks with the effortless $0.0004 USDC gas experience on Arc. Winner receives instant USDC.'
  },
  {
    id: 'bounty-arc-005',
    bountyId: '0x4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e05',
    category: 'DEV',
    categoryName: 'Code & Apps',
    categoryColor: '#00e676',
    title: 'Build a 1-Click CCTP Teleport Widget for Web3 Storefronts',
    repo: 'circlefin/cctp-teleport-widget',
    submissionType: 'GitHub PR & Live Demo',
    issueUrl: 'https://github.com/circlefin/cctp-teleport-widget/issues/19',
    amount: 2000,
    tags: ['TypeScript', 'React', 'CCTP', 'EIP-3009', 'SDK'],
    status: 'Open',
    maintainer: '0x8b415aE3956992b0cbC6C78c485A4d099F6331cE',
    maintainerName: 'Circle Developer Platform',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now() - 86400000 * 1,
    deadline: Date.now() + 86400000 * 14,
    isAiEligible: true,
    description: 'Create an embeddable React & Vanilla JS widget that lets users teleport USDC from Solana or Base directly into Arc Mainnet in 1 click, auto-funding their checkout.'
  }
];

// List bounties with filtering
bountyRouter.get('/', (req, res) => {
  const { status, category, tag, search, aiOnly } = req.query;

  let filtered = [...bounties];

  if (status && status !== 'All') {
    filtered = filtered.filter((b) => b.status.toLowerCase() === status.toLowerCase());
  }

  if (category && category !== 'ALL') {
    filtered = filtered.filter((b) => b.category === category);
  }

  if (tag && tag !== 'All') {
    filtered = filtered.filter((b) => b.tags && b.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  }

  if (aiOnly === 'true') {
    filtered = filtered.filter((b) => b.isAiEligible);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        (b.repo && b.repo.toLowerCase().includes(q)) ||
        b.description.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: filtered.length,
    bounties: filtered,
  });
});

bountyRouter.get('/:id', (req, res) => {
  const bounty = bounties.find((b) => b.id === req.params.id || b.bountyId === req.params.id);
  if (!bounty) {
    return res.status(404).json({ success: false, error: 'Bounty not found' });
  }
  res.json({ success: true, bounty });
});

bountyRouter.post('/', (req, res) => {
  const { title, category, categoryName, categoryColor, submissionType, amount, tags, deadlineDays, isAiEligible, description, maintainer } = req.body;

  if (!title || !amount) {
    return res.status(400).json({ success: false, error: 'Missing required bounty parameters' });
  }

  const id = `bounty-arc-${Date.now().toString().slice(-4)}`;
  const bountyId = `0x${Date.now().toString(16).padStart(64, '0')}`;

  const newBounty = {
    id,
    bountyId,
    title,
    category: category || 'DESIGN',
    categoryName: categoryName || 'Design',
    categoryColor: categoryColor || '#ff578a',
    submissionType: submissionType || 'Deliverable URL',
    amount: Number(amount),
    tags: Array.isArray(tags) ? tags : ['Creator', 'Arc'],
    status: 'Open',
    maintainer: maintainer || '0x461cd48D95993242bB04774cc68042795586BbAd',
    maintainerName: 'Sponsor Guild',
    solver: null,
    solverType: null,
    prUrl: null,
    createdAt: Date.now(),
    deadline: Date.now() + (Number(deadlineDays) || 14) * 86400000,
    isAiEligible: Boolean(isAiEligible),
    description: description || 'Creative deliverable specifications.'
  };

  bounties.unshift(newBounty);

  res.status(201).json({
    success: true,
    message: 'Bounty created & USDC escrow locked on Arc',
    bounty: newBounty,
  });
});

bountyRouter.post('/:id/claim', (req, res) => {
  const { prUrl, solverAddress, solverType } = req.body;
  const bounty = bounties.find((b) => b.id === req.params.id || b.bountyId === req.params.id);

  if (!bounty) {
    return res.status(404).json({ success: false, error: 'Bounty not found' });
  }

  bounty.status = 'InReview';
  bounty.solver = solverAddress || '0xDemoCreator...';
  bounty.solverType = solverType || 'Human Creator';
  bounty.prUrl = prUrl || 'https://figma.com/...';

  res.json({
    success: true,
    message: 'Deliverable proof submitted for review',
    bounty,
  });
});

bountyRouter.post('/:id/release', async (req, res) => {
  const bounty = bounties.find((b) => b.id === req.params.id || b.bountyId === req.params.id);

  if (!bounty) {
    return res.status(404).json({ success: false, error: 'Bounty not found' });
  }

  const mockTx = `0xarc${Date.now().toString(16)}fd32`;
  bounty.status = 'Settled';
  bounty.settledAt = Date.now();
  bounty.settlementTx = mockTx;

  res.json({
    success: true,
    message: 'USDC reward disbursed to creator on Arc Mainnet',
    bounty,
    settlement: {
      status: 'confirmed',
      txHash: mockTx,
      blockNumber: 1849301,
      settlementTimeMs: 345,
      gasPaidUsdc: '0.00038',
    },
  });
});
