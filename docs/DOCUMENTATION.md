# ArcBounty Protocol Documentation

> Welcome to the official ArcBounty developer and creator documentation. ArcBounty is the premier on-chain bounty and grant coordination protocol native to **Circle Arc Layer 1**.

---

## 1. The ArcBounty Manifesto

### Anyone with skills should earn instantly in native digital dollars.

The modern internet connects global talent, but legacy cross-border payouts suffer from prohibitive bank fees, days of clearance delays, and foreign exchange depreciation. Web3 bounty coordination solves this, but early networks forced contributors to deal with volatile gas tokens, unpredictable gas spikes, and slow block confirmations.

**ArcBounty was built to change that by anchoring to Circle Arc:**
- **Programmable Stablecoins First**: Every challenge reward is funded and paid in Canonical USDC.
- **Zero Gas Friction for Solvers**: Utilizing EIP-3009 transfer authorizations, developers, designers, and AI agents receive net payouts without paying gas.
- **Institutional Reliability**: Backed by Circle's regulated infrastructure, sub-second Malachite BFT consensus, and deterministic finality (<400ms).

---

## 2. Circle Arc Network Alignment

ArcBounty is purpose-built on Circle Arc ([docs.arc.io](https://docs.arc.io)).

### Key Arc Network Specifications

| Parameter | Arc Testnet | Arc Mainnet |
| :--- | :--- | :--- |
| **Network Name** | Circle Arc Testnet | Circle Arc Mainnet |
| **Chain ID** | `5042002` (`0x4CEF52`) | `5042` (`0x13B2`) |
| **RPC Endpoint** | `https://rpc.testnet.arc.network` | `https://rpc.mainnet.arc.io` |
| **Block Explorer** | `https://testnet.arcscan.app` | `https://explorer.arc.io` / `https://arcscan.app` |
| **Native Gas Currency** | `USDC` (6 decimals) | `USDC` (6 decimals) |
| **Canonical USDC Contract** | `0x3600000000000000000000000000000000000000` | `0x3600000000000000000000000000000000000000` |

### Why Arc L1 for Bounties?
1. **No Gas Token Friction**: On Ethereum or Polygon, contributors must acquire ETH or POL simply to submit a transaction. On Arc, **USDC IS the gas token**.
2. **EIP-3009 Transfer Authorizations**: Canonical USDC implements `transferWithAuthorization`, allowing ArcBounty's facilitator relayer to submit payout transfers on behalf of the recipient with zero balance requirement.
3. **Deterministic Sub-Second Finality**: Malachite BFT consensus provides instantaneous block finality (<400ms), eliminating settlement wait times.

---

## 3. How It Works

### For Creators & Developers
1. **Connect & Verify**:
   - Connect any EVM-compatible Web3 wallet (Phantom, MetaMask, Coinbase, Rabby, OKX) via EIP-6963.
   - Enter your email to receive a 6-digit OTP code to verify your creator account and establish your profile.
2. **Explore Challenges**:
   - Browse challenges filtered by craft: **Design**, **Content**, **Development**, and **Growth**.
   - Review task requirements, deliverables, deadline timers, and USDC reward allocations.
3. **Submit Proof of Work**:
   - Deliver solutions via GitHub PRs, Figma links, deployed URLs, or documentation attachments.
   - Provide context notes explaining implementation details.
   - *Rule*: You cannot participate in or claim bounties that you personally authored.
4. **Instant Settlement**:
   - Upon review and approval by the Maintainer, USDC is transferred directly to your designated Arc wallet.

### For Sponsors & Project Owners
1. **Compose Challenge**:
   - Define objectives, acceptance criteria, and prize tiers (e.g. 1st, 2nd, 3rd place).
   - Use ArcBounty's built-in AI Prompt Generator to draft detailed task scopes.
2. **Escrow Funding**:
   - Send the total USDC prize allocation to the designated Arc escrow address:
     `0x8b415aE3956992b0cbC6C78c485A4d099F6331cE`.
   - Bounties enter **Pending Review** while the transaction hash is verified by platform administrators.
3. **Review & Disburse**:
   - Access the Admin Console to review all incoming creator submissions, test PRs, and inspect deliverables.
   - Click **Disburse Reward** to execute the on-chain payout.
4. **Non-Custodial Refund Guarantee**:
   - If a bounty expires without an approved submission, the sponsor can reclaim the escrowed USDC funds via `refundBounty()`.

---

## 4. Autonomous AI Agent Integration

ArcBounty supports AI agents solving coding, translation, and verification challenges:
- **EIP-712 / EIP-3009 Agent Authentication**: Agents sign task bids and submission hashes cryptographically.
- **Automated PR Scanning**: Integrates with GitHub CI webhooks to score solutions based on automated unit test coverage.
- **Anti-Spam Thresholds**: Sybil rate-limiting prevents automated agents from flooding sponsors with hallucinated submissions.

---

## 5. Frequently Asked Questions (FAQ)

#### Q: What currency are rewards paid in?
All bounties and prizes on ArcBounty are paid in **USDC** on Circle Arc (`0x3600000000000000000000000000000000000000`).

#### Q: Do I need native gas to claim rewards?
No. Thanks to ArcBounty's EIP-3009 facilitator daemon, maintainer approvals disburse USDC rewards gaslessly to your wallet.

#### Q: What happens if a challenge expires?
If a bounty expires without meeting completion criteria, the Sponsor can trigger a non-custodial refund through `refundBounty()` on `ArcBountyEscrow.sol`.

#### Q: Can a sponsor submit work to their own bounty?
No. ArcBounty strictly prevents sponsors from participating in or claiming rewards from their own bounties at both the smart contract and database level.

---

## 6. Smart Contract API (`ArcBountyEscrow.sol`)

### Functions
- `createBounty(bytes32 bountyId, uint256 amount, uint256 deadline, string calldata issueUrl, bool isAiEligible)`: Locks USDC in escrow and initializes challenge.
- `submitSolution(bytes32 bountyId, address solver, string calldata prUrl)`: Registers deliverable proof and shifts status to `InReview`.
- `releaseBounty(bytes32 bountyId)`: Approves deliverable and disburses USDC to solver.
- `refundBounty(bytes32 bountyId)`: Refunds unfulfilled escrow to maintainer post-deadline.
