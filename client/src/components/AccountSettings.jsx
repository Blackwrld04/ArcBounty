import React, { useState } from 'react';
import { User, Wallet, Bell, Share2, Copy, Check, ExternalLink, ArrowLeft, Plus } from 'lucide-react';
import { truncateAddress } from '../utils/arc';

export default function AccountSettings({ user, wallet, setWallet, onBackToFeed, initialTab = 'account' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'account', 'wallet', 'notifications', 'referrals'
  const [name, setName] = useState(user.name || 'Olajide Abdulquadri');
  const [username, setUsername] = useState(user.username || 'olajide-amaranth-18');
  const [email, setEmail] = useState(user.email || 'olajideabdulquadri22@gmail.com');
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedNotifications, setSavedNotifications] = useState(false);

  // Notification toggles
  const [notifs, setNotifs] = useState({
    newBounties: true,
    githubBounties: true,
    productUpdates: true
  });

  const referralLink = `https://arcbounty.io?ref=${username}`;

  const copyRefLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveNotifs = (e) => {
    e.preventDefault();
    setSavedNotifications(true);
    setTimeout(() => setSavedNotifications(false), 2500);
  };

  return (
    <section style={{ padding: '36px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Back navigation */}
        <button
          onClick={onBackToFeed}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '20px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Bounties</span>
        </button>

        {/* Top Horizontal Navigation Tabs (Gibwork style) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '12px',
          marginBottom: '28px'
        }}>
          {[
            { id: 'account', label: 'Account' },
            { id: 'wallet', label: 'Wallet' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'referrals', label: 'Referrals' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? '#f1f5f9' : 'transparent',
                color: activeTab === t.id ? '#0f172a' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: activeTab === t.id ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Account (Profile Settings & Connected Accounts) */}
        {activeTab === 'account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Profile Settings Card */}
            <div className="clean-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Profile Settings
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '3px 0 20px 0' }}>
                Manage your public creator profile and personal details.
              </p>

              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '22px' }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={name}
                  style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                />
                <div>
                  <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => alert('Avatar upload enabled.')}>
                    Change Avatar
                  </button>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="clean-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Email Address
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{email}</span>
                <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Primary
                </span>
              </div>
            </div>

            {/* Connected Accounts (Gibwork style) */}
            <div className="clean-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Connected Accounts
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '3px 0 18px 0' }}>
                Manage your third-party connections and social proof verifications.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* GitHub */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: '#ffffff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>GitHub</p>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Connected as blackwrld04</p>
                    </div>
                  </div>
                  <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                    <Check size={16} />
                    <span>Verified</span>
                  </span>
                </div>

                {/* X (Twitter) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  background: '#ffffff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#000000', color: '#fff', border: '1.5px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.95rem' }}>
                      X
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>X (Twitter)</p>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Connected as blackwrld04</p>
                    </div>
                  </div>
                  <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                    <Check size={16} />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Wallet */}
        {activeTab === 'wallet' && (
          <div className="clean-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Primary Arc Wallet
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '3px 0 20px 0' }}>
              Connected to Circle Arc Mainnet (Chain ID 5042). All payments and escrow locks settle here.
            </p>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>USDC BALANCE</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span className="font-space" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>
                  ${wallet.balance.toLocaleString()}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#64748b' }}>USDC</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#475569', fontFamily: 'Geist Mono, monospace', marginTop: '6px' }}>
                {wallet.address}
              </p>
            </div>

            <button
              onClick={() => {
                setWallet(prev => ({ ...prev, balance: prev.balance + 1000 }));
                alert('Claimed +$1,000 USDC from Arc Test Faucet!');
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                background: 'var(--arc-blockstream-gold)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} />
              <span>Claim +$1,000 USDC Faucet</span>
            </button>
          </div>
        )}

        {/* TAB 3: Notifications (Gibwork style) */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleSaveNotifs} className="clean-card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Email &amp; App Notifications
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '3px 0 24px 0' }}>
              Configure alerts for new bounties, review updates, and payments.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>New Bounties</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>Receive alerts when high-reward bounties match your creator tags</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifs.newBounties}
                    onChange={(e) => setNotifs({ ...notifs, newBounties: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Deliverable Reviews &amp; Approvals</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>Receive alerts when sponsors review or disburse your USDC escrow</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifs.githubBounties}
                    onChange={(e) => setNotifs({ ...notifs, githubBounties: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Product Updates</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>Receive occasional announcements about Circle Arc upgrades and hackathons</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifs.productUpdates}
                    onChange={(e) => setNotifs({ ...notifs, productUpdates: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>

              {savedNotifications && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>
                  <Check size={15} strokeWidth={3} />
                  <span>Preferences updated successfully</span>
                </span>
              )}
            </div>
          </form>
        )}

        {/* TAB 4: Referrals (Gibwork style) */}
        {activeTab === 'referrals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="clean-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Earn every time your referrals get paid
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 22px 0' }}>
                Share ArcBounty with creator friends and collect rewards instantly as users create or complete work on Circle Arc.
              </p>

              {/* Referral Link Input */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: '0.85rem',
                    color: '#334155'
                  }}
                />
                <button
                  type="button"
                  onClick={copyRefLink}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 3 Stats Cards (Gibwork style) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="clean-card" style={{ padding: '20px' }}>
                <p className="font-space" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  0
                </p>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0', fontWeight: 600 }}>
                  Paid referrals
                </p>
              </div>

              <div className="clean-card" style={{ padding: '20px' }}>
                <p className="font-space" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  0
                </p>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0', fontWeight: 600 }}>
                  Awaiting payout
                </p>
              </div>

              <div className="clean-card" style={{ padding: '20px' }}>
                <p className="font-space" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: 0 }}>
                  $0.00
                </p>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0', fontWeight: 600 }}>
                  Referral earnings (USDC)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
