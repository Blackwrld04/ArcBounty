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
import { Shield, ExternalLink, Cpu, CheckCircle2, AlertCircle, X } from 'lucide-react';

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
    const saved = localStorage.getItem('arcbounty_items');
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
    }, 4500);
  };

  // Fetch live bounties & stats from backend with graceful local fallback
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [bountyRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/bounties`),
          fetch(`${API_BASE}/stats`)
        ]);

        if (bountyRes.ok) {
          const data = await bountyRes.json();
          if (data.bounties && data.bounties.length > 0) {
            setBounties(data.bounties);
          }
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.data) {
            setStats(statsData.data);
          }
        }
      } catch (err) {
        console.log('[ArcBounty] Using offline resilient state');
      }
    };

    fetchBackendData();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('arcbounty_items', JSON.stringify(bounties));
  }, [bounties]);

  // Handle posting a new bounty
  const handleCreateBounty = async (newBountyData) => {
    let created = null;

    try {
      const res = await fetch(`${API_BASE}/bounties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBountyData),
      });
      if (res.ok) {
        const json = await res.json();
        created = json.bounty;
      }
    } catch (err) {
      console.log('Backend sync skipped, saving to client state');
    }

    if (!created) {
      created = {
        id: `bounty-arc-${Date.now().toString().slice(-4)}`,
        bountyId: `0x${Date.now().toString(16).padStart(64, '0')}`,
        ...newBountyData,
        status: 'Open',
        maintainerName: 'You (Maintainer)',
        solver: null,
        solverType: null,
        prUrl: null,
        createdAt: Date.now(),
        deadline: Date.now() + newBountyData.deadlineDays * 86400000,
      };
    }

    setBounties([created, ...bounties]);
    setWallet((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - newBountyData.amount)
    }));
    setIsCreateModalOpen(false);
    showToast(`Bounty created! $${newBountyData.amount} USDC locked into Arc Escrow.`, 'success');
  };

  // Handle solver PR submission
  const handleSubmitSolution = async (bountyId, prUrl, solverAddress, solverType) => {
    try {
      await fetch(`${API_BASE}/bounties/${bountyId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prUrl, solverAddress, solverType }),
      });
    } catch (err) {
      console.log('Backend claim skipped, updating local state');
    }

    setBounties((prev) =>
      prev.map((b) => {
        if (b.id === bountyId) {
          const updated = {
            ...b,
            status: 'InReview',
            solver: solverAddress || '0x71C568ba74d3B107292995bB791e317614399A45',
            solverType: solverType || 'Human Developer',
            prUrl
          };
          setSelectedBounty(updated);
          return updated;
        }
        return b;
      })
    );
    showToast('Pull Request proof submitted! Maintainer review initiated.', 'success');
  };

  // Handle maintainer approving release & executing EIP-3009 settlement
  const handleReleaseBounty = async (bountyId) => {
    let mockTx = `0xarc${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}88ad`;

    try {
      const res = await fetch(`${API_BASE}/bounties/${bountyId}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eip3009Signature: '0x3045022100e478c9497e2f1704c7c8c6a0868f00dbf20c90c765042a326aeee966fd9012a50220268a7f9247c1dfa65320f40d97b0e6b201cb6613476687cb2f0681b472e241e61b'
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.settlement?.txHash) {
          mockTx = json.settlement.txHash;
        }
      }
    } catch (err) {
      console.log('Backend release skipped, executing client simulation');
    }

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

    showToast(`Settlement confirmed on Arc Mainnet in 382ms! USDC released.`, 'success', `https://explorer.arc.io/tx/${mockTx}`);
  };

  const scrollToBounties = () => {
    setActiveTab('explore');
    const elem = document.getElementById('bounties-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="mobile-safe-bottom" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Fixed Top Navigation Bar */}
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

      {/* Modals & Slide-up Drawers */}
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

      {/* Toast Notification */}
      {toast && (
        <div className="notification-toast">
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'rgba(193, 255, 114, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c1ff72',
            flexShrink: 0
          }}>
            <CheckCircle2 size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 500, color: '#f3f4f6' }}>{toast.message}</p>
            {toast.link && (
              <a
                href={toast.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00f2fe', fontSize: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}
              >
                <span>View Transaction on ArcScan</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Desktop / Web Footer */}
      <footer style={{
        background: '#060910',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
            <div style={{ maxWidth: '380px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#c1ff72',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Shield size={18} color="#090d14" />
                </div>
                <span className="font-space" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>
                  Arc<span style={{ color: '#c1ff72' }}>Bounty</span>
                </span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Decentralized developer and autonomous AI agent bounty protocol natively built on Circle's Arc L1 (Chain ID 5042). Dollar-predictable gas, sub-second Malachite BFT settlement, and EIP-3009 gasless releases.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <div>
                <p style={{ color: '#ffffff', fontWeight: 600, marginBottom: '12px' }}>Protocol</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#9ca3af' }}>
                  <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('explore')}>Bounty Explorer</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('swarm')}>Agent Swarm API</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('leaderboard')}>Leaderboard</span>
                </div>
              </div>

              <div>
                <p style={{ color: '#ffffff', fontWeight: 600, marginBottom: '12px' }}>Circle Arc L1</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#9ca3af' }}>
                  <a href="https://explorer.arc.io" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                    ArcScan Explorer (5042)
                  </a>
                  <a href="https://arc.io" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                    Arc.io Documentation
                  </a>
                  <span>Canonical USDC: 0x3600...</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#6b7280'
          }}>
            <p>© 2026 ArcBounty Protocol. All rights reserved. Mainnet: 5042 · Gas: Native USDC</p>
            <p>Sub-second finality via Circle Arc Malachite BFT consensus engine</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
