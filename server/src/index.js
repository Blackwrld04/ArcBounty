import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { bountyRouter } from './routes/bounties.js';
import { agentRouter } from './routes/agent.js';
import { statsRouter } from './routes/stats.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bounties', bountyRouter);
app.use('/api/agent', agentRouter);
app.use('/api/stats', statsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    network: 'Circle Arc (5042)',
    timestamp: new Date().toISOString(),
  });
});

app.listen(config.port, () => {
  console.log(`[ArcBounty Server] Listening on http://localhost:${config.port}`);
  console.log(`[ArcBounty] Network: Arc (Chain ID: ${config.arcChainId}) | Canonical USDC: ${config.usdcAddress}`);
});
