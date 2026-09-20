import React from 'react';
import { ArrowRight, Zap, Sparkles, CheckCircle2, ShieldCheck, Bot, Plus } from 'lucide-react';

export default function Hero({ openCreateModal, onExploreClick, openAuthModal, user }) {
  return (
    <section style={{ padding: '48px 0 28px 0', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Arc L1 Sticker Badge (Neo-Brutalist) */}
        <div style={{ marginBottom: '22px' }}>
          <span className="sticker-tape">
            CIRCLE ARC L1 (CHAIN ID 5042) · NATIVE USDC ESCROW · ZERO-GAS CREATOR SETTLEMENT
          </span>
        </div>

        {/* Unique ArcBounty Headline */}
        <h1 className="font-space" style={{
          fontSize: 'clamp(2.3rem, 4.6vw, 3.8rem)',
          fontWeight: 900,
          color: 'var(--arc-protocol-navy)',
          letterSpacing: '-0.03em',
          lineHeight: 1.16,
          marginBottom: '20px'
        }}>
          The Open Bounty Protocol for{' '}
          <span className="neo-highlight-sky">
            Web3 Creators
          </span>
          <br />
          Settled in{' '}
          <span className="neo-highlight-gold">
            Canonical USDC
          </span>
        </h1>

        {/* Unique Value Proposition Write-Up */}
        <p style={{
          fontSize: '1.08rem',
          color: '#334155',
          lineHeight: 1.6,
          maxWidth: '680px',
          margin: '0 auto 28px auto',
          fontWeight: 600
        }}>
          The high-velocity bounty protocol built on Circle's Arc Layer-1. Lock verified escrow, deliver high-impact work in <strong>Content, Design, Development, and All Social</strong> campaigns, and receive instant payouts with sub-second Malachite BFT finality.
        </p>

        {/* Proof-Point Pills (Clean Neo-Brutalist Badges) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '32px'
        }}>
          <div className="clean-badge" style={{ background: '#ffffff', color: '#000000', padding: '6px 14px', fontSize: '0.78rem' }}>
            <ShieldCheck size={15} color="var(--arc-validator-blue)" />
            <span>Verifiable On-Chain Escrow</span>
          </div>

          <div className="clean-badge" style={{ background: '#ffffff', color: '#000000', padding: '6px 14px', fontSize: '0.78rem' }}>
            <Zap size={15} color="#d97706" />
            <span>&lt;400ms Settlement Speed</span>
          </div>

          <div className="clean-badge" style={{ background: '#ffffff', color: '#000000', padding: '6px 14px', fontSize: '0.78rem' }}>
            <Bot size={15} color="var(--arc-quantum-plum)" />
            <span>Autonomous AI Swarm Ready</span>
          </div>
        </div>

        {/* Neo-Brutalist Call-to-Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            id="hero-create-bounty-btn"
            onClick={openCreateModal}
            className="btn-primary"
            style={{ padding: '13px 26px', fontSize: '0.96rem' }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Post a Bounty</span>
          </button>

          {!user && (
            <button
              id="hero-signup-btn"
              onClick={() => openAuthModal('signup')}
              className="btn-accent"
              style={{ padding: '13px 26px', fontSize: '0.96rem' }}
            >
              <span>Join as Creator</span>
              <ArrowRight size={17} />
            </button>
          )}

          <button
            id="hero-explore-btn"
            onClick={onExploreClick}
            className="btn-secondary"
            style={{ padding: '13px 24px', fontSize: '0.96rem' }}
          >
            <span>Browse Opportunities</span>
          </button>
        </div>
      </div>
    </section>
  );
}
