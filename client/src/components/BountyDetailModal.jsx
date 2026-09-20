import React, { useState } from 'react';
import { X, ExternalLink, CheckCircle2, Shield, Clock, Bot, ArrowRight, Zap, Copy, Check, Link as LinkIcon, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { truncateAddress } from '../utils/arc';

export default function BountyDetailModal({
  bounty,
  onClose,
  onSubmitSolution,
  onReleaseBounty,
  wallet,
  user
}) {
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [solverType, setSolverType] = useState('Human Creator');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!bounty) return null;

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!submissionUrl) return;
    setIsSubmitting(true);
    await onSubmitSolution(bounty.id, submissionUrl, wallet.address, solverType);
    setIsSubmitting(false);
  };

  const handleRelease = async () => {
    setIsReleasing(true);
    await onReleaseBounty(bounty.id);
    setIsReleasing(false);
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="clean-card"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '18px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          padding: '32px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} color="#64748b" />
        </button>

        {/* Top Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            {bounty.categoryName || bounty.category || 'CREATIVE TASK'}
          </span>
          <span style={{
            background: '#f1f5f9',
            color: '#475569',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600
          }}>
            📦 {bounty.submissionType || 'Work Deliverable'}
          </span>
          {bounty.isAiEligible && (
            <span style={{
              background: '#ede9fe',
              color: '#7c3aed',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Bot size={13} /> AI Swarm Permitted
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-space" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '18px' }}>
          {bounty.title}
        </h2>

        {/* Escrow Reward Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '26px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              CANONICAL CIRCLE USDC ESCROW
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span className="font-space" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>
                ${bounty.amount.toLocaleString()}
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#64748b' }}>USDC</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'Geist Mono, monospace' }}>
                (0x3600...0000)
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>SPONSOR GUILD</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '2px 0 0 0' }}>
              {bounty.maintainerName || 'Arc Creator DAO'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'Geist Mono, monospace', margin: 0 }}>
              {truncateAddress(bounty.maintainer)}
            </p>
          </div>
        </div>

        {/* Escrow Timeline */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
            SETTLEMENT LIFECYCLE
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.82rem', color: '#16a34a' }}>
                <CheckCircle2 size={15} />
                <span>1. Funded</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0' }}>Locked in Arc Escrow</p>
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: bounty.status === 'InReview' || bounty.status === 'Settled' ? '#fef3c7' : '#f8fafc',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.82rem', color: bounty.status === 'InReview' || bounty.status === 'Settled' ? '#b45309' : '#64748b' }}>
                <span>2. Delivered</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {bounty.status === 'Open' ? 'Awaiting Submission' : 'In Review'}
              </p>
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: bounty.status === 'Settled' ? '#dcfce7' : '#f8fafc',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.82rem', color: bounty.status === 'Settled' ? '#16a34a' : '#64748b' }}>
                <Zap size={14} />
                <span>3. Disbursed</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0' }}>
                {bounty.status === 'Settled' ? '<400ms Finality' : 'Upon Approval'}
              </p>
            </div>
          </div>
        </div>

        {/* Specifications & Acceptance Criteria */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            SPECIFICATIONS &amp; ACCEPTANCE CRITERIA
          </h4>
          <div style={{
            padding: '18px',
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: '#334155'
          }}>
            {bounty.description}
          </div>
        </div>

        {/* Submitted Work Link */}
        {bounty.prUrl && (
          <div style={{
            marginBottom: '24px',
            padding: '16px 18px',
            borderRadius: '12px',
            background: '#e0f2fe',
            border: '1px solid #bae6fd'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1' }}>SUBMITTED DELIVERABLE</span>
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
              <a href={bounty.prUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--arc-validator-blue)', textDecoration: 'underline' }}>
                {bounty.prUrl}
              </a>
            </p>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Creator: {bounty.solverType || 'Contributor'} ({truncateAddress(bounty.solver)})
            </p>
          </div>
        )}

        {/* Settlement Receipt if Settled */}
        {bounty.status === 'Settled' && (
          <div style={{
            marginBottom: '24px',
            padding: '18px',
            borderRadius: '12px',
            background: '#dcfce7',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 800, fontSize: '0.95rem' }}>
              <Zap size={18} />
              <span>USDC Escrow Disbursed on Circle Arc Mainnet</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155', margin: '6px 0 0 0' }}>
              Transaction Hash: <code style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '1px 6px', borderRadius: '4px', fontFamily: 'Geist Mono, monospace' }}>{bounty.settlementTx || '0xarc5042...88ad'}</code>
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button
                onClick={() => copyHash(bounty.settlementTx || '0xarc5042...88ad')}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy Hash'}</span>
              </button>
              <a
                href={`https://explorer.arc.io/tx/${bounty.settlementTx || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
              >
                <span>View on ArcScan</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Submission Form if Open */}
        {bounty.status === 'Open' && (
          <form onSubmit={handleSubmitWork} style={{ borderTop: '1px solid #e2e8f0', paddingTop: '22px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
              Submit Your Work Deliverable
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  CREATOR TYPE
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSolverType('Human Creator')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: solverType === 'Human Creator' ? '1.5px solid var(--arc-protocol-navy)' : '1px solid #cbd5e1',
                      background: solverType === 'Human Creator' ? '#f1f5f9' : '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    🎨 Human Creator
                  </button>

                  <button
                    type="button"
                    onClick={() => setSolverType('Autonomous AI Agent')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: solverType === 'Autonomous AI Agent' ? '1.5px solid var(--arc-protocol-navy)' : '1px solid #cbd5e1',
                      background: solverType === 'Autonomous AI Agent' ? '#f1f5f9' : '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      color: '#0f172a',
                      cursor: 'pointer'
                    }}
                  >
                    🤖 Autonomous AI Agent
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  DELIVERABLE URL (Figma, Loom, YouTube, X Thread, GitHub, or Drive) *
                </label>
                <input
                  type="url"
                  placeholder="https://figma.com/... or https://x.com/... or https://github.com/..."
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !submissionUrl}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: '10px', background: '#10b981' }}
              >
                <span>{isSubmitting ? 'Verifying on Arc...' : 'Submit Work for Review'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* Sponsor Review & Release Button */}
        {bounty.status === 'InReview' && (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Sponsor Action: Approve &amp; Disburse
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Releases ${bounty.amount} USDC from escrow to creator with zero creator gas fees.
                </p>
              </div>

              <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#16a34a', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                CREATOR GAS: $0.00
              </span>
            </div>

            <button
              onClick={handleRelease}
              disabled={isReleasing}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '10px', background: 'var(--arc-blockstream-gold)' }}
            >
              <Zap size={18} />
              <span>{isReleasing ? 'Settling on Arc Mainnet...' : `Approve & Disburse $${bounty.amount} USDC`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
