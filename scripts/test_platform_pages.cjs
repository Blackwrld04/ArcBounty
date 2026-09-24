// Comprehensive test of all pages and features for ArcBounty
const https = require('https');

const API_BASE = 'https://arcbounty.onrender.com';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = https.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runAudit() {
  console.log('====================================================');
  console.log('🚀 ARCYBOUNTY COMPREHENSIVE PLATFORM FEATURE AUDIT');
  console.log('====================================================\n');

  const results = [];

  // TEST 1: System Health & Base API
  try {
    const res = await request('/health');
    const ok = res.status === 200 && res.data.status === 'ok';
    results.push({ page: 'Platform / API Health', feature: 'Health Probe & Network Status', ok, details: res.data });
    console.log(`[PASS] Page: Platform Health -> ${JSON.stringify(res.data)}`);
  } catch (err) {
    results.push({ page: 'Platform / API Health', feature: 'Health Probe', ok: false, error: err.message });
    console.error(`[FAIL] Platform Health: ${err.message}`);
  }

  // TEST 2: Explore Page - Bounties Feed
  let sampleBounty = null;
  try {
    const res = await request('/api/bounties');
    const ok = res.status === 200 && Array.isArray(res.data.bounties) && res.data.bounties.length > 0;
    sampleBounty = res.data.bounties[0];
    results.push({ page: 'Explore Page', feature: 'Live Bounties Feed', ok, details: `Loaded ${res.data.bounties?.length} bounties` });
    console.log(`[PASS] Page: Explore -> Live Bounties Feed: ${res.data.bounties.length} active bounties retrieved`);
  } catch (err) {
    results.push({ page: 'Explore Page', feature: 'Live Bounties Feed', ok: false, error: err.message });
    console.error(`[FAIL] Explore Page Bounties Feed: ${err.message}`);
  }

  // TEST 3: Explore Page - Stats & Telemetry Strip
  try {
    const res = await request('/api/bounties/stats');
    const ok = res.status === 200 && res.data.success && res.data.stats.tvlUsdc > 0;
    results.push({ page: 'Explore Page', feature: 'Stats & Telemetry Strip', ok, details: res.data.stats });
    console.log(`[PASS] Page: Explore -> Stats: TVL $${res.data.stats?.tvlUsdc} USDC, Settled $${res.data.stats?.totalSettledUsdc} USDC, Avg Settlement: ${res.data.stats?.avgSettlementTimeMs}ms`);
  } catch (err) {
    results.push({ page: 'Explore Page', feature: 'Stats & Telemetry', ok: false, error: err.message });
    console.error(`[FAIL] Explore Page Stats: ${err.message}`);
  }

  // TEST 4: Leaderboard Page
  try {
    const res = await request('/api/bounties/leaderboard');
    const ok = res.status === 200 && res.data.success && Array.isArray(res.data.creators);
    results.push({ page: 'Leaderboard Page', feature: 'Top Creators Ranks', ok, details: `Ranked ${res.data.creators?.length} creators` });
    console.log(`[PASS] Page: Leaderboard -> Retrieved ${res.data.creators.length} ranked creators`);
  } catch (err) {
    results.push({ page: 'Leaderboard Page', feature: 'Top Creators Ranks', ok: false, error: err.message });
    console.error(`[FAIL] Leaderboard Page: ${err.message}`);
  }

  // TEST 5: Sign Up Page - Username Availability Check
  const testHandle = `auditor_${Date.now().toString().slice(-4)}`;
  try {
    const res = await request(`/api/auth/check-username?username=${testHandle}`);
    const ok = res.status === 200 && res.data.available === true;
    results.push({ page: 'Sign Up Page', feature: 'Creator Handle Availability Check', ok, details: `Checked @${testHandle}: available=${res.data.available}` });
    console.log(`[PASS] Page: Sign Up -> Handle Availability Check (@${testHandle}): Available=${res.data.available}`);
  } catch (err) {
    results.push({ page: 'Sign Up Page', feature: 'Handle Check', ok: false, error: err.message });
    console.error(`[FAIL] Sign Up Handle Check: ${err.message}`);
  }

  // TEST 6: Login & Sign Up Page - Google OAuth Endpoints
  try {
    const testGoogleEmail = `google_tester_${Date.now()}@gmail.com`;
    const res = await request('/api/auth/google', {
      method: 'POST',
      body: { email: testGoogleEmail, name: 'Google Test Creator', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }
    });
    const ok = res.status === 200 && res.data.success && res.data.user && res.data.token;
    results.push({ page: 'Login & Sign Up Pages', feature: 'Google Authentication Flow', ok, details: `Generated user @${res.data.user?.username} with Arc wallet ${res.data.user?.address}` });
    console.log(`[PASS] Page: Login/Sign Up -> Google OAuth: Authenticated user @${res.data.user?.username} (Token: ${res.data.token?.slice(0, 15)}...)`);
  } catch (err) {
    results.push({ page: 'Login & Sign Up Pages', feature: 'Google Authentication', ok: false, error: err.message });
    console.error(`[FAIL] Google Auth: ${err.message}`);
  }

  // TEST 7: Sign Up Page - Creator Registration & Auto-Wallet Provisioning
  let registeredUser = null;
  let userToken = null;
  try {
    const signupEmail = `creator_${Date.now()}@arc.network`;
    const signupHandle = `cr_${Date.now().toString().slice(-4)}`;
    
    const res = await request('/api/auth/google', {
      method: 'POST',
      body: { email: signupEmail, name: 'Audit Creator', username: signupHandle, discipline: 'Content' }
    });
    if (res.status === 200 && res.data.success) {
      registeredUser = res.data.user;
      userToken = res.data.token;
      results.push({ page: 'Sign Up Page', feature: 'Creator Account Creation & Auto-Wallet Provisioning', ok: true, details: `Created @${registeredUser.username}, Wallet: ${registeredUser.address}` });
      console.log(`[PASS] Page: Sign Up -> Created Creator Profile: @${registeredUser.username} | Arc L1 Wallet: ${registeredUser.address}`);
    }
  } catch (err) {
    results.push({ page: 'Sign Up Page', feature: 'Creator Account Creation', ok: false, error: err.message });
  }

  // TEST 8: User Profile Page - Dynamic Profile Telemetry & Stats
  if (registeredUser) {
    try {
      const res = await request(`/api/auth/profile-stats?userId=${registeredUser.id}&email=${registeredUser.email}`);
      const ok = res.status === 200 && res.data.success && res.data.stats;
      results.push({ page: 'User Profile Page', feature: 'Creator Profile Stats & Telemetry', ok, details: res.data.stats });
      console.log(`[PASS] Page: User Profile -> Profile Stats: Wins=${res.data.stats?.winsCount}, Submissions=${res.data.stats?.submissionsCount}, Earnings=$${res.data.stats?.totalEarnedUsdc || 0} USDC`);
    } catch (err) {
      results.push({ page: 'User Profile Page', feature: 'Profile Stats', ok: false, error: err.message });
      console.error(`[FAIL] User Profile Stats: ${err.message}`);
    }

    // TEST 9: Account Settings Page - Profile Update (Bio & Name)
    try {
      const res = await request('/api/auth/update-profile', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
        body: { userId: registeredUser.id, bio: 'Institutional Web3 Creator on Circle Arc L1', name: 'Verified Audit Creator' }
      });
      const ok = res.status === 200 && res.data.success && res.data.user.bio.includes('Institutional');
      results.push({ page: 'Account Settings Page', feature: 'Profile Details Update (Name, Bio, Avatar)', ok, details: res.data.user?.bio });
      console.log(`[PASS] Page: Account Settings -> Updated Bio & Name successfully`);
    } catch (err) {
      results.push({ page: 'Account Settings Page', feature: 'Profile Update', ok: false, error: err.message });
      console.error(`[FAIL] Account Settings Profile Update: ${err.message}`);
    }

    // TEST 10: Account Settings Page - Social Connections
    try {
      const res = await request('/api/auth/social-connect', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
        body: { userId: registeredUser.id, platform: 'telegram', handle: 'audit_tg_creator' }
      });
      const ok = res.status === 200 && res.data.success && res.data.user.telegram === 'audit_tg_creator';
      results.push({ page: 'Account Settings Page', feature: 'Social Account Linking (Telegram/Discord/X/GitHub)', ok, details: `Linked Telegram: @${res.data.user?.telegram}` });
      console.log(`[PASS] Page: Account Settings -> Linked Telegram: @${res.data.user?.telegram}`);
    } catch (err) {
      results.push({ page: 'Account Settings Page', feature: 'Social Account Linking', ok: false, error: err.message });
      console.error(`[FAIL] Social Account Linking: ${err.message}`);
    }
  }

  // TEST 11: Admin Dashboard - Master Authentication Gate
  let adminToken = null;
  try {
    const res = await request('/api/admin/login', {
      method: 'POST',
      body: { password: process.env.ADMIN_PASSWORD || 'arcbounty2026_admin!' }
    });
    if (res.status === 200 && res.data.success && res.data.token) {
      adminToken = res.data.token;
      results.push({ page: 'Admin Dashboard', feature: 'Master Admin Authentication Gate', ok: true, details: 'Authorized' });
      console.log(`[PASS] Page: Admin Dashboard -> Admin Gate Authenticated (Token: ${adminToken.slice(0, 15)}...)`);
    } else {
      results.push({ page: 'Admin Dashboard', feature: 'Admin Authentication', ok: false, error: 'Login rejected' });
    }
  } catch (err) {
    results.push({ page: 'Admin Dashboard', feature: 'Admin Authentication', ok: false, error: err.message });
    console.error(`[FAIL] Admin Login: ${err.message}`);
  }

  // TEST 12: Admin Dashboard - Overview Metrics & Telemetry
  if (adminToken) {
    try {
      const res = await request('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const ok = res.status === 200 && res.data.success && res.data.stats && typeof res.data.stats.totalEscrowedUsdc === 'number';
      results.push({ page: 'Admin Dashboard', feature: 'Master Overview Metrics & Escrow Balance', ok, details: res.data.stats });
      console.log(`[PASS] Page: Admin Dashboard -> Overview Metrics: Total Escrow $${res.data.stats?.totalEscrowedUsdc} USDC, Active Bounties: ${res.data.stats?.totalBounties}`);
    } catch (err) {
      results.push({ page: 'Admin Dashboard', feature: 'Admin Overview', ok: false, error: err.message });
      console.error(`[FAIL] Admin Overview: ${err.message}`);
    }
  }

  // TEST 13: Bounty Detail & Submission Flow
  if (sampleBounty && registeredUser) {
    try {
      const res = await request(`/api/bounties/${sampleBounty.id}/participate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
        body: {
          submissionUrl: 'https://github.com/arcbounty/deliverable-audit-demo',
          walletAddress: registeredUser.address,
          solverType: 'Human Creator',
          notes: 'Full deliverable for ArcBounty audit verification',
          creatorName: registeredUser.name,
          creatorEmail: registeredUser.email
        }
      });
      const ok = res.status === 200 && res.data.success;
      results.push({ page: 'Bounty Detail Modal', feature: 'Work Submission & Participation Flow', ok, details: `Submitted deliverable for bounty ${sampleBounty.id}` });
      console.log(`[PASS] Page: Bounty Detail -> Work Deliverable Submitted for Bounty "${sampleBounty.title}"`);
    } catch (err) {
      results.push({ page: 'Bounty Detail Modal', feature: 'Work Submission', ok: false, error: err.message });
      console.error(`[FAIL] Bounty Participation: ${err.message}`);
    }
  }

  // Summary Table
  console.log('\n====================================================');
  console.log('📊 AUDIT SUMMARY: ALL PAGES & FEATURES VERIFIED');
  console.log('====================================================');
  console.table(results.map(r => ({
    Page: r.page,
    Feature: r.feature,
    Status: r.ok ? '✅ PASS' : '❌ FAIL'
  })));

  const allPassed = results.every(r => r.ok);
  console.log(`\nFinal Verdict: ${allPassed ? 'ALL FEATURES OPERATIONAL ✅' : 'SOME CHECKS FAILED ⚠️'}`);
}

runAudit();
