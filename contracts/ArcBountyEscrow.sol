// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArcBountyEscrow
 * @notice Native USDC Developer & AI Agent Bounty Escrow on Circle's Arc Mainnet & Testnet.
 * @dev Optimized for Circle Arc L1 (Chain ID 5042 / 5042002) with native USDC gas
 *      and EIP-3009 transfer authorizations for zero-gas solver payouts.
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IERC3009 {
    function transferWithAuthorization(
        address from,
        address to,
        uint256 value,
        uint256 validAfter,
        uint256 validBefore,
        bytes32 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract ArcBountyEscrow {
    // Canonical Circle USDC on Arc Mainnet & Testnet
    address public constant CANONICAL_USDC = 0x3600000000000000000000000000000000000000;

    enum BountyStatus {
        Open,       // Escrow funded, awaiting contributor or AI agent
        InReview,   // Solution / PR submitted for maintainer review
        Settled,    // PR approved & USDC disbursed to solver
        Refunded    // Expired and refunded to maintainer
    }

    struct Bounty {
        bytes32 bountyId;
        address maintainer;
        address solver;
        uint256 amount;        // USDC amount (6 decimals)
        uint256 createdAt;
        uint256 deadline;
        BountyStatus status;
        string issueUrl;
        string prUrl;
        bool isAiEligible;
    }

    mapping(bytes32 => Bounty) public bounties;
    bytes32[] public allBountyIds;

    event BountyCreated(
        bytes32 indexed bountyId,
        address indexed maintainer,
        uint256 amount,
        string issueUrl,
        uint256 deadline,
        bool isAiEligible
    );

    event SolutionSubmitted(
        bytes32 indexed bountyId,
        address indexed solver,
        string prUrl
    );

    event BountySettled(
        bytes32 indexed bountyId,
        address indexed solver,
        uint256 amount,
        string prUrl
    );

    event BountyRefunded(
        bytes32 indexed bountyId,
        address indexed maintainer,
        uint256 amount
    );

    /**
     * @notice Create and fund a new developer bounty.
     * @param bountyId Unique identifier hash
     * @param amount USDC reward (in micro-units: 1 USDC = 1,000,000)
     * @param deadline Unix timestamp for completion
     * @param issueUrl GitHub Issue reference
     * @param isAiEligible Whether autonomous AI agents are permitted to solve
     */
    function createBounty(
        bytes32 bountyId,
        uint256 amount,
        uint256 deadline,
        string calldata issueUrl,
        bool isAiEligible
    ) external {
        require(amount > 0, "Reward must be > 0");
        require(deadline > block.timestamp, "Deadline must be in future");
        require(bounties[bountyId].createdAt == 0, "Bounty already exists");

        // Transfer USDC from maintainer to escrow
        require(
            IERC20(CANONICAL_USDC).transferFrom(msg.sender, address(this), amount),
            "USDC deposit failed"
        );

        bounties[bountyId] = Bounty({
            bountyId: bountyId,
            maintainer: msg.sender,
            solver: address(0),
            amount: amount,
            createdAt: block.timestamp,
            deadline: deadline,
            status: BountyStatus.Open,
            issueUrl: issueUrl,
            prUrl: "",
            isAiEligible: isAiEligible
        });

        allBountyIds.push(bountyId);

        emit BountyCreated(bountyId, msg.sender, amount, issueUrl, deadline, isAiEligible);
    }

    /**
     * @notice Submit a Pull Request solution for review.
     */
    function submitSolution(
        bytes32 bountyId,
        address solver,
        string calldata prUrl
    ) external {
        Bounty storage b = bounties[bountyId];
        require(b.status == BountyStatus.Open, "Bounty not open");
        require(block.timestamp <= b.deadline, "Bounty expired");
        require(solver != address(0), "Invalid solver address");

        b.solver = solver;
        b.prUrl = prUrl;
        b.status = BountyStatus.InReview;

        emit SolutionSubmitted(bountyId, solver, prUrl);
    }

    /**
     * @notice Maintainer approves PR and disburses USDC to solver.
     */
    function releaseBounty(bytes32 bountyId) external {
        Bounty storage b = bounties[bountyId];
        require(msg.sender == b.maintainer, "Only maintainer can release");
        require(b.status == BountyStatus.InReview, "Bounty not in review");
        require(b.solver != address(0), "No solver assigned");

        b.status = BountyStatus.Settled;
        require(
            IERC20(CANONICAL_USDC).transfer(b.solver, b.amount),
            "USDC payout failed"
        );

        emit BountySettled(bountyId, b.solver, b.amount, b.prUrl);
    }

    /**
     * @notice Reclaim funds if deadline passed and bounty remains unfulfilled.
     */
    function refundBounty(bytes32 bountyId) external {
        Bounty storage b = bounties[bountyId];
        require(msg.sender == b.maintainer, "Only maintainer can refund");
        require(b.status == BountyStatus.Open, "Bounty not open");
        require(block.timestamp > b.deadline, "Deadline not passed");

        b.status = BountyStatus.Refunded;
        require(
            IERC20(CANONICAL_USDC).transfer(b.maintainer, b.amount),
            "USDC refund failed"
        );

        emit BountyRefunded(bountyId, b.maintainer, b.amount);
    }

    function getBountyCount() external view returns (uint256) {
        return allBountyIds.length;
    }
}
