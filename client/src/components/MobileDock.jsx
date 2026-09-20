import React from 'react';
import { Compass, GitPullRequest, PlusCircle, Cpu, Wallet } from 'lucide-react';

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
          color: activeTab === 'explore' ? '#c1ff72' : '#9ca3af',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.68rem',
          fontWeight: 600,
          cursor: 'pointer',
          flex: 1
        }}
      >
        <Compass size={20} color={activeTab === 'explore' ? '#c1ff72' : '#9ca3af'} />
        <span>Explore</span>
      </button>

      {/* 2. Tasks / In Review */}
      <button
        id="mobile-dock-tasks-btn"
        onClick={() => setActiveTab('explore')}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.68rem',
          fontWeight: 500,
          cursor: 'pointer',
          flex: 1
        }}
      >
        <GitPullRequest size={20} color="#9ca3af" />
        <span>My Tasks</span>
      </button>

      {/* 3. Center Action: Post Bounty */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <button
          id="mobile-dock-create-btn"
          onClick={openCreateModal}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c1ff72 0%, #10b981 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#090d14',
            boxShadow: '0 0 16px rgba(193, 255, 114, 0.4)',
            marginTop: '-18px',
            cursor: 'pointer'
          }}
          title="Post a new bounty"
        >
          <PlusCircle size={26} strokeWidth={2.5} />
        </button>
      </div>

      {/* 4. AI Swarm */}
      <button
        id="mobile-dock-swarm-btn"
        onClick={() => setActiveTab('swarm')}
        style={{
          background: 'transparent',
          border: 'none',
          color: activeTab === 'swarm' ? '#c1ff72' : '#9ca3af',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.68rem',
          fontWeight: 600,
          cursor: 'pointer',
          flex: 1
        }}
      >
        <Cpu size={20} color={activeTab === 'swarm' ? '#c1ff72' : '#9ca3af'} />
        <span>AI Swarm</span>
      </button>

      {/* 5. Wallet */}
      <button
        id="mobile-dock-wallet-btn"
        onClick={openWalletModal}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.68rem',
          fontWeight: 500,
          cursor: 'pointer',
          flex: 1
        }}
      >
        <Wallet size={20} color={wallet.connected ? '#c1ff72' : '#9ca3af'} />
        <span>Wallet</span>
      </button>
    </nav>
  );
}
