import React, { useState } from 'react';
import { X, Check, Wallet, ArrowRight, ShieldCheck, ExternalLink, Download } from 'lucide-react';
import { truncateAddress } from '../utils/arc';

const WALLETS = [
  {
    id: 'rabby',
    name: 'Rabby Wallet',
    tag: 'RECOMMENDED FOR ARC',
    url: 'https://rabby.io',
    desc: 'Optimal support for multi-chain routing & sub-400ms Malachite BFT finality.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#8697FF" />
        <path d="M7 21.5C9 14.5 16 11 25 10.5C21.5 14 20 18.5 20.5 23.5C18.5 21 16 19.5 13.5 19.5C10.5 19.5 8.5 20.5 7 21.5Z" fill="white" />
      </svg>
    )
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    tag: 'POPULAR',
    url: 'https://metamask.io',
    desc: 'Connect using MetaMask browser extension or mobile app.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#F6851B" />
        <path d="M24.7 8.5L17.2 13.9L18.6 9.8L24.7 8.5Z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.5" />
        <path d="M7.3 8.5L14.7 13.9L13.4 9.8L7.3 8.5Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.5" />
        <path d="M22.8 20.3L20.8 23.3L24.4 24.3L25.4 20.4L22.8 20.3Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.5" />
        <path d="M6.6 20.4L7.6 24.3L11.2 23.3L9.2 20.3L6.6 20.4Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.5" />
        <path d="M11 16.5L9.6 18.4L13.6 18.6L13.5 14.1L11 16.5Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.5" />
        <path d="M21 16.5L18.4 14.1L18.4 18.6L22.4 18.4L21 16.5Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.5" />
      </svg>
    )
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    tag: 'SMART WALLET',
    url: 'https://www.coinbase.com/wallet',
    desc: 'Passkey-ready with zero transaction gas sponsor on Arc.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#0052FF" />
        <circle cx="16" cy="16" r="8" fill="white" />
        <rect x="13.5" y="13.5" width="5" height="5" rx="1" fill="#0052FF" />
      </svg>
    )
  },
  {
    id: 'phantom',
    name: 'Phantom',
    tag: 'MULTI-CHAIN',
    url: 'https://phantom.app',
    desc: 'EVM & Solana multi-chain wallet with integrated token swap.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#AB9FF2" />
        <path d="M24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16Z" fill="white" />
        <circle cx="13.5" cy="15" r="1.5" fill="#AB9FF2" />
        <circle cx="18.5" cy="15" r="1.5" fill="#AB9FF2" />
      </svg>
    )
  }
];

