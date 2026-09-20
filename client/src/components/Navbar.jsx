import React from 'react';
import { Zap, Wallet, Cpu, Plus, Sparkles, Layers } from 'lucide-react';
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
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: '#ffffff',
      borderBottom: '3px solid #000000',
      boxShadow: '0 4px 0px #000000',
      height: '74px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo with Arc.io Brand Colors */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => setActiveTab('explore')}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'var(--arc-validator-blue)',
            border: '3px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(-2deg)'
          }}>
            <Zap size={24} color="#ffffff" strokeWidth={3} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="font-space" style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--arc-protocol-navy)' }}>
                ARC<span style={{ background: 'var(--arc-token-sand)', color: '#000', padding: '0 4px', border: '2px solid #000', borderRadius: '4px', marginLeft: '2px' }}>BOUNTY</span>
              </span>
              <span className="sticker-tape desktop-only">ARC.IO NATIVE</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--arc-validator-blue)', fontFamily: 'Geist Mono, monospace', fontWeight: 700, marginTop: '-2px' }}>
              Circle Arc Platform · Chain 5042 · Canonical USDC
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: 800,
          fontSize: '0.9rem'
        }} className="desktop-nav">
          <button
            id="nav-explore-btn"
            onClick={() => setActiveTab('explore')}
            className={`brutal-btn ${activeTab === 'explore' ? 'brutal-btn-sky' : 'brutal-btn-white'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            ⚡ All Bounties
          </button>
          <button
            id="nav-swarm-btn"
            onClick={() => setActiveTab('swarm')}
            className={`brutal-btn ${activeTab === 'swarm' ? 'brutal-btn-gold' : 'brutal-btn-white'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Cpu size={16} strokeWidth={2.5} />
            AI &amp; Agent Swarms
          </button>
          <button
            id="nav-leaderboard-btn"
            onClick={() => setActiveTab('leaderboard')}
            className={`brutal-btn ${activeTab === 'leaderboard' ? 'brutal-btn-sand' : 'brutal-btn-white'}`}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            🏆 Leaderboard
          </button>
        </nav>

        {/* Right Actions: Network badge + Post Bounty CTA + Wallet Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Arc Network Status Chip */}
          <div
            onClick={openWalletModal}
            className="brutal-badge desktop-only"
            style={{
              background: '#ffffff',
              padding: '6px 12px',
              cursor: 'pointer'
            }}
            title="Circle Arc L1 Network Status"
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00e676',
              border: '1.5px solid #000'
            }} />
            <span style={{ color: 'var(--arc-protocol-navy)', fontWeight: 900 }}>
              {network.name}
            </span>
            <span style={{ color: '#000000', background: 'var(--arc-sky-sync)', padding: '1px 6px', borderRadius: '4px', border: '1px solid #000', fontSize: '0.7rem' }}>
              &lt;400ms
            </span>
          </div>

          {/* Post Bounty Button (Desktop) */}
          <button
            id="header-post-bounty-btn"
            onClick={openCreateModal}
            className="brutal-btn brutal-btn-gold desktop-only"
            style={{ padding: '9px 18px', fontSize: '0.85rem' }}
          >
            <Plus size={16} strokeWidth={3.5} />
            <span>Post Bounty</span>
          </button>

          {/* Wallet Button */}
          <button
            id="header-wallet-btn"
            onClick={openWalletModal}
            className="brutal-btn brutal-btn-sky"
            style={{ padding: '9px 16px', fontSize: '0.85rem' }}
          >
            <Wallet size={16} strokeWidth={2.5} />
            <span>
              {wallet.connected ? truncateAddress(wallet.address) : 'Connect Wallet'}
            </span>
            {wallet.connected && (
              <span style={{
                background: 'var(--arc-protocol-navy)',
                color: '#ffffff',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontFamily: 'Geist Mono, monospace'
              }}>
                ${wallet.balance.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
