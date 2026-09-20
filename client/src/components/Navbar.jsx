import React from 'react';
import { ShieldCheck, Zap, Wallet, Cpu, ExternalLink, RefreshCw } from 'lucide-react';
import { truncateAddress } from '../utils/arc';

export default function Navbar({
  network,
  setNetwork,
  wallet,
  openWalletModal,
  activeTab,
  setActiveTab,
  openCreateModal
}) {
  return (
    <header className="glass-panel-dark" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      height: '72px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('explore')}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #c1ff72 0%, #00f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(193, 255, 114, 0.35)'
          }}>
            <ShieldCheck size={22} color="#090d14" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-space" style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff' }}>
              Arc<span style={{ color: '#c1ff72' }}>Bounty</span>
            </span>
            <div style={{ fontSize: '0.68rem', color: '#9ca3af', fontFamily: 'Geist Mono, monospace', marginTop: '-3px' }}>
              Circle Arc L1 · Chain 5042
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontFamily: 'Geist, sans-serif',
          fontSize: '0.9rem',
          fontWeight: 500
        }} className="desktop-nav">
          <button
            id="nav-explore-btn"
            onClick={() => setActiveTab('explore')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'explore' ? '#c1ff72' : '#9ca3af',
              cursor: 'pointer',
              padding: '6px 10px',
              borderBottom: activeTab === 'explore' ? '2px solid #c1ff72' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            Bounty Explorer
          </button>
          <button
            id="nav-swarm-btn"
            onClick={() => setActiveTab('swarm')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'swarm' ? '#c1ff72' : '#9ca3af',
              cursor: 'pointer',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderBottom: activeTab === 'swarm' ? '2px solid #c1ff72' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <Cpu size={15} color={activeTab === 'swarm' ? '#c1ff72' : '#9ca3af'} />
            AI Agent Swarm
            <span style={{
              fontSize: '0.65rem',
              padding: '1px 6px',
              borderRadius: '999px',
              background: 'rgba(193, 255, 114, 0.15)',
              color: '#c1ff72',
              fontWeight: 600
            }}>Live</span>
          </button>
          <button
            id="nav-leaderboard-btn"
            onClick={() => setActiveTab('leaderboard')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'leaderboard' ? '#c1ff72' : '#9ca3af',
              cursor: 'pointer',
              padding: '6px 10px',
              borderBottom: activeTab === 'leaderboard' ? '2px solid #c1ff72' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            Leaderboard
          </button>
        </nav>

        {/* Right Actions: Network badge + Post Bounty CTA + Wallet Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Arc Network Status Chip */}
          <div
            onClick={openWalletModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
            title="Circle Arc L1 Network Status"
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} className="animate-pulse" />
            <span style={{ color: '#e5e7eb', fontWeight: 500 }} className="desktop-only">
              {network.name}
            </span>
            <span style={{ color: '#00f2fe', fontFamily: 'Geist Mono, monospace', fontSize: '0.72rem' }}>
              382ms
            </span>
          </div>

          {/* Post Bounty Button (Desktop) */}
          <button
            id="header-post-bounty-btn"
            onClick={openCreateModal}
            className="glass-button desktop-only"
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              color: '#090d14',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#c1ff72'
            }}
          >
            <span>+ Post Bounty</span>
            <div className="button-shine" />
          </button>

          {/* Wallet Button */}
          <button
            id="header-wallet-btn"
            onClick={openWalletModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Wallet size={16} color="#c1ff72" />
            <span>
              {wallet.connected ? truncateAddress(wallet.address) : 'Connect Wallet'}
            </span>
            {wallet.connected && (
              <span style={{
                color: '#c1ff72',
                fontFamily: 'Geist Mono, monospace',
                fontSize: '0.78rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
                paddingLeft: '6px'
              }}>
                ${wallet.balance.toLocaleString()} USDC
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
