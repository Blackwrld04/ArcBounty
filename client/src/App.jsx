import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MetricsStrip from './components/MetricsStrip';
import BountyList from './components/BountyList';
import BountyDetailModal from './components/BountyDetailModal';
import CreateBountyModal from './components/CreateBountyModal';
import AgentSwarmPortal from './components/AgentSwarmPortal';
import Leaderboard from './components/Leaderboard';
import WalletModal from './components/WalletModal';
import MobileDock from './components/MobileDock';
import { INITIAL_BOUNTIES } from './data/initialBounties';
import { ARC_MAINNET, ARC_TESTNET } from './utils/arc';
import { Zap, ExternalLink, CheckCircle2, X } from 'lucide-react';

const API_BASE = 'http://localhost:4050/api';

export default function App() {
  const [network, setNetwork] = useState(ARC_MAINNET);
  const [wallet, setWallet] = useState({
    connected: true,
    address: '0x461cd48D95993242bB04774cc68042795586BbAd',
    balance: 10000,
    type: 'simulated'
  });

  const [bounties, setBounties] = useState(() => {
    const saved = localStorage.getItem('arcbounty_items_v2');
    return saved ? JSON.parse(saved) : INITIAL_BOUNTIES;
  });

  const [stats, setStats] = useState({
    tvlUsdc: 28450,
    totalSettledUsdc: 142800,
    avgSettlementTimeMs: 384,
    aiAgentClaimsPercent: 42
  });

  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'swarm' | 'leaderboard'
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', link = null) => {
    setToast({ message, type, link });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('arcbounty_items_v2', JSON.stringify(bounties));
  }, [bounties]);

  // Handle posting a new bounty
  const handleCreateBounty = async (newBountyData) => {
    const newBounty = {
      id: `bounty-arc-${Date.now().toString().slice(-4)}`,
      bountyId: `0x${Date.now().toString(16).padStart(64, '0')}`,
      ...newBountyData,
      status: 'Open',
      maintainerName: 'You (Sponsor)',
      solver: null,
      solverType: null,
      prUrl: null,
      createdAt: Date.now(),
      deadline: Date.now() + newBountyData.deadlineDays * 86400000,
    };

    setBounties([newBounty, ...bounties]);
    setWallet((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - newBountyData.amount)
    }));
    setIsCreateModalOpen(false);
    showToast(`BOUNTY POSTED! $${newBountyData.amount} USDC LOCKED INTO ARC ESCROW.`, 'success');
  };

  // Handle solver deliverable submission
  const handleSubmitSolution = async (bountyId, submissionUrl, solverAddress, solverType) => {
    setBounties((prev) =>
      prev.map((b) => {
        if (b.id === bountyId) {
          const updated = {
            ...b,
            status: 'InReview',
            solver: solverAddress || '0x71C568ba74d3B107292995bB791e317614399A45',
            solverType: solverType || 'Human Creator',
            prUrl: submissionUrl
          };
          setSelectedBounty(updated);
          return updated;
        }
        return b;
      })
    );
    showToast('WORK DELIVERABLE SUBMITTED! SPONSOR REVIEW INITIATED.', 'success');
  };

  // Handle maintainer approving release & executing settlement
  const handleReleaseBounty = async (bountyId) => {
    const mockTx = `0xarc${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}88ad`;

    setBounties((prev) =>
      prev.map((b) => {
        if (b.id === bountyId) {
          const updated = {
            ...b,
            status: 'Settled',
            settledAt: Date.now(),
            settlementTx: mockTx
          };
          setSelectedBounty(updated);
          return updated;
        }
        return b;
      })
    );

    showToast(`SETTLEMENT CONFIRMED ON ARC MAINNET IN 382MS! USDC PAID.`, 'success', `https://explorer.arc.io/tx/${mockTx}`);
  };

  const scrollToBounties = () => {
    setActiveTab('explore');
    const elem = document.getElementById('bounties-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mobile-safe-bottom" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Top Navigation Bar */}
      <Navbar
        network={network}
        setNetwork={setNetwork}
        wallet={wallet}
        openWalletModal={() => setIsWalletModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Content Areas based on Active Tab */}
      <main style={{ flex: 1 }}>
        {activeTab === 'explore' && (
          <>
            <Hero
              openCreateModal={() => setIsCreateModalOpen(true)}
              setActiveTab={setActiveTab}
              onExploreClick={scrollToBounties}
            />
            <MetricsStrip stats={stats} />
            <BountyList
              bounties={bounties}
              onSelectBounty={(bounty) => setSelectedBounty(bounty)}
              openCreateModal={() => setIsCreateModalOpen(true)}
            />
          </>
        )}

        {activeTab === 'swarm' && (
          <div style={{ paddingTop: '80px' }}>
            <AgentSwarmPortal />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div style={{ paddingTop: '80px' }}>
            <Leaderboard />
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      {selectedBounty && (
        <BountyDetailModal
          bounty={selectedBounty}
          onClose={() => setSelectedBounty(null)}
          onSubmitSolution={handleSubmitSolution}
          onReleaseBounty={handleReleaseBounty}
          wallet={wallet}
        />
      )}

      {isCreateModalOpen && (
        <CreateBountyModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreateBounty={handleCreateBounty}
          wallet={wallet}
        />
      )}

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        setWallet={setWallet}
        network={network}
        setNetwork={setNetwork}
      />

      {/* Persistent Mobile Bottom App Dock */}
      <MobileDock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCreateModal={() => setIsCreateModalOpen(true)}
        openWalletModal={() => setIsWalletModalOpen(true)}
        wallet={wallet}
      />

      {/* Neo-Brutalist Notification Toast */}
      {toast && (
        <div className="notification-toast">
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--c-lime)',
            border: '2px solid #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            flexShrink: 0
          }}>
            <CheckCircle2 size={18} strokeWidth={3} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 800, color: '#000000', fontSize: '0.88rem' }}>{toast.message}</p>
            {toast.link && (
              <a
                href={toast.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#000000', fontWeight: 800, textDecoration: 'underline', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}
              >
                <span>VIEW SETTLEMENT ON ARCSCAN</span>
                <ExternalLink size={12} strokeWidth={3} />
              </a>
            )}
          </div>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'transparent', border: 'none', color: '#000000', cursor: 'pointer' }}
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Neo-Brutalist Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '3px solid #000000',
        padding: '50px 0 30px 0',
        marginTop: '60px'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '30px',
            marginBottom: '40px'
          }}>
            <div style={{ maxWidth: '420px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  background: 'var(--c-lime)',
                  border: '3px solid #000',
                  boxShadow: '2px 2px 0px #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Zap size={22} color="#000000" strokeWidth={3} />
                </div>
                <span className="font-space" style={{ fontSize: '1.45rem', fontWeight: 900, color: '#000000' }}>
                  ARC<span style={{ background: 'var(--c-yellow)', padding: '0 4px', border: '2px solid #000', borderRadius: '4px', marginLeft: '2px' }}>BOUNTY</span>
                </span>
              </div>
              <p style={{ color: '#1f2937', fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.6 }}>
                The decentralized creator &amp; autonomous agent bounty engine natively built on Circle Arc L1 (Chain ID 5042). For designers, video creators, writers, meme strategists, and developers.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', fontSize: '0.9rem', fontWeight: 700 }}>
              <div>
                <p style={{ color: '#000000', fontWeight: 900, marginBottom: '12px', textTransform: 'uppercase' }}>CREATOR SECTORS</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#4b5563' }}>
                  <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('explore')}>🎨 Design &amp; 3D Art</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('explore')}>🎬 Video &amp; Reels</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('explore')}>✍️ Writing &amp; Research</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('explore')}>🐸 Memes &amp; Social</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('explore')}>💻 Code &amp; Apps</span>
                </div>
              </div>

              <div>
                <p style={{ color: '#000000', fontWeight: 900, marginBottom: '12px', textTransform: 'uppercase' }}>CIRCLE ARC L1</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#4b5563' }}>
                  <a href="https://explorer.arc.io" target="_blank" rel="noopener noreferrer" style={{ color: '#000000', textDecoration: 'underline' }}>
                    ArcScan Explorer (5042)
                  </a>
                  <a href="https://arc.io" target="_blank" rel="noopener noreferrer" style={{ color: '#000000', textDecoration: 'underline' }}>
                    Arc.io Documentation
                  </a>
                  <span>Canonical USDC: 0x3600...</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: '24px',
            borderTop: '2px solid #000000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#4b5563'
          }}>
            <p>© 2026 ArcBounty Protocol. All rights reserved. Circle Arc Mainnet (5042) · Malachite BFT Consensus.</p>
            <p>Native USDC Escrow · EIP-3009 Zero-Gas Settlements</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
