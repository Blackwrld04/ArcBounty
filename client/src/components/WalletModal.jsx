import React from 'react';
import { X, Wallet, ShieldCheck, Zap, Plus, ExternalLink, CheckCircle } from 'lucide-react';
import { ARC_MAINNET, ARC_TESTNET, truncateAddress } from '../utils/arc';

export default function WalletModal({
  isOpen,
  onClose,
  wallet,
  setWallet,
  network,
  setNetwork
}) {
  if (!isOpen) return null;

  const handleConnectBrowserWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setWallet({
            connected: true,
            address: accounts[0],
            balance: 5400,
            type: 'browser',
          });
          onClose();
        }
      } catch (err) {
        console.warn('Wallet connection dismissed, defaulting to simulation wallet');
      }
    } else {
      // If no browser wallet installed, connect rich Arc simulated wallet
      setWallet({
        connected: true,
        address: '0x461cd48D95993242bB04774cc68042795586BbAd',
        balance: 10000,
        type: 'simulated',
      });
      onClose();
    }
  };

  const handleAddFaucetFunds = () => {
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + 1000
    }));
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel-dark animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          padding: '28px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-wallet-modal-btn"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#9ca3af',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Wallet size={20} color="#c1ff72" />
          <h3 className="font-space" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
            Arc Wallet & Network
          </h3>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '22px' }}>
          Connect an EVM wallet or switch between Circle Arc Mainnet and Testnet.
        </p>

        {/* Network Selector */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Active Blockchain Network
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={() => setNetwork(ARC_MAINNET)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'left',
                background: network.id === 5042 ? 'rgba(193, 255, 114, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                border: network.id === 5042 ? '1px solid #c1ff72' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.88rem' }}>Arc Mainnet</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>Chain ID: 5042</p>
            </button>

            <button
              onClick={() => setNetwork(ARC_TESTNET)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'left',
                background: network.id === 5042002 ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                border: network.id === 5042002 ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f2fe' }} />
                <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.88rem' }}>Arc Testnet</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>Chain ID: 5042002</p>
            </button>
          </div>
        </div>

        {/* Current Wallet State */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '18px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Connected Account</span>
            <span style={{
              fontSize: '0.72rem',
              color: '#c1ff72',
              background: 'rgba(193, 255, 114, 0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: 'Geist Mono, monospace'
            }}>
              {wallet.type === 'browser' ? 'MetaMask / Rabby' : 'Simulated Session'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <p className="font-space" style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff' }}>
                ${wallet.balance.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#c1ff72' }}>USDC</span>
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'Geist Mono, monospace', marginTop: '2px' }}>
                {wallet.address}
              </p>
            </div>

            <button
              onClick={handleAddFaucetFunds}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(193, 255, 114, 0.15)',
                border: '1px solid rgba(193, 255, 114, 0.3)',
                color: '#c1ff72',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Add 1,000 simulated USDC for testing"
            >
              <Plus size={14} />
              <span>Faucet +$1k</span>
            </button>
          </div>
        </div>

        {/* Connect Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            id="connect-browser-wallet-btn"
            onClick={handleConnectBrowserWallet}
            className="glass-button"
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: '#c1ff72',
              color: '#090d14',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Zap size={16} />
            <span>Connect Web3 Wallet (MetaMask / Rabby)</span>
            <div className="button-shine" />
          </button>

          <button
            onClick={() => {
              setWallet({
                connected: true,
                address: '0x461cd48D95993242bB04774cc68042795586BbAd',
                balance: 10000,
                type: 'simulated',
              });
              onClose();
            }}
            style={{
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#d1d5db',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Use Demo Simulated Wallet ($10,000 USDC)
          </button>
        </div>
      </div>
    </div>
  );
}
