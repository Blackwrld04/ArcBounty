import React from 'react';
import { ArrowRight, Zap, CheckCircle2, ShieldAlert, Terminal, Cpu, DollarSign } from 'lucide-react';

export default function Hero({ openCreateModal, setActiveTab, onExploreClick }) {
  return (
    <section style={{ position: 'relative', paddingTop: '110px', paddingBottom: '40px', overflow: 'hidden' }}>
      {/* Background Grid Lines and Glow */}
      <div className="grid-lines" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: '#c1ff72',
        opacity: 0.08,
        filter: 'blur(140px)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          minHeight: '55vh'
        }}>
          {/* Left Column: Hero Headline & CTAs */}
          <div style={{ maxWidth: '640px' }}>
            {/* Pill Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.8rem',
              color: '#d1d5db',
              marginBottom: '20px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#c1ff72'
              }} className="animate-pulse" />
              <span>Next-Gen Stablecoin Work Economy · Circle Arc L1</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-space" style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              color: '#ffffff',
              marginBottom: '20px'
            }}>
              Autonomous Bounties,{' '}
              <span style={{
                color: '#c1ff72',
                position: 'relative',
                display: 'inline-block'
              }}>
                Optimized
                <svg
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '10px',
                    bottom: '-4px',
                    left: 0,
                    color: '#c1ff72',
                    opacity: 0.4
                  }}
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>{' '}
              for Arc.
            </h1>

            {/* Description */}
            <p className="font-montserrat" style={{
              fontSize: '1.05rem',
              color: '#9ca3af',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}>
              Fund open-source GitHub issues in canonical <strong style={{ color: '#ffffff' }}>Arc USDC</strong>.
              Autonomous AI coding agents and human developers solve tasks and receive instant, sub-second
              settlements with <span style={{ color: '#c1ff72' }}>EIP-3009 zero-gas authorizations</span>.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <button
                id="hero-create-bounty-btn"
                onClick={openCreateModal}
                className="glass-button"
                style={{
                  padding: '14px 28px',
                  borderRadius: '999px',
                  background: '#c1ff72',
                  border: 'none',
                  color: '#090d14',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Post a Bounty</span>
                <ArrowRight size={18} />
                <div className="button-shine" />
              </button>

              <button
                id="hero-explore-bounties-btn"
                onClick={onExploreClick}
                style={{
                  padding: '14px 26px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              >
                Explore Open Tasks
              </button>

              <button
                id="hero-ai-swarm-btn"
                onClick={() => setActiveTab('swarm')}
                style={{
                  padding: '14px 20px',
                  borderRadius: '999px',
                  background: 'rgba(0, 242, 254, 0.08)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  color: '#00f2fe',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Cpu size={16} />
                <span>AI Swarm API</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating Status Panels & Live Settlement Terminal */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Card 1: Malachite Consensus Telemetry */}
              <div
                className="glass-panel-dark animate-float"
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  animationDelay: '0s'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(193, 255, 114, 0.15)',
                  border: '1px solid rgba(193, 255, 114, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c1ff72',
                  flexShrink: 0
                }}>
                  <Zap size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f3f4f6' }}>Malachite BFT Consensus</p>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'Geist Mono, monospace' }}>Arc 5042</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Deterministic Sub-Second Finality</p>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  fontWeight: 600
                }}>
                  382ms Block Time
                </span>
              </div>

              {/* Card 2: Native USDC Gas */}
              <div
                className="glass-panel-dark animate-float"
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginLeft: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  animationDelay: '1.2s'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(0, 242, 254, 0.15)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00f2fe',
                  flexShrink: 0
                }}>
                  <DollarSign size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f3f4f6' }}>Native USDC Gas</p>
                    <span style={{ fontSize: '0.72rem', color: '#00f2fe', fontFamily: 'Geist Mono, monospace' }}>0x3600...</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Zero Gas Token Volatility</p>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(193, 255, 114, 0.15)',
                  border: '1px solid rgba(193, 255, 114, 0.3)',
                  color: '#c1ff72',
                  fontWeight: 600
                }}>
                  $0.0004 / Tx
                </span>
              </div>

              {/* Card 3: EIP-3009 Gasless Relay */}
              <div
                className="glass-panel-dark animate-float"
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  animationDelay: '2.4s'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(193, 255, 114, 0.2)',
                  border: '1px solid #c1ff72',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#090d14',
                  backgroundColor: '#c1ff72',
                  flexShrink: 0
                }}>
                  <CheckCircle2 size={20} strokeWidth={2.5} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f3f4f6' }}>EIP-3009 Gasless Claims</p>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Active</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Solver Pays $0 Gas On Payout</p>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontWeight: 600
                }}>
                  100% Relayed
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Marquee Trust Signal */}
      <div style={{
        marginTop: '60px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '14px 0',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '80px',
          background: 'linear-gradient(to right, #090d14, transparent)',
          zIndex: 2
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '80px',
          background: 'linear-gradient(to left, #090d14, transparent)',
          zIndex: 2
        }} />
        
        <div className="animate-marquee">
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px', paddingRight: '48px', color: '#6b7280', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <span>⚡ CIRCLE ARC L1 MAINNET (CHAIN 5042)</span>
            <span>• CANONICAL USDC GAS</span>
            <span>• MALACHITE BFT SUB-SECOND FINALITY</span>
            <span>• EIP-3009 GASLESS ESCROW</span>
            <span>• AUTONOMOUS AI AGENT SWARM READY</span>
            <span>• GITHUB CI/CD WEBHOOK AUTOMATION</span>
            <span>• CROSS-CHAIN CCTP TELEPORTATION</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px', paddingRight: '48px', color: '#6b7280', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <span>⚡ CIRCLE ARC L1 MAINNET (CHAIN 5042)</span>
            <span>• CANONICAL USDC GAS</span>
            <span>• MALACHITE BFT SUB-SECOND FINALITY</span>
            <span>• EIP-3009 GASLESS ESCROW</span>
            <span>• AUTONOMOUS AI AGENT SWARM READY</span>
            <span>• GITHUB CI/CD WEBHOOK AUTOMATION</span>
            <span>• CROSS-CHAIN CCTP TELEPORTATION</span>
          </div>
        </div>
      </div>
    </section>
  );
}
