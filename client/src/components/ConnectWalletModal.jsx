import React, { useState, useEffect } from 'react';
import { X, Check, Wallet, ArrowRight, ShieldCheck, ExternalLink, Download, AlertCircle } from 'lucide-react';
import { truncateAddress } from '../utils/arc';
import {
  initWalletDetection,
  subscribeWalletDetection,
  getDetectedWallets,
  getWalletProvider,
  getWalletDownloadUrl,
  isWalletInstalled
} from '../utils/wallet';
import { API_BASE } from '../utils/api';

const WALLETS = [
  {
    id: 'phantom',
    name: 'Phantom',
    url: 'https://phantom.app/download',
    desc: 'EVM & Solana multi-chain wallet with built-in Ethereum provider.',
    icon: (
      <img
        src="/wallets/phantom.svg"
        alt="Phantom"
        width="32"
        height="32"
        style={{ width: '32px', height: '32px', borderRadius: '7px', objectFit: 'contain', flexShrink: 0 }}
      />
    )
  },
  {
    id: 'rabby',
    name: 'Rabby Wallet',
    url: 'https://rabby.io',
    desc: 'Optimal support for multi-chain routing & sub-400ms Malachite BFT finality.',
    icon: (
      <img
        src="/wallets/rabby.svg"
        alt="Rabby Wallet"
        width="32"
        height="32"
        style={{ width: '32px', height: '32px', borderRadius: '7px', objectFit: 'contain', flexShrink: 0 }}
      />
    )
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    url: 'https://metamask.io/download/',
    desc: 'Connect using MetaMask browser extension or mobile app.',
    icon: (
      <img
        src="/wallets/metamask.svg"
        alt="MetaMask"
        width="32"
        height="32"
        style={{ width: '32px', height: '32px', borderRadius: '7px', objectFit: 'contain', flexShrink: 0 }}
      />
    )
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    url: 'https://www.coinbase.com/wallet/downloads',
    desc: 'Passkey-ready with zero transaction gas sponsor on Arc.',
    icon: (
      <img
        src="/wallets/coinbase.svg"
        alt="Coinbase Wallet"
        width="32"
        height="32"
        style={{ width: '32px', height: '32px', borderRadius: '7px', objectFit: 'contain', flexShrink: 0 }}
      />
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
  const [selectedWallet, setSelectedWallet] = useState('phantom');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [detectedWallets, setDetectedWallets] = useState(getDetectedWallets());

  // Subscribe to EIP-6963 provider announcements & window provider detection
  useEffect(() => {
    if (!isOpen) return;
    initWalletDetection();

    const updateDetection = () => {
      const detected = getDetectedWallets();
      setDetectedWallets(detected);
    };

    updateDetection();
    const unsubscribe = subscribeWalletDetection(updateDetection);

    // Continuous check every 800ms for dynamically injected extensions
    const interval = setInterval(updateDetection, 800);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isOpen]);

  // If a wallet is installed, auto-select it if current selected is not installed
  useEffect(() => {
    if (!isOpen) return;
    if (detectedWallets.phantom && !isWalletInstalled(selectedWallet)) {
      setSelectedWallet('phantom');
    } else if (detectedWallets.rabby && !isWalletInstalled(selectedWallet)) {
      setSelectedWallet('rabby');
    } else if (detectedWallets.metamask && !isWalletInstalled(selectedWallet)) {
      setSelectedWallet('metamask');
    } else if (detectedWallets.coinbase && !isWalletInstalled(selectedWallet)) {
      setSelectedWallet('coinbase');
    }
  }, [detectedWallets, isOpen]);

  if (!isOpen) return null;

  const handleConnect = async (walletId) => {
    setIsConnecting(true);
    setError('');

    const targetWalletObj = WALLETS.find((w) => w.id === walletId) || WALLETS[0];
    const provider = getWalletProvider(walletId);

    // Check if target provider is available
    if (!provider) {
      setError(
        `${targetWalletObj.name} extension was not detected or is not active in this browser. Please make sure the ${targetWalletObj.name} extension is enabled, or click "Install ${targetWalletObj.name}" below.`
      );
      setIsConnecting(false);
      return;
    }

    try {
      // 1. Request account from browser extension
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (!accounts || !accounts[0]) {
        throw new Error(`No account authorized in your ${targetWalletObj.name} extension. Please unlock your wallet and approve the connection.`);
      }
      const address = accounts[0];

      // 2. Request single-use cryptographic challenge nonce from ArcBounty server
      const nonceRes = await fetch(`${API_BASE}/api/auth/wallet-nonce?address=${address}`);
      const challenge = await nonceRes.json();
      if (!challenge.success) {
        throw new Error(challenge.error || 'Failed to obtain cryptographic challenge from Arc server');
      }

      // 3. Request user's cryptographic personal_sign signature via the selected provider
      const signature = await provider.request({
        method: 'personal_sign',
        params: [challenge.message, address]
      });

      // 4. Verify signature on Arc server with viem
      const sessionToken = localStorage.getItem('arcbounty_session_token');
      const verifyRes = await fetch(`${API_BASE}/api/auth/wallet-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({
          address,
          signature,
          nonce: challenge.nonce,
          userId: user?.id || null
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
      if (err.code === 4001 || err.message?.toLowerCase().includes('reject') || err.message?.toLowerCase().includes('denied')) {
        setError(`Connection request was cancelled in ${targetWalletObj.name}.`);
      } else {
        setError(err.message || `Failed to connect with ${targetWalletObj.name}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const selectedWalletObj = WALLETS.find((w) => w.id === selectedWallet) || WALLETS[0];
  const isSelectedWalletInstalled = isWalletInstalled(selectedWallet);

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
          </div>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#4b5563', lineHeight: 1.45, marginBottom: '16px' }}>
          Connect your Web3 browser extension via cryptographic personal_sign signature to receive deterministic USDC payouts on Circle Arc L1.
        </p>


        {error && (
          <div
            style={{
              background: '#fee2e2',
              border: '2px solid #000000',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '0.82rem',
              color: '#991b1b',
              fontWeight: 700,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} color="#991b1b" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        {/* Wallet Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {WALLETS.map((w) => {
            const isSelected = selectedWallet === w.id;
            const isCurrentlyActive = wallet && wallet.connected && wallet.type === w.id;
            const isInstalled = isWalletInstalled(w.id);

            return (
              <div
                key={w.id}
                onClick={() => {
                  setSelectedWallet(w.id);
                  setError('');
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
                      {isInstalled ? (
                        <span style={{
                          background: '#dcfce7',
                          color: '#166534',
                          border: '1.5px solid #16a34a',
                          borderRadius: '4px',
                          padding: '1px 6px',
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a' }} />
                          <span>Detected</span>
                        </span>
                      ) : (
                        <span style={{
                          background: '#f1f5f9',
                          color: '#64748b',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          padding: '1px 6px',
                          fontSize: '0.68rem',
                          fontWeight: 700
                        }}>
                          Not Installed
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0 0' }}>
                      {w.desc}
                    </p>
                  </div>
                </div>

                {isCurrentlyActive ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
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
                      background: '#ffffff',
                      flexShrink: 0
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        {isSelectedWalletInstalled ? (
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
            <span>{isConnecting ? 'Verifying Cryptographic Signature...' : `Connect with ${selectedWalletObj.name}`}</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href={getWalletDownloadUrl(selectedWallet)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.92rem',
                justifyContent: 'center',
                textDecoration: 'none',
                background: 'var(--arc-validator-blue)'
              }}
            >
              <Download size={16} />
              <span>Download & Install {selectedWalletObj.name} Extension</span>
              <ExternalLink size={14} />
            </a>

            {detectedWallets.any && (
              <button
                type="button"
                disabled={isConnecting}
                onClick={() => {
                  const fallbackId = detectedWallets.phantom ? 'phantom' : (detectedWallets.rabby ? 'rabby' : (detectedWallets.metamask ? 'metamask' : 'coinbase'));
                  handleConnect(fallbackId);
                }}
                className="btn-secondary"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '0.86rem',
                  justifyContent: 'center',
                  cursor: isConnecting ? 'wait' : 'pointer'
                }}
              >
                <span>Connect via Detected Wallet</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        )}

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
