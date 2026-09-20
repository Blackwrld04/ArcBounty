import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createVerificationCode,
  verifyCode,
  getUserByEmail,
  createUser,
  createSession,
  getUserByToken,
  updateUserSocial,
  updateUserWallet
} from '../src/db.js';

test('ArcBounty SQLite Auth & Verification Database Tests', async (t) => {
  const testEmail = `test_db_${Date.now()}@arc.network`;

  await t.test('generates and stores 6-digit verification code with 10-minute expiry', () => {
    const { code, expiresAt } = createVerificationCode(testEmail, 'signup');
    assert.equal(typeof code, 'string');
    assert.equal(code.length, 6);
    assert.ok(expiresAt > Date.now());
  });

  await t.test('rejects incorrect verification code', () => {
    const result = verifyCode(testEmail, '000000');
    assert.equal(result.valid, false);
  });

  await t.test('validates correct verification code and prevents replay', () => {
    const { code } = createVerificationCode(testEmail, 'signup');
    const firstCheck = verifyCode(testEmail, code);
    assert.equal(firstCheck.valid, true);

    // Replay attack prevention
    const secondCheck = verifyCode(testEmail, code);
    assert.equal(secondCheck.valid, false);
  });

  await t.test('creates persistent user record and assigns Arc L1 wallet address', () => {
    const user = createUser({
      email: testEmail,
      name: 'Test Creator',
      username: `creator_${Date.now()}`,
      discipline: 'Development'
    });

    assert.ok(user.id.startsWith('usr_'));
    assert.equal(user.email, testEmail);
    assert.ok(user.wallet_address.startsWith('0x'));
    assert.equal(user.discipline, 'Development');
    assert.equal(user.usdc_balance, 1000.0);

    const fetched = getUserByEmail(testEmail);
    assert.equal(fetched.id, user.id);
  });

  await t.test('creates and validates persistent session token', () => {
    const user = getUserByEmail(testEmail);
    const { token } = createSession(user.id);
    assert.ok(token.startsWith('arc_sess_'));

    const sessionUser = getUserByToken(token);
    assert.equal(sessionUser.id, user.id);
    assert.equal(sessionUser.email, testEmail);
  });

  await t.test('links and unlinks social accounts (Telegram, Discord, X, GitHub)', () => {
    const user = getUserByEmail(testEmail);
    
    // Connect Telegram
    const u1 = updateUserSocial(user.id, 'telegram', '@arc_tg_user');
    assert.equal(u1.telegram, 'arc_tg_user');

    // Connect Discord
    const u2 = updateUserSocial(user.id, 'discord', 'arc_discord#1234');
    assert.equal(u2.discord, 'arc_discord#1234');

    // Connect X
    const u3 = updateUserSocial(user.id, 'x', '@arc_x_creator');
    assert.equal(u3.x, 'arc_x_creator');

    // Connect GitHub
    const u4 = updateUserSocial(user.id, 'github', 'arc-gh-dev');
    assert.equal(u4.github, 'arc-gh-dev');

    // Disconnect Telegram
    const u5 = updateUserSocial(user.id, 'telegram', null);
    assert.equal(u5.telegram, null);
  });

  await t.test('updates and persists EVM wallet connection on Arc L1', () => {
    const user = getUserByEmail(testEmail);
    const newAddr = '0x1234567890abcdef1234567890abcdef12345678';
    const updated = updateUserWallet(user.id, newAddr);
    assert.equal(updated.wallet_address, newAddr.toLowerCase());
  });
});
