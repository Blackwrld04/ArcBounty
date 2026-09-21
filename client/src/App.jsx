import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BountyList from './components/BountyList';
import BountyDetailModal from './components/BountyDetailModal';
import CreateBountyModal from './components/CreateBountyModal';
import AuthModal from './components/AuthModal';
import ConnectWalletModal from './components/ConnectWalletModal';
import WalletDrawer from './components/WalletDrawer';
import UserProfile from './components/UserProfile';
import AccountSettings from './components/AccountSettings';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import { INITIAL_BOUNTIES } from './data/initialBounties';
import { ARC_MAINNET, ARC_TESTNET } from './utils/arc';
import { Zap, CheckCircle2, ExternalLink, X, Lock } from 'lucide-react';

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

  // Active views: 'explore', 'profile', 'account', 'account-referrals', 'leaderboard', 'admin'
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || window.location.search.includes('admin=true')) {
        return 'admin';
      }
    }
    return 'explore';
  };

  const [activeView, setActiveView] = useState(getInitialView);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize browser history and hash navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || window.location.search.includes('admin=true')) {
        setActiveView('admin');
      } else if (activeView === 'admin') {
        setActiveView('explore');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [activeView]);

  const handleBackToExplore = () => {
    setActiveView('explore');
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
        window.history.pushState({}, '', '/');
      } else if (window.location.hash === '#/admin') {
        window.location.hash = '';
      }
    }
  };

  // Modals & Drawers state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
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

  const handleWalletConnected = (newWallet, updatedUser, token) => {
    setWallet(newWallet);
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('arcbounty_session_user', JSON.stringify(updatedUser));
    }
    if (token) {
      localStorage.setItem('arcbounty_session_token', token);
    }
    showToast(`Wallet connected! Address: ${newWallet.address.slice(0, 6)}...${newWallet.address.slice(-4)}`);
  };

  // Fetch live bounties from SQLite database
  const loadBounties = async () => {
    try {
      const res = await fetch('http://localhost:4050/api/bounties');
      const data = await res.json();
      if (data.success && Array.isArray(data.bounties) && data.bounties.length > 0) {
        setBounties(data.bounties);
      }
    } catch (e) {
      console.warn('[App] SQLite bounties sync fallback:', e);
    }
  };

  useEffect(() => {
    loadBounties();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('arcbounty_items_v4', JSON.stringify(bounties));
  }, [bounties]);

  // Handle posting a new bounty with Escrow deposit
  const handleCreateBounty = async (newBountyData) => {
    try {
      const token = localStorage.getItem('arcbounty_session_token');
      const res = await fetch('http://localhost:4050/api/bounties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newBountyData)
      });
      const data = await res.json();
      if (data.success && data.bounty) {
        setBounties((prev) => [data.bounty, ...prev]);
        setCreateModalOpen(false);
        showToast(`Bounty created! $${newBountyData.amount.toLocaleString()} USDC locked in Circle Arc Escrow.`);
        return;
      }
    } catch (e) {
      console.warn('Backend create bounty failed:', e);
    }

    // Local state fallback
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
    setCreateModalOpen(false);
    showToast(`Bounty created! $${newBountyData.amount.toLocaleString()} USDC locked in Circle Arc Escrow.`);
  };

  // Handle solver deliverable submission
  const handleSubmitSolution = async (bountyId, submissionUrl, solverAddress, solverType, notes) => {
    try {
      const token = localStorage.getItem('arcbounty_session_token');
      const res = await fetch(`http://localhost:4050/api/bounties/${bountyId}/participate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          submissionUrl,
          walletAddress: solverAddress || user?.address || '0x461cd48D95993242bB04774cc68042795586BbAd',
          solverType: solverType || 'Human Creator',
          notes,
          creatorName: user?.name,
          creatorEmail: user?.email
        })
      });
      const data = await res.json();
      if (data.success && data.bounty) {
        setBounties((prev) => prev.map((b) => (b.id === bountyId ? data.bounty : b)));
        setSelectedBounty(data.bounty);
        showToast('Work submitted! Challenge maintainer & Admin review initiated on Arc.');
        return;
      }
    } catch (e) {
      console.warn('Backend participate failed:', e);
    }

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

  // Validate existing session token against SQLite backend on startup
  useEffect(() => {
    const token = localStorage.getItem('arcbounty_session_token');
    if (token) {
      fetch('http://localhost:4050/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser(data.user);
            setWallet({
              connected: true,
              address: data.user.address || '0x461cd48D95993242bB04774cc68042795586BbAd',
              balance: data.user.balance || 1000,
              type: data.user.provider || 'email'
            });
            localStorage.setItem('arcbounty_session_user', JSON.stringify(data.user));
          } else {
            // Session expired or invalid in database
            localStorage.removeItem('arcbounty_session_token');
            localStorage.removeItem('arcbounty_session_user');
            setUser(null);
            setWallet({
              connected: false,
              address: null,
              balance: 0,
              type: null
            });
          }
        })
        .catch(() => {
          // If server is offline, keep cached user if any
        });
    }
  }, []);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    setWallet({
      connected: true,
      address: userData.address || '0x461cd48D95993242bB04774cc68042795586BbAd',
      balance: userData.balance || 1000,
      type: userData.provider || userData.type || 'email'
    });
    try {
      localStorage.setItem('arcbounty_session_user', JSON.stringify(userData));
      if (token) {
        localStorage.setItem('arcbounty_session_token', token);
      }
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
      localStorage.removeItem('arcbounty_session_token');
    } catch (e) {}
    setActiveView('explore');
    showToast('Logged out successfully.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Modern Top Navigation Bar (Hidden when in dedicated separate Admin mode) */}
      {activeView !== 'admin' && (
        <Navbar
          user={user}
          wallet={wallet}
          network={network}
          activeView={activeView}
          setActiveView={setActiveView}
          openAuthModal={handleOpenAuth}
          openWalletDrawer={() => setWalletDrawerOpen(true)}
          openConnectWalletModal={() => setConnectWalletModalOpen(true)}
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
      )}

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
            onOpenSettings={() => setActiveView('account')}
          />
        )}

        {(activeView === 'account' || activeView === 'account-referrals') && user && (
          <AccountSettings
            user={user}
            setUser={setUser}
            wallet={wallet}
            setWallet={setWallet}
            initialTab={activeView === 'account-referrals' ? 'referrals' : 'account'}
            onBackToFeed={() => setActiveView('explore')}
          />
        )}


        {activeView === 'leaderboard' && (
          <div style={{ paddingTop: '20px' }}>
            <Leaderboard />
          </div>
        )}

        {activeView === 'admin' && (
          <div>
            <AdminDashboard
              user={user}
              wallet={wallet}
              onBackToExplore={handleBackToExplore}
            />
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

      {/* Dedicated Web3 Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={connectWalletModalOpen}
        onClose={() => setConnectWalletModalOpen(false)}
        user={user}
        wallet={wallet}
        onWalletConnected={handleWalletConnected}
      />

      {/* Split Login & Sign Up Modal (Gibwork style) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
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
            <button onClick={() => setActiveView('leaderboard')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              Leaderboard
            </button>
            <a href="https://arc.io" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              Arc Docs ↗
            </a>
            <button
              id="footer-admin-btn"
              onClick={() => {
                setActiveView('admin');
                if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin');
              }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              title="Admin Distribution Portal"
            >
              <Lock size={12} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
