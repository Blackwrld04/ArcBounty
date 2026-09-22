/**
 * ArcBounty Web3 Wallet Detection & EIP-6963 Provider Discovery
 *
 * Supports robust multi-wallet extension detection:
 * - Phantom (window.phantom.ethereum, EIP-6963 app.phantom)
 * - Rabby Wallet (window.rabby, EIP-6963 io.rabby, window.ethereum.isRabby)
 * - MetaMask (EIP-6963 io.metamask, window.ethereum.isMetaMask)
 * - Coinbase Wallet (window.coinbaseWalletExtension, EIP-6963 com.coinbase.wallet)
 * - Generic injected EVM providers (window.ethereum)
 */

// Global registry of announced EIP-6963 providers
const eip6963Providers = new Map();
const listeners = new Set();

let isInitialized = false;

export function initWalletDetection() {
  if (typeof window === 'undefined' || isInitialized) return;
  isInitialized = true;

  window.addEventListener('eip6963:announceProvider', (event) => {
    if (event?.detail?.info?.rdns && event?.detail?.provider) {
      eip6963Providers.set(event.detail.info.rdns, event.detail);
      listeners.forEach((callback) => {
        try { callback(); } catch (e) {}
      });
    }
  });

  // Request all active extensions to announce themselves
  window.dispatchEvent(new Event('eip6963:requestProvider'));
}

export function subscribeWalletDetection(callback) {
  listeners.add(callback);
  // Re-request in case extensions were loaded asynchronously
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('eip6963:requestProvider'));
  }
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Check if a specific wallet extension is detected in the browser
 */
export function isWalletInstalled(walletId) {
  if (typeof window === 'undefined') return false;

  switch (walletId) {
    case 'phantom': {
      // 1. Check window.phantom.ethereum (official Phantom EVM injection)
      if (window.phantom?.ethereum) return true;
      // 2. Check window.phantom.solana (Phantom extension is installed)
      if (window.phantom?.solana?.isPhantom) return true;
      // 3. Check EIP-6963 announced providers
      if (eip6963Providers.has('app.phantom')) return true;
      for (const [rdns, detail] of eip6963Providers.entries()) {
        if (rdns.toLowerCase().includes('phantom') || detail?.info?.name?.toLowerCase().includes('phantom')) {
          return true;
        }
      }
      // 4. Check window.ethereum.isPhantom
      if (window.ethereum?.isPhantom) return true;
      // 5. Check multi-provider array
      if (Array.isArray(window.ethereum?.providers) && window.ethereum.providers.some(p => p.isPhantom)) {
        return true;
      }
      return false;
    }

    case 'rabby': {
      if (window.rabby) return true;
      if (eip6963Providers.has('io.rabby')) return true;
      for (const [rdns, detail] of eip6963Providers.entries()) {
        if (rdns.toLowerCase().includes('rabby') || detail?.info?.name?.toLowerCase().includes('rabby')) {
          return true;
        }
      }
      if (window.ethereum?.isRabby) return true;
      if (Array.isArray(window.ethereum?.providers) && window.ethereum.providers.some(p => p.isRabby)) {
        return true;
      }
      return false;
    }

    case 'metamask': {
      if (eip6963Providers.has('io.metamask')) return true;
      for (const [rdns, detail] of eip6963Providers.entries()) {
        if (rdns.toLowerCase().includes('metamask') || detail?.info?.name?.toLowerCase().includes('metamask')) {
          return true;
        }
      }
      if (Array.isArray(window.ethereum?.providers) && window.ethereum.providers.some(p => p.isMetaMask && !p.isPhantom && !p.isRabby)) {
        return true;
      }
      if (window.ethereum?.isMetaMask && !window.ethereum?.isPhantom && !window.ethereum?.isRabby) {
        return true;
      }
      return false;
    }

    case 'coinbase': {
      if (window.coinbaseWalletExtension) return true;
      if (eip6963Providers.has('com.coinbase.wallet')) return true;
      for (const [rdns, detail] of eip6963Providers.entries()) {
        if (rdns.toLowerCase().includes('coinbase') || detail?.info?.name?.toLowerCase().includes('coinbase')) {
          return true;
        }
      }
      if (window.ethereum?.isCoinbaseWallet) return true;
      if (Array.isArray(window.ethereum?.providers) && window.ethereum.providers.some(p => p.isCoinbaseWallet)) {
        return true;
      }
      return false;
    }

    default:
      return Boolean(window.ethereum || window.phantom?.ethereum || eip6963Providers.size > 0);
  }
}

/**
 * Get map of all detected wallets in browser
 */
