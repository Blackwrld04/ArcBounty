import React from 'react';
import { ArrowRight, Zap, CheckCircle2, Sparkles, DollarSign, Palette, Video, PenTool, Smile } from 'lucide-react';

export default function Hero({ openCreateModal, setActiveTab, onExploreClick }) {
  return (
    <section style={{ position: 'relative', paddingTop: '115px', paddingBottom: '30px', overflow: 'hidden' }}>
      {/* Background Dots */}
      <div className="brutal-dots" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'center',
          minHeight: '52vh'
        }}>
          {/* Left Column: Hero Headline & CTAs */}
          <div style={{ maxWidth: '680px' }}>
            {/* Sticker Pill Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
              <span className="brutal-badge" style={{ background: 'var(--c-yellow)', transform: 'rotate(-1deg)' }}>
                ⚡ WEB3 CREATOR ECONOMY
              </span>
              <span className="brutal-badge" style={{ background: 'var(--c-lime)', transform: 'rotate(1deg)' }}>
                💵 NATIVE USDC ESCROW
              </span>
              <span className="brutal-badge" style={{ background: 'var(--c-cyan)', transform: 'rotate(-0.5deg)' }}>
                ⚡ MALACHITE BFT &lt;400MS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-space" style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.3rem)',
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              color: '#000000',
              marginBottom: '18px'
            }}>
              CREATE &amp; EARN ON{' '}
              <span style={{
                background: 'var(--c-lime)',
                border: '3px solid #000',
                padding: '2px 8px',
                display: 'inline-block',
                boxShadow: '4px 4px 0px #000',
                transform: 'rotate(-1deg)'
              }}>
                CIRCLE ARC.
              </span>
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '1.15rem',
              color: '#1f2937',
              lineHeight: 1.5,
              fontWeight: 600,
              marginBottom: '28px'
            }}>
              The decentralized bounty marketplace for <strong>Designers, Video Creators, Thread Writers, Meme Lords, and Developers</strong>.
              Fund bounties in pure USDC, submit creative work, and get paid with <strong>sub-second finality and zero gas fees</strong>.
            </p>

            {/* Category Quick Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
              <span className="brutal-badge" style={{ background: '#ffffff' }}><Palette size={13} /> Design &amp; 3D</span>
              <span className="brutal-badge" style={{ background: '#ffffff' }}><Video size={13} /> Video &amp; Reels</span>
              <span className="brutal-badge" style={{ background: '#ffffff' }}><PenTool size={13} /> Threads &amp; Writing</span>
              <span className="brutal-badge" style={{ background: '#ffffff' }}><Smile size={13} /> Memes &amp; Social</span>
              <span className="brutal-badge" style={{ background: '#ffffff' }}><Zap size={13} /> Code &amp; AI Swarms</span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
              <button
                id="hero-create-bounty-btn"
                onClick={openCreateModal}
                className="brutal-btn brutal-btn-yellow"
                style={{ fontSize: '1rem', padding: '14px 28px' }}
              >
                <span>+ Post a Bounty</span>
                <ArrowRight size={18} strokeWidth={3} />
              </button>

              <button
                id="hero-explore-bounties-btn"
                onClick={onExploreClick}
                className="brutal-btn brutal-btn-lime"
                style={{ fontSize: '1rem', padding: '14px 28px' }}
              >
                <span>🔥 Browse Bounties</span>
              </button>

              <button
                id="hero-ai-swarm-btn"
                onClick={() => setActiveTab('swarm')}
                className="brutal-btn brutal-btn-cyan"
                style={{ fontSize: '0.92rem', padding: '14px 20px' }}
              >
                <span>🤖 AI &amp; Creator Swarms</span>
              </button>
            </div>
          </div>

          {/* Right Column: Neo-Brutalist Creator Showcase Cards */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Creator Card 1: Design & 3D */}
              <div
                className="brutal-card"
                style={{
                  padding: '16px 20px',
                  background: '#ffffff',
                  transform: 'rotate(1deg)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="brutal-badge" style={{ background: 'var(--c-pink)', color: '#fff' }}>
                    🎨 3D &amp; DESIGN
                  </span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: '#000000' }}>
                    $1,200 USDC
                  </span>
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '0.98rem', color: '#000000' }}>
                  Design Official 3D Mascot for Circle Arc
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#4b5563', marginTop: '3px' }}>
                  Deliverable: Blender GLTF + 15 expressive Telegram stickers
                </p>
              </div>

              {/* Creator Card 2: Video & Motion */}
              <div
                className="brutal-card"
                style={{
                  padding: '16px 20px',
                  background: 'var(--c-yellow)',
                  transform: 'rotate(-1.5deg)',
                  marginLeft: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="brutal-badge" style={{ background: '#000000', color: '#ffffff' }}>
                    🎬 VIDEO &amp; REELS
                  </span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: '#000000' }}>
                    $1,500 USDC
                  </span>
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '0.98rem', color: '#000000' }}>
                  60-Second Viral Explainer: "Arc Native USDC Gas"
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 500, marginTop: '3px' }}>
                  Deliverable: Kinetic 9:16 vertical edit for TikTok &amp; X
                </p>
              </div>

              {/* Creator Card 3: Writing & Memes */}
              <div
                className="brutal-card"
                style={{
                  padding: '16px 20px',
                  background: 'var(--c-cyan)',
                  transform: 'rotate(0.5deg)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="brutal-badge" style={{ background: '#ffffff', color: '#000' }}>
                    ✍️ VIRAL THREAD
                  </span>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: '#000000' }}>
                    $800 USDC
                  </span>
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '0.98rem', color: '#000000' }}>
                  15-Post Mega Thread: Malachite BFT vs Tendermint
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 500, marginTop: '3px' }}>
                  Deliverable: Viral X thread with custom architecture infographics
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Brutalist Marquee Banner */}
      <div style={{
        marginTop: '45px',
        borderTop: '3px solid #000000',
        borderBottom: '3px solid #000000',
        background: 'var(--c-yellow)',
        padding: '12px 0',
        overflow: 'hidden'
      }}>
        <div className="brutal-marquee">
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px', paddingRight: '36px', color: '#000000', fontSize: '0.95rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span>⚡ CIRCLE ARC L1 MAINNET (5042)</span>
            <span>• 100% NATIVE USDC PAYOUTS</span>
            <span>• ZERO GAS FOR CREATORS (EIP-3009)</span>
            <span>• &lt;400MS MALACHITE FINALITY</span>
            <span>• 🎨 DESIGN</span>
            <span>• 🎬 VIDEO</span>
            <span>• ✍️ WRITING</span>
            <span>• 🐸 MEMES</span>
            <span>• 💻 DEV</span>
            <span>• 🤖 AI SWARMS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px', paddingRight: '36px', color: '#000000', fontSize: '0.95rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span>⚡ CIRCLE ARC L1 MAINNET (5042)</span>
            <span>• 100% NATIVE USDC PAYOUTS</span>
            <span>• ZERO GAS FOR CREATORS (EIP-3009)</span>
            <span>• &lt;400MS MALACHITE FINALITY</span>
            <span>• 🎨 DESIGN</span>
            <span>• 🎬 VIDEO</span>
            <span>• ✍️ WRITING</span>
            <span>• 🐸 MEMES</span>
            <span>• 💻 DEV</span>
            <span>• 🤖 AI SWARMS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
