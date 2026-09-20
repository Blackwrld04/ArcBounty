import React, { useState } from 'react';
import { X, ExternalLink, GitPullRequest, CheckCircle2, Shield, Clock, Bot, ArrowRight, Zap, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { truncateAddress } from '../utils/arc';

export default function BountyDetailModal({
  bounty,
  onClose,
  onSubmitSolution,
  onReleaseBounty,
  wallet
}) {
  const [prInput, setPrInput] = useState('');
  const [solverType, setSolverType] = useState('Human Developer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!bounty) return null;

  const handleSubmitPr = async (e) => {
    e.preventDefault();
    if (!prInput) return;
    setIsSubmitting(true);
    await onSubmitSolution(bounty.id, prInput, wallet.address, solverType);
    setIsSubmitting(false);
  };

  const handleRelease = async () => {
    setIsReleasing(true);
    await onReleaseBounty(bounty.id);
    setIsReleasing(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel-dark animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          padding: '32px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#9ca3af',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
        >
          <X size={20} />
        </button>

        {/* Top Info: Repo & Escrow Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.82rem',
            color: '#9ca3af',
            fontFamily: 'Geist Mono, monospace',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '4px 10px',
            borderRadius: '8px'
          }}>
            {bounty.repo}
          </span>
          <a
            href={bounty.issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.8rem',
              color: '#00f2fe',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none'
            }}
          >
            <span>GitHub Issue</span>
            <ExternalLink size={13} />
          </a>
          {bounty.isAiEligible && (
            <span style={{
              fontSize: '0.75rem',
              color: '#c1ff72',
              background: 'rgba(193, 255, 114, 0.12)',
              border: '1px solid rgba(193, 255, 114, 0.25)',
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Bot size={13} />
              AI-Agent Eligible
            </span>
          )}
        </div>

        {/* Bounty Title */}
        <h2 className="font-space" style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: '16px' }}>
          {bounty.title}
        </h2>

        {/* Reward Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(193, 255, 114, 0.08) 0%, rgba(0, 242, 254, 0.05) 100%)',
          border: '1px solid rgba(193, 255, 114, 0.3)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Locked in Circle Arc Escrow
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span className="font-space" style={{ fontSize: '2rem', fontWeight: 800, color: '#c1ff72' }}>
                ${bounty.amount.toLocaleString()}
              </span>
              <span style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>USDC</span>
              <span style={{ fontSize: '0.78rem', color: '#6b7280', fontFamily: 'Geist Mono, monospace' }}>
                (0x3600...0000)
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Sponsored by</span>
            <p style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>{bounty.maintainerName}</p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'Geist Mono, monospace' }}>
              {truncateAddress(bounty.maintainer)}
            </p>
          </div>
        </div>

        {/* Escrow Timeline */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '0.85rem', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            Escrow Settlement Lifecycle
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {/* Step 1 */}
            <div style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                <span>1. Funded</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>
                USDC locked on Arc Mainnet
              </p>
            </div>

            {/* Step 2 */}
            <div style={{
              padding: '14px',
              borderRadius: '12px',
              background: bounty.status === 'InReview' || bounty.status === 'Settled'
                ? 'rgba(234, 179, 8, 0.1)'
                : 'rgba(255, 255, 255, 0.03)',
              border: bounty.status === 'InReview' || bounty.status === 'Settled'
                ? '1px solid rgba(234, 179, 8, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: bounty.status === 'InReview' || bounty.status === 'Settled' ? '#eab308' : '#6b7280',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                <GitPullRequest size={16} />
                <span>2. Solution</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>
                {bounty.status === 'Open' ? 'Awaiting PR' : 'PR Submitted for Review'}
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              padding: '14px',
              borderRadius: '12px',
              background: bounty.status === 'Settled'
                ? 'rgba(193, 255, 114, 0.15)'
                : 'rgba(255, 255, 255, 0.03)',
              border: bounty.status === 'Settled'
                ? '1px solid #c1ff72'
                : '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: bounty.status === 'Settled' ? '#c1ff72' : '#6b7280',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                <Zap size={16} />
                <span>3. Disbursed</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>
                {bounty.status === 'Settled' ? 'Settled (<400ms)' : 'Upon Maintainer Merge'}
              </p>
            </div>
          </div>
        </div>

        {/* Task Specification */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '0.85rem', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Task Description & Acceptance Criteria
          </h4>
          <div style={{
            padding: '18px',
            borderRadius: '14px',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: '#d1d5db'
          }}>
            {bounty.description}
          </div>
        </div>

        {/* PR Details if Submitted */}
        {bounty.prUrl && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#00f2fe', fontWeight: 600 }}>SUBMITTED PULL REQUEST</span>
                <p style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 500, marginTop: '2px' }}>
                  {bounty.prUrl}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                  By: {bounty.solverType || 'Contributor'} ({truncateAddress(bounty.solver)})
                </p>
              </div>
              <a
                href={bounty.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'rgba(0, 242, 254, 0.15)',
                  color: '#00f2fe',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>View PR</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}

        {/* Settlement Receipt if Settled */}
        {bounty.status === 'Settled' && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(193, 255, 114, 0.08)',
            border: '1px solid #c1ff72'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c1ff72', fontWeight: 700, fontSize: '0.9rem' }}>
              <Zap size={18} />
              <span>USDC Escrow Disbursed on Arc Mainnet</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '6px' }}>
              Settlement Hash: <code style={{ color: '#c1ff72', fontFamily: 'Geist Mono, monospace' }}>{bounty.settlementTx || '0xarc5042...88ad'}</code>
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => copyHash(bounty.settlementTx || '0xarc5042...88ad')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                {copied ? <Check size={12} color="#c1ff72" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy Hash'}</span>
              </button>
              <a
                href={`https://explorer.arc.io/tx/${bounty.settlementTx || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#00f2fe',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none'
                }}
              >
                <span>View on ArcScan</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        {/* Action Forms based on Bounty Status */}
        {bounty.status === 'Open' && (
          <form onSubmit={handleSubmitPr} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600, marginBottom: '10px' }}>
              Submit Pull Request for Review
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                  Contributor Profile Type
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSolverType('Human Developer')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: solverType === 'Human Developer' ? '#c1ff72' : 'rgba(255, 255, 255, 0.05)',
                      color: solverType === 'Human Developer' ? '#090d14' : '#9ca3af',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    Human Developer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSolverType('Autonomous AI Agent')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: solverType === 'Autonomous AI Agent' ? '#00f2fe' : 'rgba(255, 255, 255, 0.05)',
                      color: solverType === 'Autonomous AI Agent' ? '#090d14' : '#9ca3af',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    Autonomous AI Agent
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                  GitHub Pull Request Link
                </label>
                <input
                  id="pr-url-input"
                  type="url"
                  placeholder="https://github.com/circlefin/arc-consensus/pull/12"
                  value={prInput}
                  onChange={(e) => setPrInput(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                id="submit-pr-btn"
                type="submit"
                disabled={isSubmitting || !prInput}
                className="glass-button"
                style={{
                  marginTop: '8px',
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#c1ff72',
                  border: 'none',
                  color: '#090d14',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isSubmitting || !prInput ? 0.6 : 1
                }}
              >
                <span>{isSubmitting ? 'Verifying on Arc...' : 'Submit PR & Enter Review'}</span>
                <ArrowRight size={18} />
                <div className="button-shine" />
              </button>
            </div>
          </form>
        )}

        {/* Maintainer Review & Disburse Button */}
        {bounty.status === 'InReview' && (
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                  Maintainer Action: Approve & Disburse
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                  Releases ${bounty.amount} USDC from escrow directly to solver with EIP-3009 gasless relayer.
                </p>
              </div>
              <span style={{
                fontSize: '0.72rem',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                Solver Gas: $0.00
              </span>
            </div>

            <button
              id="approve-disburse-btn"
              onClick={handleRelease}
              disabled={isReleasing}
              className="glass-button"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #c1ff72 0%, #10b981 100%)',
                border: 'none',
                color: '#090d14',
                fontWeight: 700,
                fontSize: '0.98rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Zap size={18} />
              <span>{isReleasing ? 'Executing Sub-Second Arc Settlement...' : `Approve & Release $${bounty.amount} USDC`}</span>
              <div className="button-shine" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