export default function ConnectWalletModal({
  isOpen,
  onClose,
  user,
  wallet,
  onWalletConnected
}) {
  const [selectedWallet, setSelectedWallet] = useState('rabby');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [needsExtension, setNeedsExtension] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async (walletId) => {
    setIsConnecting(true);
    setError('');
    setNeedsExtension(false);

    // Check if user has an active EVM provider in browser
    if (typeof window === 'undefined' || !window.ethereum) {
      setNeedsExtension(true);
      setError('No Web3 wallet extension detected in your browser. Install Rabby Wallet or MetaMask below.');
      setIsConnecting(false);
      return;
    }

    try {
      // 1. Request account from browser extension
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || !accounts[0]) {
        throw new Error('No account selected in your Web3 wallet extension.');
      }
      const address = accounts[0];

      // 2. Request single-use cryptographic challenge nonce from ArcBounty server
      const nonceRes = await fetch(`http://localhost:4050/api/auth/wallet-nonce?address=${address}`);
      const challenge = await nonceRes.json();
      if (!challenge.success) {
        throw new Error(challenge.error || 'Failed to obtain cryptographic challenge from Arc server');
      }

      // 3. Request user's cryptographic personal_sign signature
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [challenge.message, address]
      });

      // 4. Verify signature on Arc server with viem
      const verifyRes = await fetch('http://localhost:4050/api/auth/wallet-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          signature,
          nonce: challenge.nonce
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Cryptographic signature verification rejected');
      }

      // 5. Connect and save to state
      onWalletConnected({
        connected: true,
        address: verifyData.user.address,
        balance: verifyData.user.balance || 1000,
        type: walletId
      }, verifyData.user, verifyData.token);

      onClose();
    } catch (err) {
      console.error('Wallet cryptographic connection error:', err);
      setError(err.message || 'Failed to cryptographically connect Web3 wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const selectedWalletObj = WALLETS.find((w) => w.id === selectedWallet) || WALLETS[0];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="clean-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '32px',
          borderRadius: '14px',
          border: '2.5px solid #000000',
          boxShadow: '6px 6px 0px #000000',
          background: '#ffffff',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#ffffff',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} color="#000000" />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              background: '#acc6e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Wallet size={20} color="#1b3158" />
          </div>
          <div>
            <h3 className="font-space" style={{ fontSize: '1.35rem', fontWeight: 900, color: '#000000', margin: 0 }}>
              {wallet && wallet.connected ? 'Switch Connected Wallet' : 'Connect Web3 Wallet'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Circle Arc L1 · Chain ID 5042 · SIWE Cryptographic Verification
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#4b5563', lineHeight: 1.45, marginBottom: '20px' }}>
          Connect your Web3 wallet via cryptographic personal_sign signature to lock bounty escrow as a sponsor or receive deterministic USDC payouts.
        </p>

        {error && (
          <div
            style={{
              background: '#fee2e2',
              border: '2px solid #000000',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '0.82rem',
              color: '#991b1b',
              fontWeight: 700,
              marginBottom: '16px'
            }}
          >
            {error}
          </div>
        )}

        {/* If extension is missing, offer direct install links */}
        {needsExtension && (
          <div
            style={{
              background: '#f8fafc',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '16px'
            }}
          >
            <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>
              Install a verified Web3 wallet extension:
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="https://rabby.io"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem', justifyContent: 'center', textDecoration: 'none' }}
              >
                <Download size={14} />
                <span>Install Rabby</span>
              </a>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem', justifyContent: 'center', textDecoration: 'none' }}
              >
                <Download size={14} />
                <span>Install MetaMask</span>
              </a>
            </div>
          </div>
        )}

        {/* Wallet Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {WALLETS.map((w) => {
            const isSelected = selectedWallet === w.id;
            const isCurrentlyActive = wallet && wallet.connected && wallet.type === w.id;

            return (
              <div
                key={w.id}
                onClick={() => {
                  setSelectedWallet(w.id);
                  setError('');
                  setNeedsExtension(false);
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: isSelected ? '2.5px solid #000000' : '2px solid #e2e8f0',
                  boxShadow: isSelected ? '3px 3px 0px #000000' : 'none',
                  background: isSelected ? '#fffae6' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {w.icon}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                        {w.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: w.id === 'rabby' ? '#ffcc6f' : '#f1f5f9',
                          color: '#000000',
                          border: '1px solid #000000'
                        }}
                      >
                        {w.tag}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                      {w.desc}
                    </p>
                  </div>
                </div>

                {isCurrentlyActive ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 800 }}>
                    <Check size={14} strokeWidth={3} />
                    <span>CONNECTED</span>
                  </span>
                ) : (
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isSelected ? '5px solid #1b3158' : '2px solid #cbd5e1',
                      background: '#ffffff'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Connect Action Button */}
        <button
          type="button"
          disabled={isConnecting}
          onClick={() => handleConnect(selectedWallet)}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '0.92rem',
            justifyContent: 'center',
            cursor: isConnecting ? 'wait' : 'pointer'
          }}
        >
          <span>{isConnecting ? 'Verifying Cryptographic Signature...' : `Sign In with ${selectedWalletObj.name}`}</span>
          <ArrowRight size={16} />
        </button>

        {/* Security / Network info footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.72rem', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#16a34a" />
            <span>Cryptographically verified via EIP-4361</span>
          </div>
          <a
            href="https://arc.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2f578c', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            <span>Arc Network Specs</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
