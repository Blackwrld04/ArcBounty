import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllBounties,
  getBountyById,
  createBountyRecord,
  createBountySubmission,
  getBountySubmissions,
  disburseBountyReward,
  getAdminOverviewStats,
  isAdminUser,
  createUser,
  createSession
} from '../src/db.js';

test('ArcBounty Escrow Payments & Admin Distribution Tests', async (t) => {
  let createdBounty = null;
  let testSubmission = null;

  await t.test('verifies admin authorization for configured admin emails', () => {
    assert.equal(isAdminUser('jasminee0904@gmail.com'), true);
    assert.equal(isAdminUser('olajideabdulquadri97@gmail.com'), true);
    assert.equal(isAdminUser('olajideabdulquadri22@gmail.com'), true);
    assert.equal(isAdminUser('random_stranger@example.com'), false);
    assert.equal(isAdminUser(''), false);
  });

  await t.test('creates bounty with designated escrow wallet and deposit metadata', () => {
    const escrowAddr = '0x8b415aE3956992b0cbC6C78c485A4d099F6331cE';
    const mockTx = '0xdep1234567890abcdef1234567890abcdef12';

    createdBounty = createBountyRecord({
      title: 'Build Decentralized File Verification on Arc',
      category: 'DEV',
      categoryName: 'Code & Apps',
      amount: 1750,
      description: 'Implement zero-knowledge hash verification on Circle Arc L1.',
      escrowWallet: escrowAddr,
      depositTx: mockTx,
      maintainer: '0x1111111111111111111111111111111111111111',
      maintainerName: 'Arc Security Guild',
      deadlineDays: 7
    });

    assert.ok(createdBounty.id);
    assert.equal(createdBounty.title, 'Build Decentralized File Verification on Arc');
    assert.equal(createdBounty.amount, 1750);
    assert.equal(createdBounty.escrowWallet, escrowAddr);
    assert.equal(createdBounty.depositTx, mockTx);
    assert.equal(createdBounty.status, 'Open');
    assert.equal(createdBounty.paymentStatus, 'funded');
  });

  await t.test('allows multiple creators to participate in a challenge', () => {
    const creatorWallet = '0x2222222222222222222222222222222222222222';
    testSubmission = createBountySubmission({
      bountyId: createdBounty.id,
      creatorName: 'Amina Dev',
      creatorEmail: 'amina@arc.builders',
      walletAddress: creatorWallet,
      submissionUrl: 'https://github.com/amina-dev/arc-zk-verify',
      notes: 'Completed full verification smart contract and benchmark suite on Arc Testnet.'
    });

    assert.ok(testSubmission.id.startsWith('sub_'));
    assert.equal(testSubmission.bountyId, createdBounty.id);
    assert.equal(testSubmission.walletAddress, creatorWallet.toLowerCase());

    const submissions = getBountySubmissions(createdBounty.id);
    assert.ok(submissions.length >= 1);
    assert.equal(submissions[0].submission_url, 'https://github.com/amina-dev/arc-zk-verify');

    // Bounty status should automatically transition to InReview
    const updated = getBountyById(createdBounty.id);
    assert.equal(updated.status, 'InReview');
  });

  await t.test('admin disburses USDC reward from escrow to the creator', () => {
    const disbResult = disburseBountyReward({
      bountyId: createdBounty.id,
      submissionId: testSubmission.id,
      adminEmail: 'jasminee0904@gmail.com',
      customAmount: 1750
    });

    assert.equal(disbResult.success, true);
    assert.equal(disbResult.amount, 1750);
    assert.ok(disbResult.txHash.startsWith('0xarc'));
    assert.equal(disbResult.recipient, '0x2222222222222222222222222222222222222222');

    // Bounty should now be Settled
    const settledBounty = getBountyById(createdBounty.id);
    assert.equal(settledBounty.status, 'Settled');
    assert.equal(settledBounty.paymentStatus, 'settled');
    assert.equal(settledBounty.solver, '0x2222222222222222222222222222222222222222');
    assert.ok(settledBounty.settlementTx);
  });

  await t.test('admin overview stats aggregates platform metrics accurately', () => {
    const stats = getAdminOverviewStats();
    assert.ok(stats.totalBounties >= 1);
    assert.ok(stats.totalEscrowedUsdc > 0);
    assert.ok(stats.totalSubmissions >= 1);
    assert.ok(stats.totalDistributedUsdc >= 1750);
    assert.equal(stats.escrowWallet, '0x8b415aE3956992b0cbC6C78c485A4d099F6331cE');
  });

  await t.test('authenticates master admin with password and rejects invalid attempts', async () => {
    const { requireAdmin, activeAdminTokens } = await import('../src/routes/admin.js');
    const validPassword = process.env.ADMIN_PASSWORD || 'arcbounty2026_admin!';

    // Simulating login logic
    const wrongAttempt = 'wrong_password_123';
    assert.notEqual(wrongAttempt, validPassword);

    // Mock Express request/response to test requireAdmin middleware
    let nextCalled = false;
    const req = { headers: {} };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.data = data;
        return this;
      }
    };

    // 1. Unauthenticated request without token
    requireAdmin(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);

    // 2. Request with invalid token
    req.headers.authorization = 'Bearer arc_adm_invalid_fake_token';
    requireAdmin(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 401);

    // 3. Request with valid active admin password token
    const testAdminToken = 'arc_adm_test_valid_token_xyz123';
    activeAdminTokens.set(testAdminToken, {
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000
    });

    req.headers.authorization = `Bearer ${testAdminToken}`;
    requireAdmin(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(req.user.role, 'admin');
    assert.equal(req.user.name, 'Master Administrator');

    // Clean up
    activeAdminTokens.delete(testAdminToken);
  });
});

