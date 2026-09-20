import React, { useState } from 'react';
import {
  Share2,
  Edit3,
  MapPin,
  Globe,
  ExternalLink,
  Plus,
  CheckCircle,
  Zap,
  Shield,
  ArrowLeft,
  Palette,
  Video,
  ShieldCheck,
  Wallet,
  Copy,
  Check
} from 'lucide-react';
import { truncateAddress } from '../utils/arc';

export default function UserProfile({
  user,
  wallet,
  bounties,
  onBackToFeed,
  onSelectBounty,
  onOpenSettings
}) {
  const [activeTab, setActiveTab] = useState('pow'); // 'pow', 'activity', 'projects'
  const [copiedAddr, setCopiedAddr] = useState(false);

  // User's submissions from bounties list
  const userSubmissions = bounties.filter(b => b.solver === wallet?.address || b.solverType) || [];

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    }
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Top Banner with soft gradient mesh */}
      <div
        style={{
          height: '240px',
          background: 'linear-gradient(135deg, #acc6e9 0%, #cdddf2 30%, #e8eff5 65%, #c0827a 100%)',
          position: 'relative'
        }}
      >
        <div className="container" style={{ paddingTop: '20px' }}>
          <button
            onClick={onBackToFeed}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#000000',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Bounties</span>
          </button>
        </div>
      </div>

      {/* Floating Main Profile Card */}
      <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
        <div className="clean-card" style={{ padding: '36px', borderRadius: '14px', maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            {/* Avatar & User Details */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #000000',
                  boxShadow: '3px 3px 0px #000000'
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 className="font-space" style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    {user?.name}
                  </h1>
                  <ShieldCheck size={20} color="#16a34a" />
                </div>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 700 }}>
                  @{user?.username} · <span style={{ color: '#1b3158' }}>{user?.discipline || 'Creator'}</span>
                </p>

                {/* Wallet Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <div
                    onClick={copyAddress}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#f1f5f9',
                      border: '1px solid #000000',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '0.76rem',
                      fontFamily: 'Geist Mono, monospace',
                      cursor: 'pointer',
                      color: '#0f172a'
                    }}
                    title="Click to copy Arc address"
                  >
                    <Wallet size={12} />
                    <span>{truncateAddress(wallet?.address || user?.address)}</span>
                    {copiedAddr ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                onClick={onOpenSettings}
              >
                <Edit3 size={14} />
                <span>Account Settings</span>
              </button>

              <button
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Profile link copied to clipboard!');
                }}
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Connected Social Accounts Proof Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
              marginTop: '20px',
              padding: '12px 16px',
              background: '#f8fafc',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              borderRadius: '8px'
            }}
          >
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              VERIFIED SOCIALS:
            </span>

            {/* X */}
            {user?.x ? (
              <a
                href={`https://x.com/${user.x}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#000000',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>X: @{user.x}</span>
                <ExternalLink size={10} />
              </a>
            ) : (
              <button
                type="button"
                onClick={onOpenSettings}
                style={{
                  background: '#ffffff',
                  border: '1.5px dashed #94a3b8',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  color: '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Connect X
              </button>
            )}

            {/* Telegram */}
            {user?.telegram ? (
              <a
                href={`https://t.me/${user.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#229ED9',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>Telegram: @{user.telegram}</span>
                <ExternalLink size={10} />
              </a>
            ) : (
              <button
                type="button"
                onClick={onOpenSettings}
                style={{
                  background: '#ffffff',
                  border: '1.5px dashed #94a3b8',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  color: '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Connect Telegram
              </button>
            )}

            {/* Discord */}
            {user?.discord ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#5865F2',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700
                }}
              >
                <span>Discord: {user.discord}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onOpenSettings}
                style={{
                  background: '#ffffff',
                  border: '1.5px dashed #94a3b8',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  color: '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Connect Discord
              </button>
            )}

            {/* GitHub */}
            {user?.github ? (
              <a
                href={`https://github.com/${user.github}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>GitHub: @{user.github}</span>
                <ExternalLink size={10} />
              </a>
            ) : (
              <button
                type="button"
                onClick={onOpenSettings}
                style={{
                  background: '#ffffff',
                  border: '1.5px dashed #94a3b8',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  color: '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Connect GitHub
              </button>
            )}
          </div>

          {/* Details & Skills Section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '2px solid #000000'
            }}
          >
            {/* Skills & Bio */}
            <div>
              <p style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                CREATOR BIO &amp; DISCIPLINE
              </p>
              <p style={{ fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.4, margin: '0 0 12px 0', fontWeight: 500 }}>
                {user?.bio || 'Web3 Creator on Circle Arc L1'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ background: '#fffae6', border: '1.5px solid #000000', color: '#000000', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800 }}>
                  {user?.discipline || 'Design'}
                </span>
                <span style={{ background: '#f1f5f9', border: '1.5px solid #000000', color: '#000000', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700 }}>
                  Circle Arc Escrow
                </span>
                <span style={{ background: '#dcfce7', border: '1.5px solid #000000', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800 }}>
                  Gasless EIP-3009
                </span>
              </div>
            </div>

            {/* Stats Metrics (Superteam Earn style) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                background: '#f8fafc',
                padding: '14px',
                borderRadius: '10px',
                border: '2px solid #000000',
                boxShadow: '2px 2px 0px #000000'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p className="font-space" style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  ${(wallet?.balance || 1000).toLocaleString()}
                </p>
                <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 700 }}>
                  USDC BALANCE
                </p>
              </div>

              <div style={{ width: '2px', height: '30px', background: '#000000' }} />

              <div style={{ textAlign: 'center' }}>
                <p className="font-space" style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  4
                </p>
                <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 700 }}>
                  SUBMISSIONS
                </p>
              </div>

              <div style={{ width: '2px', height: '30px', background: '#000000' }} />

              <div style={{ textAlign: 'center' }}>
                <p className="font-space" style={{ fontSize: '1.45rem', fontWeight: 900, color: '#16a34a', margin: 0 }}>
                  2
                </p>
                <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 700 }}>
                  WON ON ARC
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
