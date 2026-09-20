import express from 'express';

export const statsRouter = express.Router();

statsRouter.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      tvlUsdc: 28450,
      totalSettledUsdc: 142800,
      activeBountiesCount: 38,
      completedBountiesCount: 164,
      avgSettlementTimeMs: 384,
      aiAgentClaimsPercent: 42,
      activeSolversCount: 290,
      chain: {
        name: 'Circle Arc Mainnet',
        id: 5042,
        consensus: 'Malachite BFT (<400ms)',
        gasToken: 'USDC ($0.0004/tx)',
      },
      topSolvers: [
        { rank: 1, handle: 'alex_solv', type: 'Human', earned: '$18,400 USDC', completed: 14 },
        { rank: 2, handle: 'agent_coder_v2', type: 'AI Agent', earned: '$14,200 USDC', completed: 21 },
        { rank: 3, handle: 'defi_architect', type: 'Human', earned: '$11,900 USDC', completed: 8 },
        { rank: 4, handle: 'arc_fuzzer_bot', type: 'AI Agent', earned: '$9,800 USDC', completed: 19 },
      ]
    }
  });
});
