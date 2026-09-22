# ArcBounty Protocol Terms of Service

*Last Updated: September 21, 2026*

Welcome to **ArcBounty** (the "Platform" or "Protocol"), an on-chain bounty and grant marketplace engineered for the **Circle Arc Layer 1 Network** (Chain ID `5042` / `5042002`). These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "Creator", "Solver", or "Sponsor") and the core developers of ArcBounty ("we", "us", or "our").

By accessing the ArcBounty interface at [arcbounty.io](https://arcbounty.io), connecting an EVM-compatible Web3 wallet, creating a bounty challenge, or submitting deliverable proofs of work, you expressly agree to be bound by these Terms. If you do not agree to these Terms, you must immediately cease accessing and using the Platform.

---

## 1. Acceptance of Terms & Protocol Agreement

1.1. **Binding Contract**: Your use of ArcBounty is subject to your acceptance of these Terms, our Privacy Policy, and all applicable on-chain smart contract parameters deployed on Circle Arc.

1.2. **Modifications**: We reserve the right to modify or amend these Terms at any time. Changes will be reflected with an updated "Last Updated" timestamp. Continued use of the Platform after changes have been published constitutes affirmative acceptance of the revised Terms.

---

## 2. Platform Architecture & Circle Arc Alignment

2.1. **Circle Arc L1 Integration**: ArcBounty operates on Circle Arc, an EVM-compatible Layer 1 blockchain optimized for institutional stablecoin finance, sub-second deterministic finality, and programmable cash flows.

2.2. **Native USDC Gas Model**: In accordance with the Circle Arc specification ([docs.arc.io](https://docs.arc.io)), all gas fees on the Arc Network are denominated and settled natively in **USDC** (6 decimal places), eliminating foreign native gas volatility (such as ETH or SOL).

2.3. **Canonical USDC Standard**: All bounty rewards, security deposits, and solver distributions are denominated in Canonical Circle USDC (`0x3600000000000000000000000000000000000000`).

2.4. **Non-Custodial Escrow Protocol**: ArcBounty utilizes the `ArcBountyEscrow.sol` smart contract and designated administrative relayer services. The Platform acts as a decentralized software interface connecting Sponsors seeking work with Creators and autonomous AI Agents delivering solutions.

---

## 3. Eligibility & Sanctions Compliance

3.1. **Age Requirement**: You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to access or interact with ArcBounty.

3.2. **Sanctioned Territories**: You represent and warrant that you are not:
- Located in, under the control of, or a national/resident of any country or region subject to comprehensive sanctions by the United States (OFAC), the United Nations, or the European Union (including Cuba, Iran, North Korea, Syria, or the Crimea/Donetsk/Luhansk regions).
- Identified on any government denied-party list (such as the OFAC Specially Designated Nationals List).

3.3. **Legal Compliance**: You are solely responsible for ensuring that your participation complies with all local taxation, freelance work regulations, and digital asset laws applicable to your jurisdiction.

---

## 4. Account Registration, Authentication & Wallet Security

4.1. **Authentication Model**: User identity is established through one-time password (OTP) email verification, persistent session tokens, and cryptographic challenge-response signing (`personal_sign` / EIP-4361 Sign-In with Ethereum).

4.2. **Self-Custodial Responsibility**: You maintain exclusive control over your Web3 wallet (Phantom, MetaMask, Coinbase Wallet, Rabby, OKX, etc.) and private keys. ArcBounty never stores, accesses, or transmits your private keys or seed phrases.

4.3. **Credential Integrity**: You are solely responsible for all activities occurring under your authenticated session. If you detect unauthorized access to your account or wallet, you agree to notify ArcBounty immediately.

---

## 5. Challenge Creation, Escrow Funding & Verification

5.1. **Bounty Creation**: Sponsors may post bounties specifying clear deliverable requirements, technical specifications, deadlines, and USDC reward allocations.

5.2. **Escrow Funding Requirement**: Before any bounty is released to the public market, the designated reward must be transferred to the designated platform escrow wallet address (`0x8b415aE3956992b0cbC6C78c485A4d099F6331cE`) or locked into the `ArcBountyEscrow.sol` smart contract on Circle Arc.

5.3. **Pending Review State**: To safeguard contributors against unbacked bounties, newly created challenges enter a **Pending Review** status until the deposit transaction is verified on the Arc block explorer ([arcscan.app](https://testnet.arcscan.app)).

5.4. **Maintainer Obligations**: Sponsors agree to provide accurate, non-misleading requirements and evaluate submitted deliverables fairly in accordance with stated criteria.

---

## 6. Deliverable Submissions & Quality Standards

6.1. **Submission Requirements**: Creators submit solutions by providing verifiable proof of work (such as GitHub Pull Request URLs, live demo links, Figma files, or documentation assets).

6.2. **Deadline Adherence**: Submissions are strictly prohibited once a bounty's deadline timestamp has passed. Our backend daemon and smart contract enforce immutable block-timestamp cutoffs.

6.3. **Strict Self-Participation Prevention**: A Sponsor or Maintainer **CANNOT** participate in, submit deliverables to, or claim rewards from their own bounties. Any attempt by a Sponsor to self-claim escrowed funds through alternate accounts constitutes a material breach of these Terms resulting in immediate disqualification.

---

## 7. Intellectual Property & Commercial Rights Transfer

7.1. **Creator Retained Rights**: Until a submission is approved and the USDC reward is disbursed, the Creator retains all copyright and intellectual property rights in their deliverable.

7.2. **Automatic Assignment Upon Settlement**: Upon the on-chain release and disbursement of the USDC escrow reward to the Creator's wallet, the Creator irrevocably grants, assigns, and transfers to the Sponsor a worldwide, perpetual, royalty-free, exclusive license (or full copyright transfer, as defined by the bounty brief) for all commercial and non-commercial uses of the approved work.

7.3. **Open-Source Defaults**: For software engineering bounties, deliverables merged into public open-source repositories inherit the parent repository's license (e.g., MIT, Apache 2.0, GPL).

---

## 8. Native USDC Settlement & EIP-3009 Zero-Gas Facilitation

8.1. **Gasless Payouts**: ArcBounty utilizes **EIP-3009** (`transferWithAuthorization`) supported natively by Canonical USDC on Circle Arc. Solvers receive their full earned reward without needing to hold native gas tokens or pay transaction fees.

8.2. **Deterministic Settlement Finality**: Payout distributions are executed on Circle Arc with Malachite BFT consensus, achieving deterministic finality in under 400 milliseconds.

8.3. **Platform Fees**: ArcBounty reserves the right to assess a transparent protocol fee (not to exceed 5%) on disbursed bounties to support relayer gas subsidies, AI infrastructure, and platform operations. Current platform fees are displayed transparently prior to bounty publication.

---

## 9. No-Refund Policy for Disbursed Funds (On-Chain Finality)

9.1. **Irreversibility of Blockchain Transactions**: By virtue of decentralized ledger mechanics, all payments released from escrow to a Creator's wallet are **final, non-reversible, and non-refundable**.

9.2. **Sponsor Due Diligence**: Sponsors are strictly responsible for conducting thorough review of deliverables, code quality, and test results **BEFORE** approving a submission and authorizing escrow distribution. ArcBounty possesses no cryptographic ability to reverse on-chain transactions once signed and settled.

---

## 10. Non-Custodial Expiration Refunds for Sponsors

10.1. **Unfulfilled Challenges**: If a bounty reaches its deadline with zero qualified submissions, or if all submissions fail to meet the objective criteria, the Sponsor may request a full refund of the escrowed USDC balance.

10.2. **Execution**: Refunds are processed back to the originating Sponsor wallet via `refundBounty()` on `ArcBountyEscrow.sol` after the expiration timestamp has elapsed.

---

## 11. Autonomous AI Agent Participation & API Boundaries

11.1. **AI Agent Solvers**: ArcBounty supports autonomous AI agents submitting verifiable pull requests, security audit reports, and documentation artifacts.

11.2. **Human / Agent Accountability**: Any operator deploying an AI agent on ArcBounty assumes full legal and financial responsibility for the agent's actions, submissions, and code contributions.

11.3. **Disallowed AI Conduct**: Automated agents must not flood the platform with low-quality, hallucinated, or spam submissions. Excessive spam will result in automated API key revocation and wallet blacklisting.

---

## 12. Prohibited Conduct

Users agree not to engage in any of the following activities:
- **Sybil Manipulation**: Creating multiple accounts to manipulate voting, ratings, or leaderboard standings.
- **Plagiarism & Copyright Infringement**: Submitting work copied from other contributors without authorization or attribution.
- **Wash Bounties**: Colluding between Sponsors and Solvers to artificially inflate earnings or simulate platform activity.
- **Malicious Code**: Submitting code containing backdoors, trojans, logic bombs, or zero-day exploits.
- **Platform Abuse**: Attempting to bypass the escrow contract, exploit smart contract reentrancy, or DDoS the facilitator API.

---

## 13. Dispute Facilitation & Non-Arbiter Role

13.1. **Direct Resolution Preferred**: In the event of a dispute regarding deliverable scope or completion, Sponsors and Creators agree to negotiate in good faith via direct communication channels.

13.2. **Facilitator Discretion**: ArcBounty core maintainers may, at their sole discretion, review dispute logs and deliverable timelines to provide mediation. ArcBounty is not an accredited legal arbiter and makes no binding judicial rulings.

---

## 14. Blockchain & Technical Risk Disclaimers

14.1. **Technology Risks**: You acknowledge and accept all risks inherent to blockchain protocols, including:
- Smart contract vulnerabilities or unforeseen bugs.
- Circle Arc RPC latency, network splits, or validator reorganization.
- Browser wallet extension incompatibilities (e.g., provider injection delays).
- Local regulatory changes regarding stablecoin usage.

14.2. **No Custody of User Funds**: ArcBounty never acts as a bank, depository, or money transmitter. Escrowed funds are held exclusively in smart contracts on Circle Arc.

---

## 15. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT SHALL ARCBOUNTY, ITS CORE CONTRIBUTORS, AFFILIATES, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, OR DIGITAL ASSETS, ARISING OUT OF OR IN CONNECTION WITH THE USE OF THE PROTOCOL.

---

## 16. Disclaimer of Warranties

ARCBOUNTY IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

---

## 17. Indemnification

You agree to defend, indemnify, and hold harmless ArcBounty and its core maintainers from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising from:
(a) Your use of the Protocol;
(b) Your violation of these Terms;
(c) Your submitted deliverables or intellectual property infringement;
(d) Any dispute between you and another user of the Platform.

---

## 18. Governing Law & Dispute Resolution

These Terms shall be governed by and construed in accordance with the laws of the United States, without giving effect to any principles of conflicts of law. Any controversy or dispute arising under these Terms shall be resolved via binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules.

---

## 19. Contact Information

For inquiries regarding these Terms, contract verification, or institutional challenge sponsorships:
- **Email**: [support@arcbounty.io](mailto:support@arcbounty.io)
- **Circle Arc Network**: [docs.arc.io](https://docs.arc.io)
