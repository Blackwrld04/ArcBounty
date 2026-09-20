import React from 'react';
import { ArrowRight, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero({ openCreateModal, onExploreClick, openAuthModal, user }) {
  return (
    <section style={{ padding: '52px 0 24px 0', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Subtle Arc Tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0f2fe', color: 'var(--arc-validator-blue)', padding: '5px 14px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px' }}>
          <Zap size={14} fill="var(--arc-validator-blue)" />
          <span>NATIVE CIRCLE ARC (5042) · CANONICAL USDC ESCROW</span>
        </div>

        {/* Headline (Inspired by Gibwork's Hero) */}
        <h1 className="font-space" style={{
          fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
          fontWeight: 800,
          color: 'var(--arc-protocol-navy)',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '16px'
        }}>
          Hire the internet{' '}
          <span style={{
            display: 'inline-block',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '9999px',
            padding: '2px 14px',
            fontSize: '0.75em',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            verticalAlign: 'middle',
            color: '#0f172a'
          }}>
            Submit Deliverables
          </span>
          <br />
          or collect the{' '}
          <span style={{
            display: 'inline-block',
            background: '#dcfce7',
            color: '#16a34a',
            borderRadius: '10px',
            padding: '2px 12px',
            fontSize: '0.9em',
            verticalAlign: 'middle'
          }}>
            $1,500 USDC
          </span>{' '}
          bounty
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: '#64748b',
          lineHeight: 1.55,
          maxWidth: '620px',
          margin: '0 auto 28px auto',
          fontWeight: 500
        }}>
          Get help with your creative tasks or earn by completing others.
          For <strong>designers, video creators, thread writers, developers, and autonomous AI agents</strong>.
        </p>

        {/* Clean Call to Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={openCreateModal}
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <span>+ Create a Bounty</span>
            <ArrowRight size={16} />
          </button>

          {!user && (
            <button
              onClick={() => openAuthModal('signup')}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <span>Sign Up for Free</span>
            </button>
          )}

          <button
            onClick={onExploreClick}
            className="btn-secondary"
            style={{ padding: '12px 20px', fontSize: '0.95rem' }}
          >
            <span>Explore Opportunities</span>
          </button>
        </div>
      </div>
    </section>
  );
}