export function getDetectedWallets() {
  if (typeof window === 'undefined') {
    return { phantom: false, rabby: false, metamask: false, coinbase: false, any: false };
  }

  const phantom = isWalletInstalled('phantom');
  const rabby = isWalletInstalled('rabby');
  const metamask = isWalletInstalled('metamask');
  const coinbase = isWalletInstalled('coinbase');
  const any = phantom || rabby || metamask || coinbase || Boolean(window.ethereum);

  return {
    phantom,
    rabby,
    metamask,
    coinbase,
    any
  };
}

/**
 * Retrieve the exact EIP-1193 provider for a chosen wallet id
 */
export function getWalletProvider(walletId) {
  if (typeof window === 'undefined') return null;

  switch (walletId) {
    case 'phantom': {
      // 1. Direct Phantom EVM provider
      if (window.phantom?.ethereum) {
        return window.phantom.ethereum;
      }
      // 2. EIP-6963 provider
      if (eip6963Providers.has('app.phantom')) {
        return eip6963Providers.get('app.phantom').provider;
      }
      for (const [rdns, detail] of eip6963Providers.entries()) {
        if (rdns.toLowerCase().includes('phantom') || detail?.info?.name?.toLowerCase().includes('phantom')) {
          return detail.provider;
        }
      }
      // 3. Multi-provider in window.ethereum
      if (Array.isArray(window.ethereum?.providers)) {
        const found = window.ethereum.providers.find(p => p.isPhantom);
        if (found) return found;
      }
      // 4. Injected window.ethereum with isPhantom flag
      if (window.ethereum?.isPhantom) {
        return window.ethereum;
      }
      // 5. If only Phantom extension is present
      if (window.phantom) {
        return window.phantom.ethereum || window.ethereum || null;
      }
      return window.ethereum || null;
    }

    case 'rabby': {
      if (window.rabby) return window.rabby;
      if (eip6963Providers.has('io.rabby')) {
        return eip6963Providers.get('io.rabby').provider;
      }
      for (const [rdns, detail] of eip6963Providers.entries()) {
        if (rdns.toLowerCase().includes('rabby') || detail?.info?.name?.toLowerCase().includes('rabby')) {
          return detail.provider;
        }
      }
      if (Array.isArray(window.ethereum?.providers)) {
        const found = window.ethereum.providers.find(p => p.isRabby);
        if (found) return found;
      }
      if (window.ethereum?.isRabby) return window.ethereum;
      return window.ethereum || null;
    }

    case 'metamask': {
      if (eip6963Providers.has('io.metamask')) {
        return eip6963Providers.get('io.metamask').provider;
      }
      for (const [rdns, detail] of eip6963Providers.entries()) {
        if (rdns.toLowerCase().includes('metamask') || detail?.info?.name?.toLowerCase().includes('metamask')) {
          return detail.provider;
        }
      }
      if (Array.isArray(window.ethereum?.providers)) {
        const found = window.ethereum.providers.find(p => p.isMetaMask && !p.isPhantom && !p.isRabby);
        if (found) return found;
      }
      if (window.ethereum?.isMetaMask && !window.ethereum?.isPhantom && !window.ethereum?.isRabby) {
        return window.ethereum;
      }
      return window.ethereum || null;
    }

    case 'coinbase': {
      if (window.coinbaseWalletExtension) return window.coinbaseWalletExtension;
      if (eip6963Providers.has('com.coinbase.wallet')) {
        return eip6963Providers.get('com.coinbase.wallet').provider;
      }
      for (const [rdns, detail] of eip6963Providers.entries()) {
        if (rdns.toLowerCase().includes('coinbase') || detail?.info?.name?.toLowerCase().includes('coinbase')) {
          return detail.provider;
        }
      }
      if (Array.isArray(window.ethereum?.providers)) {
        const found = window.ethereum.providers.find(p => p.isCoinbaseWallet);
        if (found) return found;
      }
      if (window.ethereum?.isCoinbaseWallet) return window.ethereum;
      return window.ethereum || null;
    }

    default:
      return window.ethereum || window.phantom?.ethereum || null;
  }
}

/**
 * Get official download/install URL for a wallet
 */
export function getWalletDownloadUrl(walletId) {
  switch (walletId) {
    case 'phantom':
      return 'https://phantom.app/download';
    case 'rabby':
      return 'https://rabby.io';
    case 'metamask':
      return 'https://metamask.io/download/';
    case 'coinbase':
      return 'https://www.coinbase.com/wallet/downloads';
    default:
      return 'https://phantom.app/download';
  }
}
