export const ARC_BOUNTY_ESCROW_ABI = [
  {
    "type": "function",
    "name": "createBounty",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "bountyId", "type": "bytes32" },
      { "name": "amount", "type": "uint256" },
      { "name": "deadline", "type": "uint256" },
      { "name": "issueUrl", "type": "string" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "submitSolution",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "bountyId", "type": "bytes32" },
      { "name": "solver", "type": "address" },
      { "name": "prUrl", "type": "string" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "releaseBounty",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "bountyId", "type": "bytes32" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "refundBounty",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "bountyId", "type": "bytes32" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "bounties",
    "stateMutability": "view",
    "inputs": [{ "name": "", "type": "bytes32" }],
    "outputs": [
      { "name": "bountyId", "type": "bytes32" },
      { "name": "maintainer", "type": "address" },
      { "name": "solver", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "createdAt", "type": "uint256" },
      { "name": "deadline", "type": "uint256" },
      { "name": "status", "type": "uint8" },
      { "name": "issueUrl", "type": "string" },
      { "name": "prUrl", "type": "string" }
    ]
  },
  {
    "type": "function",
    "name": "getBountyCount",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }]
  }
];

export const CANONICAL_USDC_ABI = [
  {
    "type": "function",
    "name": "name",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }]
  },
  {
    "type": "function",
    "name": "symbol",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }]
  },
  {
    "type": "function",
    "name": "decimals",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint8" }]
  },
  {
    "type": "function",
    "name": "balanceOf",
    "stateMutability": "view",
    "inputs": [{ "name": "account", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "transfer",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "recipient", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }]
  },
  {
    "type": "function",
    "name": "approve",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }]
  },
  {
    "type": "function",
    "name": "transferWithAuthorization",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "from", "type": "address" },
      { "name": "to", "type": "address" },
      { "name": "value", "type": "uint256" },
      { "name": "validAfter", "type": "uint256" },
      { "name": "validBefore", "type": "uint256" },
      { "name": "nonce", "type": "bytes32" },
      { "name": "v", "type": "uint8" },
      { "name": "r", "type": "bytes32" },
      { "name": "s", "type": "bytes32" }
    ],
    "outputs": []
  }
];
