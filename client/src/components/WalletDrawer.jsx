import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ArrowUpRight, Plus, RefreshCw, Zap, Shield } from 'lucide-react';
import { truncateAddress } from '../utils/arc';

export default function WalletDrawer({ isOpen, onClose, wallet, setWallet, network }) {
  const [copied, setCopied] = useState(false);
  const [isFauceting, setIsFauceting] = useState(false);

  if (!isOpen) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddFunds = () => {
    setIsFauceting(true);
    setTimeout(() => {
      setWallet(prev => ({
        ...prev,
        balance: prev.balance + 1000
      }));
      setIsFauceting(false);
    }, 400);
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{
          padding: '22px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 className="font-space" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Primary Creator Wallet
              </h3>
              <button
                onClick={copyAddress}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                <span>{truncateAddress(wallet.address)}</span>
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
              Native Circle Arc L1 (Chain ID 5042). Instant USDC payouts from completed bounties land here.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              marginLeft: '12px'
            }}
          >
            <X size={18} color="#64748b" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Main Balance Box */}
          <div style={{
            background: 'linear-gradient(135deg, #1b3158 0%, #2f578c 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 20px -5px rgba(27, 49, 88, 0.25)',
            marginBottom: '26px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.85 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                AVAILABLE ESCROW BALANCE
              </span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>
                {network.name}
              </span>
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="font-space" style={{ fontSize: '2.6rem', fontWeight: 900, lineHeight: 1 }}>
                ${wallet.balance.toLocaleString()}
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, opacity: 0.9 }}>USDC</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleAddFunds}
                disabled={isFauceting}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'var(--arc-blockstream-gold)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                <span>{isFauceting ? 'Minting...' : '+$1k Test Faucet'}</span>
              </button>

              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onClick={() => alert('Withdrawal request initialized on Arc Mainnet.')}
              >
                <span>Withdraw</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* Assets Section */}
          <div style={{ marginBottom: '26px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
              Holdings &amp; Tokens
            </h4>

            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#2775ca',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem'
                }}>
                  $
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>Circle USDC</span>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', background: '#dcfce7', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>CANONICAL</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'Geist Mono, monospace' }}>
                    0x3600...0000
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', margin: 0 }}>
                  ${wallet.balance.toLocaleString()}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>1.00 USD</p>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                Recent Escrow Activity
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--arc-validator-blue)', fontWeight: 600 }}>
                &lt;400ms BFT Finality
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { title: 'Bounty Release: 3D Mascot Design', amount: '+$1,200 USDC', time: '1 hour ago', tx: '0xarc5042...88ad', type: 'incoming' },
                { title: 'USDC Escrow Lock (Sponsor)', amount: '-$1,500 USDC', time: 'Yesterday', tx: '0xarc5042...b39c', type: 'outgoing' },
                { title: 'Faucet Test Funds Claim', amount: '+$1,000 USDC', time: '2 days ago', tx: '0xarc5042...cc12', type: 'incoming' }
              ].map((act, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                      {act.title}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0, fontFamily: 'Geist Mono, monospace' }}>
                      {act.time} · {act.tx}
                    </p>
                  </div>

                  <span style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: act.type === 'incoming' ? '#16a34a' : '#0f172a'
                  }}>
                    {act.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <span>Circle Arc Malachite BFT</span>
          <a
            href="https://explorer.arc.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--arc-validator-blue)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            <span>View on ArcScan</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
