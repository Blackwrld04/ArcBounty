import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '4050', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Arc Mainnet & Testnet Configuration
  arcRpcUrl: process.env.ARC_RPC_URL || 'https://rpc.mainnet.arc.io',
  arcChainId: parseInt(process.env.ARC_CHAIN_ID || '5042', 10),
  
  // Arc Testnet Fallback
  arcTestnetRpcUrl: 'https://rpc.testnet.arc.io',
  arcTestnetChainId: 5042002,

  // Canonical USDC on Circle Arc
  usdcAddress: '0x3600000000000000000000000000000000000000',
  usdcDecimals: 6,

  // Facilitator for EIP-3009 gasless settlement relays
  facilitatorPrivateKey: process.env.FACILITATOR_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001',
  escrowContractAddress: process.env.ESCROW_CONTRACT_ADDRESS || '0x8b415aE3956992b0cbC6C78c485A4d099F6331cE',
};
