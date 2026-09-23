import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { bountyRouter } from './routes/bounties.js';
import { statsRouter } from './routes/stats.js';
import { authRouter } from './routes/auth.js';
import { adminRouter } from './routes/admin.js';
import { initSupabaseDatabase, isExternalDbConfigured } from './supabase.js';
import { db, INITIAL_BOUNTIES } from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/', authRouter); // Also mount at root for direct /signup, /login, /verify-code compatibility
app.use('/api/bounties', bountyRouter);
app.use('/api/stats', statsRouter);
app.use('/api/admin', adminRouter);

// Health check & Root status
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'ArcBounty Facilitator API is running',
    network: 'Circle Arc (5042)',
    health: '/health',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    network: 'Circle Arc (5042)',
    database: isExternalDbConfigured() ? 'Supabase PostgreSQL (Connection Pooling)' : 'Embedded SQLite',
    timestamp: new Date().toISOString(),
  });
});

app.listen(config.port, async () => {
  console.log(`[ArcBounty Server] Listening on http://localhost:${config.port}`);
  console.log(`[ArcBounty] Network: Arc (Chain ID: ${config.arcChainId}) | Canonical USDC: ${config.usdcAddress}`);

  if (isExternalDbConfigured()) {
    await initSupabaseDatabase(INITIAL_BOUNTIES, db);
  } else {
    console.log('[ArcBounty Database] Active: Embedded SQLite. To connect to Supabase, paste DATABASE_URL in server/.env');
  }
});

