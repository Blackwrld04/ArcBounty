// Circle Arc Blockchain Constants & Network Helpers

export const ARC_MAINNET = {
  id: 5042,
  name: 'Arc Mainnet',
  rpcUrl: 'https://rpc.mainnet.arc.io',
  explorerUrl: 'https://explorer.arc.io',
  nativeGasToken: 'USDC',
  consensus: 'Malachite BFT (<400ms finality)',
};

export const ARC_TESTNET = {
  id: 5042002,
  name: 'Arc Testnet',
  rpcUrl: 'https://rpc.testnet.arc.io',
  explorerUrl: 'https://testnet.arcscan.io',
  nativeGasToken: 'USDC',
  consensus: 'Malachite BFT (<400ms finality)',
};

export const CANONICAL_USDC_ADDRESS = '0x3600000000000000000000000000000000000000';

export function formatUsdc(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function truncateAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
