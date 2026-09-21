import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Wallet, ChevronDown, User, Settings, Bell, Share2, LogOut, Zap, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { truncateAddress } from '../utils/arc';

export default function Navbar({
  user,
  wallet,
  network,
  activeView,
  setActiveView,
  openAuthModal,
  openWalletDrawer,
  openConnectWalletModal,
  openCreateModal,
  onLogout,
  searchQuery,
  setSearchQuery
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      height: '70px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '20px'
      }}>
        {/* Left: Brand Logo & Network Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          <div
            onClick={() => setActiveView('explore')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <span className="font-space" style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--arc-protocol-navy)' }}>
              Arc<span style={{ color: 'var(--arc-blockstream-gold)' }}>Bounty</span>
            </span>
          </div>

          {/* Network indicator pill */}
          <div
            className="desktop-only"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              background: '#f1f5f9',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#334155'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
            <span>Circle Arc 5042</span>
            <span style={{ color: '#64748b', fontSize: '0.7rem' }}>(&lt;400ms)</span>
          </div>
        </div>

        {/* Center: Navigation Links & Search Bar (Superteam Earn style) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1, maxWidth: '540px', marginLeft: '12px' }} className="desktop-only">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setActiveView('explore')}
              style={{
                background: 'none',
                border: 'none',
                color: activeView === 'explore' ? 'var(--arc-protocol-navy)' : '#64748b',
                fontWeight: activeView === 'explore' ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                padding: '4px 0',
                borderBottom: activeView === 'explore' ? '2px solid var(--arc-protocol-navy)' : '2px solid transparent'
              }}
            >
              Bounties
            </button>
            <button
              onClick={() => setActiveView('leaderboard')}
              style={{
                background: 'none',
                border: 'none',
                color: activeView === 'leaderboard' ? 'var(--arc-protocol-navy)' : '#64748b',
                fontWeight: activeView === 'leaderboard' ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                padding: '4px 0',
                borderBottom: activeView === 'leaderboard' ? '2px solid var(--arc-protocol-navy)' : '2px solid transparent'
              }}
            >
              Leaderboard
            </button>
            <a
              href="https://arc.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.88rem',
                textDecoration: 'none'
              }}
            >
              Arc Docs ↗
            </a>

            {user?.isAdmin && (
              <button
                id="navbar-admin-btn"
                onClick={() => setActiveView('admin')}
                style={{
                  background: activeView === 'admin' ? '#1b3158' : '#fffae6',
                  color: activeView === 'admin' ? '#ffffff' : '#0f172a',
                  border: '1.5px solid #000000',
                  boxShadow: activeView === 'admin' ? 'none' : '2px 2px 0px #000000',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Shield size={13} color={activeView === 'admin' ? '#ffcc6f' : '#b45309'} />
                <span>Admin Portal</span>
              </button>
            )}
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search bounties, creators, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 34px',
                borderRadius: '8px',
                border: '1.5px solid #000000',
                background: '#ffffff',
                fontSize: '0.84rem',
                color: '#0f172a',
                outline: 'none',
                fontWeight: 600
              }}
            />
          </div>
        </div>

        {/* Right: Actions depending on Auth State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!user ? (
            /* Logged Out Header (Guest User Experience) */
            <>
              <button
                onClick={() => openAuthModal('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '6px 10px'
                }}
                className="desktop-only"
              >
                Become a Sponsor
              </button>

              <button
                id="navbar-login-btn"
                onClick={() => openAuthModal('login')}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.86rem' }}
              >
                Log In
              </button>

              <button
                id="navbar-signup-btn"
                onClick={() => openAuthModal('signup')}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.86rem' }}
              >
                Sign Up
              </button>

              <button
                onClick={openConnectWalletModal}
                className="btn-secondary desktop-only"
                style={{ padding: '8px 14px', fontSize: '0.84rem', gap: '6px' }}
                title="Connect Web3 Wallet"
              >
                <Wallet size={15} />
                <span>Connect Wallet</span>
              </button>
            </>
          ) : (
            /* Logged In Header (Gibwork & Superteam Earn style) */
            <>
              {/* Create Bounty Button */}
              <button
                id="navbar-create-bounty-btn"
                onClick={openCreateModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Create Bounty</span>
              </button>

              {/* Wallet Balance Pill */}
              <button
                onClick={openWalletDrawer}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Open Arc Wallet Drawer"
              >
                <span style={{ color: '#16a34a', fontWeight: 800 }}>${wallet.balance.toLocaleString()}</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>USDC</span>
              </button>

              {/* Refer Friends Button */}
              <button
                onClick={() => setActiveView('account-referrals')}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
                className="desktop-only"
              >
                Refer Friends
              </button>

              {/* User Avatar & Dropdown Menu */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '9999px',
                    border: '1px solid transparent',
                    transition: 'border-color 0.15s'
                  }}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  />
                  <ChevronDown size={14} color="#64748b" />
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '48px',
                      width: '240px',
                      background: '#ffffff',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'var(--shadow-dropdown)',
                      padding: '8px',
                      zIndex: 1000
                    }}
                  >
                    {/* User Header in Dropdown */}
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', margin: 0 }}>
                          {user.name}
                        </p>
                        <CheckCircle size={14} color="#10b981" />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                        @{user.username}
                      </p>

                      {/* XP Progress Bar (Gibwork style) */}
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: '3px' }}>
                          <span>Level 1 XP</span>
                          <span>420 / 1000</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: '42%', height: '100%', background: 'var(--arc-blockstream-gold)', borderRadius: '4px' }} />
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: '6px 0' }}>
                      {user?.isAdmin && (
                        <button
                          onClick={() => { setActiveView('admin'); setDropdownOpen(false); }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            background: '#fffae6',
                            border: '1.5px solid #000000',
                            boxShadow: '1.5px 1.5px 0px #000000',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 900,
                            color: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            marginBottom: '6px'
                          }}
                        >
                          <Shield size={15} color="#b45309" />
                          <span>Admin Portal &amp; Payouts</span>
                        </button>
                      )}

                      <button
                        onClick={() => { setActiveView('profile'); setDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          background: 'none',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        <User size={15} color="#64748b" />
                        <span>Profile &amp; Proof of Work</span>
                      </button>

                      <button
                        onClick={() => { setActiveView('account'); setDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          background: 'none',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        <Settings size={15} color="#64748b" />
                        <span>Account Settings</span>
                      </button>

                      <button
                        onClick={() => { openWalletDrawer(); setDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          background: 'none',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        <Wallet size={15} color="#64748b" />
                        <span>Arc Wallet Drawer</span>
                      </button>

                      <button
                        onClick={() => { setActiveView('account-referrals'); setDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          background: 'none',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        <Share2 size={15} color="#64748b" />
                        <span>Refer Friends</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                      <button
                        onClick={() => { onLogout(); setDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          background: 'none',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        <LogOut size={15} color="#ef4444" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
