import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BountyList from './components/BountyList';
import BountyDetailModal from './components/BountyDetailModal';
import CreateBountyModal from './components/CreateBountyModal';
import AuthModal from './components/AuthModal';
import WalletDrawer from './components/WalletDrawer';
import UserProfile from './components/UserProfile';
import AccountSettings from './components/AccountSettings';
import AgentSwarmPortal from './components/AgentSwarmPortal';
import Leaderboard from './components/Leaderboard';
import { INITIAL_BOUNTIES } from './data/initialBounties';
import { ARC_MAINNET, ARC_TESTNET } from './utils/arc';
import { Zap, CheckCircle2, ExternalLink, X } from 'lucide-react';

export default function App() {
  const [network, setNetwork] = useState(ARC_MAINNET);

  // Authenticated user state: default to null (Guest / new visitor mode)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('arcbounty_session_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [wallet, setWallet] = useState(() => {
    try {
      const savedUser = localStorage.getItem('arcbounty_session_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        return {
          connected: true,
          address: u.address || '0x461cd48D95993242bB04774cc68042795586BbAd',
          balance: u.balance || 10000,
          type: 'simulated'
        };
      }
    } catch (e) {}
    return {
      connected: false,
      address: null,
      balance: 0,
      type: null
    };
  });

  const [bounties, setBounties] = useState(() => {
    try {
      const saved = localStorage.getItem('arcbounty_items_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_BOUNTIES;
  });

  const [stats, setStats] = useState({
    tvlUsdc: 28450,
    totalSettledUsdc: 142800,
    avgSettlementTimeMs: 384,
    activeBountiesCount: 164
  });

  // Active views: 'explore', 'profile', 'account', 'account-referrals', 'swarm', 'leaderboard'
  const [activeView, setActiveView] = useState('explore');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [walletDrawerOpen, setWalletDrawerOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', link = null) => {
    setToast({ message, type, link });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('arcbounty_items_v4', JSON.stringify(bounties));
  }, [bounties]);

  // Handle posting a new bounty
  const handleCreateBounty = async (newBountyData) => {
    const newBounty = {
      id: `bounty-arc-${Date.now().toString().slice(-4)}`,
      bountyId: `0x${Date.now().toString(16).padStart(64, '0')}`,
      ...newBountyData,
      status: 'Open',
      maintainerName: user?.name || 'Circle Creative Guild',
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
    setCreateModalOpen(false);
    showToast(`Bounty created! $${newBountyData.amount.toLocaleString()} USDC locked in Circle Arc Escrow.`);
  };

  // Handle solver deliverable submission
  const handleSubmitSolution = async (bountyId, submissionUrl, solverAddress, solverType) => {
    setBounties((prev) =>
      prev.map((b) => {
        if (b.id === bountyId) {
          const updated = {
            ...b,
            status: 'InReview',
            solver: solverAddress || user?.address || '0x461cd48D95993242bB04774cc68042795586BbAd',
            solverType: solverType || 'Human Creator',
            prUrl: submissionUrl
          };
          setSelectedBounty(updated);
          return updated;
        }
        return b;
      })
    );
    showToast('Work submitted! Sponsor review initiated on Arc.');
  };

  // Handle sponsor approving release & executing settlement
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

    showToast(`Settlement confirmed on Arc Mainnet in 382ms! USDC disbursed.`, 'success', `https://explorer.arc.io/tx/${mockTx}`);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setWallet({
      connected: true,
      address: userData.address || '0x461cd48D95993242bB04774cc68042795586BbAd',
      balance: userData.balance || 10000,
      type: userData.type || 'simulated'
    });
    try {
      localStorage.setItem('arcbounty_session_user', JSON.stringify(userData));
    } catch (e) {}
    showToast(`Welcome, ${userData.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setWallet({
      connected: false,
      address: null,
      balance: 0,
      type: null
    });
    try {
      localStorage.removeItem('arcbounty_session_user');
    } catch (e) {}
    setActiveView('explore');
    showToast('Logged out successfully.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Modern Top Navigation Bar */}
      <Navbar
        user={user}
        wallet={wallet}
        network={network}
        activeView={activeView}
        setActiveView={setActiveView}
        openAuthModal={handleOpenAuth}
        openWalletDrawer={() => setWalletDrawerOpen(true)}
        openCreateModal={() => {
          if (!user) {
            handleOpenAuth('signup');
          } else {
            setCreateModalOpen(true);
          }
        }}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Controller */}
      <main style={{ flex: 1 }}>
        {activeView === 'explore' && (
          <>
            <Hero
              openCreateModal={() => {
                if (!user) handleOpenAuth('signup');
                else setCreateModalOpen(true);
              }}
              onExploreClick={() => {
                const el = document.getElementById('bounties-feed');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              openAuthModal={handleOpenAuth}
              user={user}
              stats={stats}
            />

            <div id="bounties-feed">
              <BountyList
                bounties={bounties}
                onSelectBounty={(bounty) => setSelectedBounty(bounty)}
                stats={stats}
                openCreateModal={() => {
                  if (!user) handleOpenAuth('signup');
                  else setCreateModalOpen(true);
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setActiveTab={setActiveView}
              />
            </div>
          </>
        )}

        {activeView === 'profile' && user && (
          <UserProfile
            user={user}
            wallet={wallet}
            bounties={bounties}
            onBackToFeed={() => setActiveView('explore')}
            onSelectBounty={(bounty) => setSelectedBounty(bounty)}
          />
        )}

        {(activeView === 'account' || activeView === 'account-referrals') && user && (
          <AccountSettings
            user={user}
            wallet={wallet}
            setWallet={setWallet}
            initialTab={activeView === 'account-referrals' ? 'referrals' : 'account'}
            onBackToFeed={() => setActiveView('explore')}
          />
        )}

        {activeView === 'swarm' && (
          <div style={{ paddingTop: '20px' }}>
            <AgentSwarmPortal />
          </div>
        )}

        {activeView === 'leaderboard' && (
          <div style={{ paddingTop: '20px' }}>
            <Leaderboard />
          </div>
        )}
      </main>

      {/* Modern Slide-out Wallet Drawer */}
      <WalletDrawer
        isOpen={walletDrawerOpen}
        onClose={() => setWalletDrawerOpen(false)}
        wallet={wallet}
        setWallet={setWallet}
        network={network}
      />

      {/* Split Login & Sign Up Modal (Gibwork style) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Stepped Create Bounty Modal */}
      <CreateBountyModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateBounty={handleCreateBounty}
        wallet={wallet}
        user={user}
      />

      {/* Bounty Detail & Deliverable Submission Modal */}
      {selectedBounty && (
        <BountyDetailModal
          bounty={selectedBounty}
          onClose={() => setSelectedBounty(null)}
          onSubmitSolution={handleSubmitSolution}
          onReleaseBounty={handleReleaseBounty}
          wallet={wallet}
          user={user}
          openAuthModal={handleOpenAuth}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10000,
          background: '#0f172a',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toast.message}</span>
          {toast.link && (
            <a
              href={toast.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--arc-sky-sync)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <span>View ArcScan</span>
              <ExternalLink size={12} />
            </a>
          )}
          <button
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: '6px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Clean Footer (Inspired by Gibwork & Superteam) */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '40px 0',
        marginTop: '60px'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-space" style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--arc-protocol-navy)' }}>
              Arc<span style={{ color: 'var(--arc-blockstream-gold)' }}>Bounty</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '6px' }}>
              Built for Circle Arc L1 (Chain ID 5042)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
            <button onClick={() => setActiveView('explore')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              Bounties
            </button>
            <button onClick={() => setActiveView('swarm')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              AI Swarms
            </button>
            <button onClick={() => setActiveView('leaderboard')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              Leaderboard
            </button>
            <a href="https://arc.io" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              Arc Docs ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
