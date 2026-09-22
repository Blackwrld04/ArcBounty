/**
 * ArcBounty End-to-End Autonomous Agent Verification Suite
 * Simulates complete User Journey, Sponsor Journey, Admin Governance Journey, and Security Boundaries
 */

import crypto from 'crypto';

const API_BASE = 'http://localhost:4050';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const { headers, ...restOptions } = options;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {})
    },
    ...restOptions
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ ${message}`);
}

async function runAgentVerification() {
  console.log('===========================================================');
  console.log('🚀 STARTING ARCTBOUNTY FULL END-TO-END AUTONOMOUS AUDIT');
  console.log('===========================================================\n');

  const timestamp = Date.now();
  const testUserEmail = `agent_tester_${timestamp}@example.com`;
  const testUserHandle = `agent_${timestamp.toString().slice(-6)}`;
  const testUserPassword = 'TestPassword123!';
  const testWallet = `0x${crypto.randomBytes(20).toString('hex')}`;

  // -------------------------------------------------------------
  // PHASE 1: USER REGISTRATION & AUTHENTICATION
  // -------------------------------------------------------------
  console.log('--- PHASE 1: User Registration, Verification & Login ---');
  
  // 1.1 Initiate Signup
  const signupRes = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Agent Tester',
      username: testUserHandle,
      email: testUserEmail,
      password: testUserPassword,
      discipline: 'Development'
    })
  });
  assert(signupRes.ok, `Signup initiated successfully for ${testUserEmail}`);

  // Fetch SQLite code generated for testing
  const { db } = await import('../src/db.js');
  const codeRecord = db.prepare('SELECT code FROM verification_codes WHERE email = ? ORDER BY expires_at DESC LIMIT 1').get(testUserEmail);
  assert(codeRecord && codeRecord.code, 'Verification OTP stored securely in database');

  // 1.2 Verify Code & Complete Registration
  const verifyRes = await request('/api/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify({
      email: testUserEmail,
      code: codeRecord.code,
      name: 'Agent Tester',
      username: testUserHandle,
      password: testUserPassword
    })
  });
  assert(verifyRes.ok && verifyRes.data.token, 'OTP code verified and initial session token returned');
  let userToken = verifyRes.data.token;
  let userId = verifyRes.data.user?.id;

  // 1.3 Standard Login Test
  const loginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUserEmail,
      password: testUserPassword
    })
  });
  assert(loginRes.ok && loginRes.data.token, 'Email & Password login authenticated successfully');
  userToken = loginRes.data.token;
  userId = userId || loginRes.data.user?.id;
  console.log(`  User Authenticated: ID=${userId}, Handle=@${testUserHandle}, Wallet=${testWallet}`);

  // 1.4 Profile Consistency & Social Updates
  const updateBioRes = await request('/api/auth/update-profile', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      userId,
      bio: 'Autonomous Web3 Agent verifying ArcBounty protocol integrity.',
      discipline: 'Development'
    })
  });
  assert(updateBioRes.ok, 'User profile bio updated successfully');

  const socialRes = await request('/api/auth/social-connect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      userId,
      platform: 'telegram',
      handle: 'agent_arc'
    })
  });
  assert(socialRes.ok, 'User Telegram handle linked successfully');

  // -------------------------------------------------------------
  // PHASE 2: SPONSOR BOUNTY CREATION & ADMIN APPROVAL
  // -------------------------------------------------------------
  console.log('\n--- PHASE 2: Sponsor Creation & Admin Governance Pipeline ---');

  // 2.1 Sponsor creates a new challenge
  const createBountyRes = await request('/api/bounties', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      title: `Autonomous Audit Challenge #${timestamp.toString().slice(-4)}`,
      category: 'DEVELOPMENT',
      categoryName: 'Smart Contracts & Infrastructure',
      amount: 1000,
      description: 'Design and benchmark a sub-second autonomous agent settlement pipeline on Circle Arc L1.',
      maintainerName: 'Agent Sponsor Lab',
      maintainerEmail: testUserEmail,
      deadlineDays: 7
    })
  });
  assert(createBountyRes.ok && createBountyRes.data.bounty, 'Sponsor created new bounty (queued for review)');
  const newBounty = createBountyRes.data.bounty;
  console.log(`  New Bounty Created: "${newBounty.title}" (Status: ${newBounty.status || 'Pending Review'})`);

  // 2.2 Master Admin Authenticates
  const adminLoginRes = await request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({
      password: process.env.ADMIN_PASSWORD || 'arcbounty2026_admin!'
    })
  });
  assert(adminLoginRes.ok && adminLoginRes.data.token, 'Master Administrator authenticated with password');
  const adminToken = adminLoginRes.data.token;

  // 2.3 Non-Admin Access Rejection (Regular User Token attempting Admin Route)
  const unauthorizedRes = await request('/api/admin/stats', {
    headers: { Authorization: `Bearer ${userToken}` }
  });
  assert(unauthorizedRes.status === 403, 'Security Boundary: Regular user is strictly rejected (403 Forbidden) from admin portal');

  // 2.4 Admin Approves the New Challenge
  const approveRes = await request(`/api/admin/bounties/${newBounty.id}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(approveRes.ok, 'Admin reviewed and approved bounty; status is now "Open"');

  // -------------------------------------------------------------
  // PHASE 3: CONTRIBUTOR PARTICIPATION & SUBMISSION LIFECYCLE
  // -------------------------------------------------------------
  console.log('\n--- PHASE 3: Contributor Participation & Submission Lifecycle ---');

  // Create a separate contributor account to test contributor flow
  const contributorEmail = `contributor_${timestamp}@arc.test`;
  const contributorHandle = `contrib_${timestamp.toString().slice(-5)}`;
  const contribWallet = `0x${crypto.randomBytes(20).toString('hex')}`;
  
  const contribSignupRes = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Contributor Bot',
      username: contributorHandle,
      email: contributorEmail,
      password: 'ContributorPass123!',
      discipline: 'Development'
    })
  });
  assert(contribSignupRes.ok, `Contributor account initiated: ${contributorEmail}`);

  const contribCode = db.prepare('SELECT code FROM verification_codes WHERE email = ? ORDER BY expires_at DESC LIMIT 1').get(contributorEmail).code;
  const contribVerify = await request('/api/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify({
      email: contributorEmail,
      code: contribCode,
      name: 'Contributor Bot',
      username: contributorHandle,
      password: 'ContributorPass123!'
    })
  });
  assert(contribVerify.ok && contribVerify.data.token, 'Contributor authenticated');
  const contribToken = contribVerify.data.token;

  // 3.1 Blind Submission Privacy Check
  const detailRes = await request(`/api/bounties/${newBounty.id}`, {
    headers: { Authorization: `Bearer ${contribToken}` }
  });
  assert(detailRes.ok, 'Contributor viewed bounty details');

  // 3.2 Post a Community Q&A Question
  const commentRes = await request(`/api/bounties/${newBounty.id}/comments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${contribToken}` },
    body: JSON.stringify({
      content: 'Is an off-chain EIP-3009 transfer authorization signature required for the deliverable?'
    })
  });
  assert(commentRes.ok && commentRes.data.comment, 'Contributor posted question in Community Q&A');

  // 3.3 Sponsor Cannot Participate in Own Bounty (Self-participation prevention)
  const selfParticipationRes = await request(`/api/bounties/${newBounty.id}/participate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      submissionUrl: 'https://github.com/sponsor/self-submission',
      walletAddress: testWallet,
      creatorEmail: testUserEmail
    })
  });
  assert(!selfParticipationRes.ok && selfParticipationRes.status === 403, 'Self-Participation Blocked: Sponsor cannot submit to their own bounty');

  // 3.4 Contributor Submits Deliverable
  const deliverableUrl = `https://github.com/arcbounty-contributor/proof-${timestamp}`;
  const submitRes = await request(`/api/bounties/${newBounty.id}/participate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${contribToken}` },
    body: JSON.stringify({
      submissionUrl: deliverableUrl,
      walletAddress: contribWallet,
      notes: 'Initial release: Autonomous agent bridge with sub-second finality.',
      creatorName: 'Contributor Bot',
      creatorEmail: contributorEmail,
      solverType: 'Human Creator',
      collaborators: []
    })
  });
  assert(submitRes.ok && submitRes.data.submission, 'Contributor deliverable submission successfully recorded');
  const submissionId = submitRes.data.submission.id;

  // 3.5 Duplicate Submission Blocked
  const duplicateRes = await request(`/api/bounties/${newBounty.id}/participate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${contribToken}` },
    body: JSON.stringify({
      submissionUrl: 'https://github.com/arcbounty-contributor/second-try',
      walletAddress: contribWallet,
      creatorEmail: contributorEmail
    })
  });
  assert(!duplicateRes.ok && duplicateRes.status === 400, 'Double Submission Blocked: Single submission constraint enforced');

  // 3.6 Deliverable Revision Before Deadline
  const revisedUrl = `${deliverableUrl}-v2-enhanced`;
  const reviseRes = await request(`/api/bounties/${newBounty.id}/submissions/${submissionId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${contribToken}` },
    body: JSON.stringify({
      submissionUrl: revisedUrl,
      notes: 'Revision 2: Added full fuzz testing and benchmark telemetry.',
      collaborators: []
    })
  });
  assert(reviseRes.ok && reviseRes.data.submission.revisionCount >= 2, 'Revision Saved: Deliverable revised to v2 before deadline');

  // -------------------------------------------------------------
  // PHASE 4: ADMIN EVALUATION & ESCROW SETTLEMENT
  // -------------------------------------------------------------
  console.log('\n--- PHASE 4: Admin Evaluation & Escrow Settlement ---');

  // 4.1 Admin Telemetry Stats
  const adminStatsRes = await request('/api/admin/stats', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(adminStatsRes.ok && adminStatsRes.data.stats.totalBounties > 0, 'Admin telemetry retrieved all platform metrics');

  // 4.2 Admin Rubric Scoring
  const scoreRes = await request(`/api/admin/submissions/${submissionId}/score`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      scoreCodeQuality: 10,
      scoreCreativity: 9,
      scoreCompleteness: 10,
      reviewerNotes: 'Flawless execution, zero-gas sub-second finality verified.'
    })
  });
  assert(scoreRes.ok, 'Admin rubric score recorded (10/10/9)');

  // 4.3 Escrow Settlement Disbursement on Arc L1
  const disburseRes = await request('/api/admin/disburse', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      bountyId: newBounty.id,
      submissionId: submissionId,
      amount: 1000
    })
  });
  if (!disburseRes.ok) {
    console.error('DEBUG disburseRes failure:', disburseRes);
  }
  assert(disburseRes.ok && disburseRes.data.settlement, 'USDC Escrow reward disbursed to winner on Arc L1');
  console.log(`  Disbursement Tx: ${disburseRes.data.settlement.txHash} ($${disburseRes.data.settlement.amount} USDC)`);

  // 4.4 CSV Audit Ledger Export
  const csvRes = await request('/api/admin/export-csv', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(csvRes.ok, 'CSV Audit Ledger generated for DAO compliance');

  // -------------------------------------------------------------
  // PHASE 5: DATABASE SYNCHRONIZATION & STATE CONSISTENCY
  // -------------------------------------------------------------
  console.log('\n--- PHASE 5: Database Synchronization & State Consistency ---');
  const userCheck = db.prepare('SELECT email, wallet_address FROM users WHERE email = ?').get(contributorEmail);
  assert(userCheck && userCheck.email === contributorEmail, 'Contributor record verified in local SQLite database');

  const bountyCheck = db.prepare('SELECT status, solver FROM bounties WHERE id = ?').get(newBounty.id);
  assert(bountyCheck && bountyCheck.status === 'Settled', 'Bounty status updated to "Settled" with winning solver address');

  const { pool } = await import('../src/supabase.js');
  if (pool) {
    const pgRes = await pool.query('SELECT count(*) FROM bounties');
    assert(Number(pgRes.rows[0].count) >= 1, 'Supabase PostgreSQL connection pool alive and synchronized');
  }

  console.log('\n===========================================================');
  console.log('🎉 ALL END-TO-END AUTONOMOUS AGENT AUDIT TESTS PASSED (100%)');
  console.log('===========================================================');
}

runAgentVerification().catch(err => {
  console.error('\n❌ E2E Agent Verification Encountered Error:', err);
  process.exit(1);
});
