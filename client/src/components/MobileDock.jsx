import React from 'react';
import { Compass, Sparkles, Plus, Trophy, Wallet } from 'lucide-react';

export default function MobileDock({
  activeTab,
  setActiveTab,
  openCreateModal,
  openWalletModal,
  wallet
}) {
  return (
    <nav className="mobile-dock">
      {/* 1. Explore */}
      <button
        id="mobile-dock-explore-btn"
        onClick={() => setActiveTab('explore')}
        style={{
          background: 'transparent',
          border: 'none',
          color: activeTab === 'explore' ? '#000000' : '#6b7280',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.7rem',
          fontWeight: 900,
          cursor: 'pointer',
          flex: 1
        }}
      >
        <Compass size={22} color={activeTab === 'explore' ? '#000000' : '#6b7280'} strokeWidth={activeTab === 'explore' ? 3 : 2} />
        <span style={{ borderBottom: activeTab === 'explore' ? '2px solid #000' : 'none' }}>EXPLORE</span>
      </button>

      {/* 2. Leaderboard */}
      <button
        id="mobile-dock-tasks-btn"
        onClick={() => setActiveTab('leaderboard')}
        style={{
          background: 'transparent',
          border: 'none',
          color: activeTab === 'leaderboard' ? '#000000' : '#6b7280',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.7rem',
          fontWeight: 900,
          cursor: 'pointer',
          flex: 1
        }}
      >
        <Sparkles size={22} color={activeTab === 'leaderboard' ? '#000000' : '#6b7280'} strokeWidth={activeTab === 'leaderboard' ? 3 : 2} />
        <span style={{ borderBottom: activeTab === 'leaderboard' ? '2px solid #000' : 'none' }}>RANKS</span>
      </button>

      {/* 3. Center Action: Post Bounty */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <button
          id="mobile-dock-create-btn"
          onClick={openCreateModal}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'var(--arc-token-sand)',
            border: '3px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            marginTop: '-22px',
            cursor: 'pointer'
          }}
          title="Post a creator bounty"
        >
          <Plus size={28} strokeWidth={3.5} />
        </button>
      </div>

      {/* 4. Leaderboard */}
      <button
        id="mobile-dock-leaderboard-btn"
        onClick={() => setActiveTab('leaderboard')}
        style={{
          background: 'transparent',
          border: 'none',
          color: activeTab === 'leaderboard' ? '#000000' : '#6b7280',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.7rem',
          fontWeight: 900,
          cursor: 'pointer',
          flex: 1
        }}
      >
        <Trophy size={22} color={activeTab === 'leaderboard' ? '#000000' : '#6b7280'} strokeWidth={activeTab === 'leaderboard' ? 3 : 2} />
        <span style={{ borderBottom: activeTab === 'leaderboard' ? '2px solid #000' : 'none' }}>LEADERS</span>
      </button>

      {/* 5. Wallet */}
      <button
        id="mobile-dock-wallet-btn"
        onClick={openWalletModal}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.7rem',
          fontWeight: 900,
          cursor: 'pointer',
          flex: 1
        }}
      >
        <Wallet size={22} color={wallet.connected ? 'var(--arc-validator-blue)' : '#000000'} strokeWidth={2.5} />
        <span>WALLET</span>
      </button>
    </nav>
  );
}
