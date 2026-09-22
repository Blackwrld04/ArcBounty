import assert from 'node:assert/strict';

async function runE2ETest() {
  console.log('--- Starting ArcBounty E2E API Verification ---');

  // 1. Create a bounty with tiered prize distribution
  console.log('1. Creating tiered bounty as a user...');
  const createRes = await fetch('http://localhost:4050/api/bounties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'E2E Test 3D Hologram Logo Challenge ' + Date.now(),
      category: 'DESIGN',
      categoryName: 'Design & Creative',
      submissionType: 'Figma Link',
      amount: 180,
      description: 'Design official 3D hologram logo for Circle Arc ecosystem.',
      maintainer: '0x1234567890123456789012345678901234567890',
      maintainerName: 'Circle Arc Design Guild',
      maintainerEmail: 'guild@arc.builders',
      deadlineDays: 14,
      rewardDistribution: {
        type: 'tiered',
        winnerCount: 3,
        tiers: [
          { place: 1, amount: 100, label: '1st Place' },
          { place: 2, amount: 50, label: '2nd Place' },
          { place: 3, amount: 30, label: '3rd Place' }
        ]
      }
    })
  });

  const createData = await createRes.json();
  assert.equal(createRes.status, 201);
  assert.equal(createData.success, true);
  const createdBounty = createData.bounty;
  console.log(`✓ Bounty created: ID ${createdBounty.id}, Status: "${createdBounty.status}"`);
  assert.equal(createdBounty.status, 'Pending Review');
  assert.equal(createdBounty.paymentStatus, 'pending_review');
  assert.equal(createdBounty.rewardDistribution.type, 'tiered');
  assert.equal(createdBounty.rewardDistribution.winnerCount, 3);

  // 2. Check public creator feed: Bounty MUST NOT appear yet!
  console.log('2. Verifying public creator feed does NOT list the pending bounty...');
  const publicRes = await fetch('http://localhost:4050/api/bounties');
  const publicData = await publicRes.json();
  assert.equal(publicRes.status, 200);
  const foundInPublic = publicData.bounties.find(b => b.id === createdBounty.id);
  assert.equal(foundInPublic, undefined, 'Pending bounty must not appear in public creator feed');
  console.log('✓ Public creator feed correctly filtered: pending bounty hidden from creators.');

  // 3. Authenticate as Administrator
  console.log('3. Authenticating admin portal...');
  const adminLoginRes = await fetch('http://localhost:4050/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'arcbounty2026_admin!' })
  });
  const adminLoginData = await adminLoginRes.json();
  assert.equal(adminLoginRes.status, 200);
  assert.equal(adminLoginData.success, true);
  const adminToken = adminLoginData.token;
  console.log('✓ Admin authenticated successfully.');

  // 4. Admin queries all bounties: pending bounty MUST appear
  console.log('4. Admin checking pending review queue...');
  const adminBountiesRes = await fetch('http://localhost:4050/api/admin/bounties', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminBountiesData = await adminBountiesRes.json();
  assert.equal(adminBountiesRes.status, 200);
  const foundInAdmin = adminBountiesData.bounties.find(b => b.id === createdBounty.id);
  assert.ok(foundInAdmin, 'Pending bounty must appear in admin queue');
  assert.equal(foundInAdmin.status, 'Pending Review');
  console.log('✓ Admin queue correctly shows pending bounty for verification.');

  // 5. Admin approves and publishes the bounty
  console.log('5. Admin approving bounty and publishing live...');
  const approveRes = await fetch(`http://localhost:4050/api/admin/bounties/${createdBounty.id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    }
  });
  const approveData = await approveRes.json();
  assert.equal(approveRes.status, 200);
  assert.equal(approveData.success, true);
  assert.equal(approveData.bounty.status, 'Open');
  assert.equal(approveData.bounty.paymentStatus, 'funded');
  console.log(`✓ Bounty approved! Message: "${approveData.message}"`);

  // 6. Check public creator feed: Bounty MUST NOW appear and be Open!
  console.log('6. Checking public creator feed after approval...');
  const publicAfterRes = await fetch('http://localhost:4050/api/bounties');
  const publicAfterData = await publicAfterRes.json();
  const foundNowInPublic = publicAfterData.bounties.find(b => b.id === createdBounty.id);
  assert.ok(foundNowInPublic, 'Approved bounty must now appear on public creator feed');
  assert.equal(foundNowInPublic.status, 'Open');
  assert.equal(foundNowInPublic.rewardDistribution.type, 'tiered');
  console.log('✓ Public creator feed now shows approved challenge as Open with 3-tier distribution!');

  // 7. Test strict deadline enforcement
  console.log('7. Testing deadline enforcement on expired bounty...');
  // Create an expired bounty
  const expiredRes = await fetch('http://localhost:4050/api/bounties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Expired Challenge For Deadline Check ' + Date.now(),
      category: 'DEV',
      amount: 50,
      deadline: Date.now() - 60000 // Expired 1 minute ago
    })
  });
  const expiredData = await expiredRes.json();
  // Admin approves it to make status Open
  await fetch(`http://localhost:4050/api/admin/bounties/${expiredData.bounty.id}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  });

  // Attempt participant submission
  const lateSubmitRes = await fetch(`http://localhost:4050/api/bounties/${expiredData.bounty.id}/participate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      submissionUrl: 'https://github.com/late/entry',
      walletAddress: '0x9999999999999999999999999999999999999999',
      notes: 'Submitted after deadline'
    })
  });
  const lateSubmitData = await lateSubmitRes.json();
  assert.equal(lateSubmitRes.status, 400);
  assert.equal(lateSubmitData.success, false);
  assert.match(lateSubmitData.error, /deadline/i);
  console.log(`✓ Deadline enforcement verified: late submission correctly rejected with HTTP 400: "${lateSubmitData.error}"`);

  // 8. Test creator submission on valid Open bounty
  console.log('8. Testing creator participation on approved challenge...');
  const submitRes = await fetch(`http://localhost:4050/api/bounties/${createdBounty.id}/participate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      submissionUrl: 'https://www.figma.com/design/arc-hologram-logo',
      walletAddress: '0x4444444444444444444444444444444444444444',
      creatorName: 'Amara Studio',
      creatorEmail: 'amara@creators.arc',
      notes: 'Rendered vector SVG and 3D GLTF hologram assets.'
    })
  });
  const submitData = await submitRes.json();
  assert.equal(submitRes.status, 200);
  assert.equal(submitData.success, true);
  assert.equal(submitData.bounty.status, 'Open');
  console.log('✓ Deliverable successfully submitted! Bounty status remains Open while deadline is active.');

  console.log('\n--- ALL E2E REQUIREMENTS VERIFIED SUCCESSFULLY! ---');
}

runE2ETest().catch(err => {
  console.error('E2E Verification Failed:', err);
  process.exit(1);
});
