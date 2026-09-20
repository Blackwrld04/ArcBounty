import React, { useState } from 'react';
import { Share2, Edit3, MapPin, Globe, ExternalLink, Plus, CheckCircle, Zap, Shield, ArrowLeft } from 'lucide-react';
import { truncateAddress } from '../utils/arc';

export default function UserProfile({ user, wallet, bounties, onBackToFeed, onSelectBounty }) {
  const [activeTab, setActiveTab] = useState('pow'); // 'pow', 'activity', 'projects'

  // User's submissions from bounties list
  const userSubmissions = bounties.filter(b => b.solver === wallet.address || b.solverType) || [];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Top Banner with soft gradient mesh (Superteam Earn style) */}
      <div style={{
        height: '240px',
        background: 'linear-gradient(135deg, #acc6e9 0%, #cdddf2 30%, #e8eff5 65%, #c0827a 100%)',
        position: 'relative'
      }}>
        <div className="container" style={{ paddingTop: '20px' }}>
          <button
            onClick={onBackToFeed}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#1e293b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(4px)'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Bounties</span>
          </button>
        </div>
      </div>

      {/* Floating Main Profile Card */}
      <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
        <div className="clean-card" style={{ padding: '36px', borderRadius: '18px', maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            {/* Avatar & User Details */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 className="font-space" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {user.name}
                  </h1>
                  <CheckCircle size={18} color="#2563eb" />
                </div>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  @{user.username}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem', marginTop: '6px' }}>
                  <MapPin size={13} />
                  <span>Based in Nigeria</span>
                  <span>·</span>
                  <span style={{ fontFamily: 'Geist Mono, monospace' }}>{truncateAddress(wallet.address)}</span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                onClick={() => alert('Profile editing is enabled.')}
              >
                <Edit3 size={14} />
                <span>Edit Profile</span>
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

          {/* Details & Skills Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '28px',
            paddingTop: '24px',
            borderTop: '1px solid #f1f5f9'
          }}>
            {/* Skills */}
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                CREATOR SKILLS
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ background: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                  Community Manager
                </span>
                <span style={{ background: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                  Discord Moderator
                </span>
                <span style={{ background: '#f3e8ff', color: '#7c3aed', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                  Graphic Design
                </span>
                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                  Smart Contracts (Arc)
                </span>
              </div>
            </div>

            {/* Stats Metrics (Superteam Earn style) */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: '#f8fafc', padding: '14px', borderRadius: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <p className="font-space" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  $19,500
                </p>
                <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 600 }}>
                  EARNED (USDC)
                </p>
              </div>

              <div style={{ width: '1px', height: '30px', background: '#e2e8f0' }} />

              <div style={{ textAlign: 'center' }}>
                <p className="font-space" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  4
                </p>
                <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 600 }}>
                  SUBMISSIONS
                </p>
              </div>

              <div style={{ width: '1px', height: '30px', background: '#e2e8f0' }} />

              <div style={{ textAlign: 'center' }}>
                <p className="font-space" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a', margin: 0 }}>
                  2
                </p>
                <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 600 }}>
                  WON ON ARC
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Proof of Work / Activity Tabs Container */}
        <div style={{ maxWidth: '880px', margin: '36px auto 0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <button
                onClick={() => setActiveTab('pow')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: activeTab === 'pow' ? 800 : 600,
                  color: activeTab === 'pow' ? 'var(--arc-protocol-navy)' : '#64748b',
                  borderBottom: activeTab === 'pow' ? '2px solid var(--arc-protocol-navy)' : 'none',
                  paddingBottom: '12px',
                  marginBottom: '-13px',
                  cursor: 'pointer'
                }}
              >
                Proof of Work
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: activeTab === 'activity' ? 800 : 600,
                  color: activeTab === 'activity' ? 'var(--arc-protocol-navy)' : '#64748b',
                  borderBottom: activeTab === 'activity' ? '2px solid var(--arc-protocol-navy)' : 'none',
                  paddingBottom: '12px',
                  marginBottom: '-13px',
                  cursor: 'pointer'
                }}
              >
                Activity Feed
              </button>
            </div>

            <button
              onClick={() => onBackToFeed()}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--arc-protocol-navy)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={14} />
              <span>+ADD WORK</span>
            </button>
          </div>

          {/* Submissions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="clean-card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    🎨
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      Design Official 3D Mascot &amp; Sticker Pack for Circle Arc
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                      Deliverable: <a href="https://figma.com/@olajide/arc-mascot" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--arc-validator-blue)', fontWeight: 600 }}>figma.com/@olajide/arc-mascot</a>
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    WON &amp; DISBURSED
                  </span>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                    $1,200 USDC
                  </p>
                </div>
              </div>
            </div>

            <div className="clean-card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    🎬
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      Produce 60-Second Viral Motion Explainer for Arc Native Gas
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                      Deliverable: <a href="https://loom.com/share/arc-explainer-cut" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--arc-validator-blue)', fontWeight: 600 }}>loom.com/share/arc-explainer-cut</a>
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    IN REVIEW
                  </span>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                    $1,500 USDC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
