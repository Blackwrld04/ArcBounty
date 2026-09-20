import React, { useState } from 'react';
import { X, ExternalLink, CheckCircle2, Shield, Clock, Bot, ArrowRight, Zap, Copy, Check, Link as LinkIcon, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { truncateAddress } from '../utils/arc';

export default function BountyDetailModal({
  bounty,
  onClose,
  onSubmitSolution,
  onReleaseBounty,
  wallet
}) {
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#ffffff',
          border: '3px solid #000000',
          boxShadow: '10px 10px 0px #000000',
          borderRadius: '12px',
          position: 'relative',
          padding: '32px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          className="brutal-btn brutal-btn-white"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '38px',
            height: '38px',
            padding: 0,
            borderRadius: '50%'
          }}
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* Top Stickers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span className="brutal-badge" style={{ background: bounty.categoryColor || 'var(--arc-quantum-plum)', color: '#ffffff' }}>
            {bounty.categoryName || bounty.category || 'CREATIVE TASK'}
          </span>
          <span className="brutal-badge" style={{ background: 'var(--arc-token-sand)', color: '#000000' }}>
            📦 {bounty.submissionType || 'Work URL'}
          </span>
          {bounty.isAiEligible && (
            <span className="brutal-badge" style={{ background: 'var(--arc-sky-sync)', color: '#000000' }}>
              <Bot size={13} /> AI CREATORS PERMITTED
            </span>
          )}
        </div>

        {/* Bounty Title */}
        <h2 className="font-space" style={{ fontSize: '1.85rem', fontWeight: 900, color: '#000000', lineHeight: 1.15, marginBottom: '16px' }}>
          {bounty.title}
        </h2>

        {/* Escrow Reward Box (Neo-Brutalist in Arc Sky Sync) */}
        <div style={{
          background: 'var(--arc-sky-sync)',
          border: '3px solid #000000',
          boxShadow: '4px 4px 0px #000000',
          borderRadius: '10px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '26px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#000000', textTransform: 'uppercase' }}>
              LOCKED IN CANONICAL ARC ESCROW
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span className="font-space" style={{ fontSize: '2.4rem', fontWeight: 900, color: '#000000' }}>
                ${bounty.amount.toLocaleString()}
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#000000' }}>USDC</span>
              <span style={{ fontSize: '0.75rem', color: '#1f2937', fontFamily: 'Geist Mono, monospace', fontWeight: 700 }}>
                (0x3600...0000)
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#000000' }}>SPONSOR GUILD</span>
            <p style={{ fontSize: '1rem', fontWeight: 900, color: '#000000' }}>{bounty.maintainerName}</p>
            <p style={{ fontSize: '0.75rem', color: '#4b5563', fontFamily: 'Geist Mono, monospace' }}>
              {truncateAddress(bounty.maintainer)}
            </p>
          </div>
        </div>

        {/* Escrow Lifecycle */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase', marginBottom: '12px' }}>
            ESCROW SETTLEMENT LIFECYCLE
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{
              padding: '12px',
              border: '2.5px solid #000000',
              borderRadius: '8px',
              background: '#ffffff',
              boxShadow: '2px 2px 0px #000000'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, fontSize: '0.82rem' }}>
                <CheckCircle2 size={16} color="#00e676" />
                <span>1. FUNDED</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#4b5563', fontWeight: 600, marginTop: '2px' }}>
                USDC held on Arc Mainnet
              </p>
            </div>

            <div style={{
              padding: '12px',
              border: '2.5px solid #000000',
              borderRadius: '8px',
              background: bounty.status === 'InReview' || bounty.status === 'Settled' ? 'var(--arc-token-sand)' : '#ffffff',
              boxShadow: '2px 2px 0px #000000'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, fontSize: '0.82rem' }}>
                <span>2. DELIVERED</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#4b5563', fontWeight: 600, marginTop: '2px' }}>
                {bounty.status === 'Open' ? 'Awaiting Submission' : 'Work Submitted for Review'}
              </p>
            </div>

            <div style={{
              padding: '12px',
              border: '2.5px solid #000000',
              borderRadius: '8px',
              background: bounty.status === 'Settled' ? 'var(--arc-sky-sync)' : '#ffffff',
              boxShadow: '2px 2px 0px #000000'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, fontSize: '0.82rem' }}>
                <Zap size={16} />
                <span>3. DISBURSED</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#4b5563', fontWeight: 600, marginTop: '2px' }}>
                {bounty.status === 'Settled' ? 'Settled in <400ms' : 'Upon Sponsor Approval'}
              </p>
            </div>
          </div>
        </div>

        {/* Task Description */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase', marginBottom: '8px' }}>
            TASK SPECIFICATION &amp; ACCEPTANCE CRITERIA
          </h4>
          <div style={{
            padding: '18px',
            border: '2.5px solid #000000',
            borderRadius: '8px',
            background: '#f8f8f4',
            fontSize: '0.95rem',
            lineHeight: 1.55,
            color: '#111827',
            fontWeight: 500
          }}>
            {bounty.description}
          </div>
        </div>

        {/* Submitted Work Link */}
        {bounty.prUrl && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px #000000',
            borderRadius: '8px',
            background: 'var(--arc-sky-light)'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#000000' }}>SUBMITTED CREATIVE WORK:</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#000000', marginTop: '2px', wordBreak: 'break-all' }}>
              {bounty.prUrl}
            </p>
            <p style={{ fontSize: '0.78rem', color: '#1f2937', fontWeight: 600, marginTop: '2px' }}>
              Creator: {bounty.solverType || 'Contributor'} ({truncateAddress(bounty.solver)})
            </p>
          </div>
        )}

        {/* Settlement Receipt if Settled */}
        {bounty.status === 'Settled' && (
          <div style={{
            marginBottom: '24px',
            padding: '16px',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px #000000',
            borderRadius: '8px',
            background: 'var(--arc-sky-sync)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000', fontWeight: 900, fontSize: '1rem' }}>
              <Zap size={20} strokeWidth={3} />
              <span>USDC ESCROW DISBURSED ON ARC MAINNET</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#000000', fontWeight: 600, marginTop: '6px' }}>
              Transaction Hash: <code style={{ background: '#fff', border: '1px solid #000', padding: '1px 6px', borderRadius: '4px', fontFamily: 'Geist Mono, monospace' }}>{bounty.settlementTx || '0xarc5042...88ad'}</code>
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => copyHash(bounty.settlementTx || '0xarc5042...88ad')}
                className="brutal-btn brutal-btn-white"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'COPIED' : 'COPY HASH'}</span>
              </button>
              <a
                href={`https://explorer.arc.io/tx/${bounty.settlementTx || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn brutal-btn-sand"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <span>VIEW ON ARCSCAN</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Submission Form if Open */}
        {bounty.status === 'Open' && (
          <form onSubmit={handleSubmitWork} style={{ borderTop: '3px solid #000000', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase', marginBottom: '12px' }}>
              SUBMIT YOUR WORK DELIVERABLE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#000000', display: 'block', marginBottom: '6px' }}>
                  CREATOR TYPE
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSolverType('Human Creator')}
                    className={`brutal-btn ${solverType === 'Human Creator' ? 'brutal-btn-sky' : 'brutal-btn-white'}`}
                    style={{ flex: 1, padding: '8px' }}
                  >
                    🎨 HUMAN CREATOR
                  </button>
                  <button
                    type="button"
                    onClick={() => setSolverType('Autonomous AI Agent')}
                    className={`brutal-btn ${solverType === 'Autonomous AI Agent' ? 'brutal-btn-plum' : 'brutal-btn-white'}`}
                    style={{ flex: 1, padding: '8px' }}
                  >
                    🤖 AUTONOMOUS AI AGENT
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#000000', display: 'block', marginBottom: '6px' }}>
                  DELIVERABLE URL (Figma, Loom, YouTube, X Thread, GitHub, or Drive) *
                </label>
                <input
                  id="submission-url-input"
                  type="url"
                  placeholder="https://figma.com/... or https://x.com/... or https://loom.com/..."
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '3px solid #000000',
                    borderRadius: '8px',
                    boxShadow: '3px 3px 0px #000000',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
              </div>

              <button
                id="submit-work-btn"
                type="submit"
                disabled={isSubmitting || !submissionUrl}
                className="brutal-btn brutal-btn-sand"
                style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '6px' }}
              >
                <span>{isSubmitting ? 'VERIFYING ON ARC...' : 'SUBMIT WORK & ENTER REVIEW'}</span>
                <ArrowRight size={20} strokeWidth={3} />
              </button>
            </div>
          </form>
        )}

        {/* Maintainer Review Button */}
        {bounty.status === 'InReview' && (
          <div style={{ borderTop: '3px solid #000000', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#000000' }}>
                  SPONSOR ACTION: APPROVE &amp; DISBURSE
                </h4>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4b5563' }}>
                  Releases ${bounty.amount} USDC from escrow to creator via sub-second Malachite BFT finality.
                </p>
              </div>
              <span className="brutal-badge" style={{ background: 'var(--arc-token-sand)', color: '#000' }}>
                CREATOR GAS: $0.00
              </span>
            </div>

            <button
              id="approve-disburse-btn"
              onClick={handleRelease}
              disabled={isReleasing}
              className="brutal-btn brutal-btn-gold"
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
            >
              <Zap size={22} strokeWidth={3} />
              <span>{isReleasing ? 'SETTLING ON ARC MAINNET...' : `APPROVE & DISBURSE $${bounty.amount} USDC`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
