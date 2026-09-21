import React from 'react';
import { Shield, Sparkles, Zap, ArrowUpRight, CheckCircle2, Layers, UserCheck } from 'lucide-react';

export default function SidebarWidgets({ stats, onOpenCreate }) {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Ecosystem Stats Widget (Superteam Earn style) */}
      <div className="clean-card" style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Shield size={14} />
              <span>TOTAL ESCROW</span>
            </div>
            <p className="font-space" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              ${(stats?.totalSettledUsdc || 142800).toLocaleString()}
            </p>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Settled on Arc Mainnet</span>
          </div>

          <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--arc-validator-blue)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Layers size={14} />
              <span>OPPORTUNITIES</span>
            </div>
            <p className="font-space" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              {stats?.activeBountiesCount || 164}
            </p>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Active Creator Tasks</span>
          </div>
        </div>
      </div>

      {/* 2. Spotlight Promo Card (Circle Arc L1) */}
      <div
        className="clean-card"
        style={{
          background: 'linear-gradient(135deg, #1b3158 0%, #2f578c 100%)',
          color: '#ffffff',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, marginBottom: '12px' }}>
          <Sparkles size={12} color="#ffcc6f" />
          <span>OFFICIAL CIRCLE ARC ENGINE</span>
        </div>

        <h4 className="font-space" style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '8px' }}>
          Built for Designers, Creators &amp; Autonomous Agents
        </h4>

        <p style={{ fontSize: '0.82rem', opacity: 0.88, lineHeight: 1.5, marginBottom: '16px' }}>
          Zero gas fees for creators. Bounties escrowed in canonical Circle USDC with sub-second Malachite BFT finality.
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onOpenCreate}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'var(--arc-blockstream-gold)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Post a Bounty</span>
            <ArrowUpRight size={14} />
          </button>

          <a
            href="https://arc.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Arc.io</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* 3. "HOW IT WORKS" Stepper (Superteam Earn style) */}
      <div className="clean-card" style={{ padding: '22px' }}>
        <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
          HOW IT WORKS
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#e0f2fe',
              color: 'var(--arc-validator-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.82rem',
              flexShrink: 0
            }}>
              1
            </div>
            <div>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Set Up Profile &amp; Wallet
              </p>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                Showcase proof of work and claim verified creator credentials.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.82rem',
              flexShrink: 0
            }}>
              2
            </div>
            <div>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Submit Work Deliverable
              </p>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                Submit Figma links, Loom videos, Twitter/X threads, or GitHub pull requests.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.82rem',
              flexShrink: 0
            }}>
              3
            </div>
            <div>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Instant USDC Escrow Payout
              </p>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                Funds disburse in &lt;400ms with EIP-3009 zero creator gas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
