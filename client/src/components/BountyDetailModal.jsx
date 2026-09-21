import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Shield,
  Clock,
  Bot,
  ArrowRight,
  Zap,
  Copy,
  Check,
  Link as LinkIcon,
  FileText,
  User,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { truncateAddress } from '../utils/arc';

export default function BountyDetailModal({
  bounty,
  onClose,
  onSubmitSolution,
  onReleaseBounty,
  wallet,
  user,
  openAuthModal
}) {
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [payoutWallet, setPayoutWallet] = useState(wallet.address || user?.address || '');
  const [notes, setNotes] = useState('');
  const [solverType, setSolverType] = useState('Human Creator');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!bounty) return null;

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!submissionUrl) return;
    setIsSubmitting(true);
    await onSubmitSolution(bounty.id, submissionUrl, payoutWallet || wallet.address || user?.address, solverType, notes);
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
          borderRadius: '14px',
          border: 'var(--border-thick)',
          boxShadow: 'var(--shadow-hard)',
          padding: '32px',
          position: 'relative',
          background: '#ffffff'
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
            background: '#ffffff',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.1s ease'
          }}
        >
          <X size={18} color="#000000" />
        </button>

        {/* Top Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            background: 'var(--arc-sky-sync)',
            color: '#000000',
            border: '1.5px solid #000000',
            boxShadow: '1.5px 1.5px 0px #000000',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            {bounty.categoryName || bounty.category || 'CREATIVE TASK'}
          </span>
          <span style={{
            background: '#ffffff',
            color: '#000000',
            border: '1.5px solid #000000',
            boxShadow: '1.5px 1.5px 0px #000000',
            padding: '3px 10px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Package size={13} strokeWidth={2.2} />
            <span>{bounty.submissionType || 'Work Deliverable'}</span>
          </span>
          {bounty.isAiEligible && (
            <span style={{
              background: 'var(--arc-token-sand)',
              color: '#000000',
              border: '1.5px solid #000000',
              boxShadow: '1.5px 1.5px 0px #000000',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Bot size={13} strokeWidth={2.2} />
              <span>AI Swarm Permitted</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-space" style={{ fontSize: '1.65rem', fontWeight: 900, color: '#000000', lineHeight: 1.25, marginBottom: '18px' }}>
          {bounty.title}
        </h2>

        {/* Escrow Reward Banner (Neo-Brutalist) */}
        <div style={{
          background: 'var(--arc-static-ether)',
          border: '2px solid #000000',
          boxShadow: '3.5px 3.5px 0px #000000',
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
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arc-protocol-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              CANONICAL CIRCLE USDC ESCROW
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span className="font-space" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#000000' }}>
                ${bounty.amount.toLocaleString()}
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#4b5563' }}>USDC</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'Geist Mono, monospace' }}>
                (0x3600...0000)
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SPONSOR GUILD</span>
            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#000000', margin: '2px 0 0 0' }}>
              {bounty.maintainerName || 'Arc Creator DAO'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'Geist Mono, monospace', margin: 0 }}>
              {truncateAddress(bounty.maintainer)}
            </p>
          </div>
        </div>

        {/* Escrow Timeline */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
            SETTLEMENT LIFECYCLE
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#ffffff', border: '2px solid #000000', boxShadow: '2px 2px 0px #000000' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#16a34a' }}>
                <CheckCircle2 size={15} />
                <span>1. Funded</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#4b5563', margin: '2px 0 0 0', fontWeight: 600 }}>Locked in Arc Escrow</p>
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: bounty.status === 'InReview' || bounty.status === 'Settled' ? 'var(--arc-token-sand)' : '#ffffff',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#000000' }}>
                <Clock size={15} />
                <span>2. Delivered</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#4b5563', margin: '2px 0 0 0', fontWeight: 600 }}>
                {bounty.status === 'Open' ? 'Awaiting Submission' : 'In Review'}
              </p>
            </div>

            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: bounty.status === 'Settled' ? '#bbf7d0' : '#ffffff',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.82rem', color: '#000000' }}>
                <Zap size={14} />
                <span>3. Disbursed</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#4b5563', margin: '2px 0 0 0', fontWeight: 600 }}>
                {bounty.status === 'Settled' ? '<400ms Finality' : 'Upon Approval'}
              </p>
            </div>
          </div>
        </div>

        {/* Specifications & Acceptance Criteria */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            SPECIFICATIONS &amp; ACCEPTANCE CRITERIA
          </h4>
          <div style={{
            padding: '18px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: '#1f2937',
            whiteSpace: 'pre-line'
          }}>
            {bounty.description}
          </div>
        </div>

        {/* Submitted Work Link */}
        {bounty.prUrl && (
          <div style={{
            marginBottom: '24px',
            padding: '16px 18px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--arc-validator-blue)' }}>SUBMITTED DELIVERABLE</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <a
                href={bounty.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#000000', fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>{bounty.prUrl}</span>
                <ExternalLink size={14} />
              </a>
              <span style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: 600 }}>
                By: {truncateAddress(bounty.solver)} ({bounty.solverType || 'Creator'})
              </span>
            </div>
          </div>
        )}

        {/* Settlement Transaction Proof if Settled */}
        {bounty.status === 'Settled' && bounty.settlementTx && (
          <div style={{
            marginBottom: '24px',
            padding: '16px 18px',
            borderRadius: '10px',
            background: '#bbf7d0',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534' }}>CIRCLE ARC MAINNET SETTLEMENT PROOF</span>
                <p style={{ fontFamily: 'Geist Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: '#000000', margin: '4px 0 0 0' }}>
                  {bounty.settlementTx}
                </p>
              </div>
              <button
                onClick={() => copyHash(bounty.settlementTx)}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #000000',
                  boxShadow: '1.5px 1.5px 0px #000000',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
              >
                {copied ? 'Copied' : 'Copy Tx'}
              </button>
            </div>
          </div>
        )}

        {/* Submission Form / Guest Action (If open) */}
        {bounty.status === 'Open' && (
          <div style={{ borderTop: '2px solid #000000', paddingTop: '22px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#000000', marginBottom: '14px' }}>
              Submit Your Deliverable
            </h3>

            {!user ? (
              <div style={{
                background: 'var(--arc-static-ether)',
                border: '2px solid #000000',
                boxShadow: '2.5px 2.5px 0px #000000',
                borderRadius: '10px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: '#000000', marginBottom: '6px' }}>
                  Sign in or create an account to submit work
                </p>
                <p style={{ fontSize: '0.82rem', color: '#4b5563', marginBottom: '18px', maxWidth: '440px', margin: '0 auto 18px auto', fontWeight: 500 }}>
                  Join thousands of creators earning canonical USDC on Circle Arc. Submit your deliverable and get paid with zero gas fees.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => { onClose(); openAuthModal && openAuthModal('signup'); }}
                    className="btn-accent"
                    style={{ padding: '10px 22px', fontSize: '0.88rem' }}
                  >
                    <span>Sign Up to Submit</span>
                    <ArrowRight size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => { onClose(); openAuthModal && openAuthModal('login'); }}
                    className="btn-secondary"
                    style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                  >
                    <span>Log In</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitWork}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#000000', display: 'block', marginBottom: '6px' }}>
                      CREATOR TYPE
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setSolverType('Human Creator')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: '2px solid #000000',
                          background: solverType === 'Human Creator' ? 'var(--arc-sky-sync)' : '#ffffff',
                          boxShadow: solverType === 'Human Creator' ? '2.5px 2.5px 0px #000000' : 'none',
                          fontWeight: 800,
                          fontSize: '0.84rem',
                          color: '#000000',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <User size={15} strokeWidth={2.2} />
                        <span>Human Creator</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSolverType('Autonomous AI Agent')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: '2px solid #000000',
                          background: solverType === 'Autonomous AI Agent' ? 'var(--arc-token-sand)' : '#ffffff',
                          boxShadow: solverType === 'Autonomous AI Agent' ? '2.5px 2.5px 0px #000000' : 'none',
                          fontWeight: 800,
                          fontSize: '0.84rem',
                          color: '#000000',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Bot size={15} strokeWidth={2.2} />
                        <span>Autonomous AI Agent</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#000000', display: 'block', marginBottom: '6px' }}>
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
                        borderRadius: '8px',
                        border: '2px solid #000000',
                        boxShadow: '2px 2px 0px #000000',
                        fontSize: '0.92rem',
                        outline: 'none',
                        fontWeight: 600
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#000000', display: 'block', marginBottom: '6px' }}>
                      YOUR PAYOUT WALLET ADDRESS (Circle Arc L1) *
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={payoutWallet}
                      onChange={(e) => setPayoutWallet(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '2px solid #000000',
                        boxShadow: '2px 2px 0px #000000',
                        fontSize: '0.92rem',
                        outline: 'none',
                        fontFamily: 'monospace',
                        fontWeight: 600
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#000000', display: 'block', marginBottom: '6px' }}>
                      SUBMISSION NOTES / PROOF DETAILS
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain how your deliverable satisfies the bounty acceptance criteria..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '2px solid #000000',
                        boxShadow: '2px 2px 0px #000000',
                        fontSize: '0.9rem',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !submissionUrl}
                    className="btn-accent"
                    style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
                  >
                    <span>{isSubmitting ? 'Verifying on Arc...' : 'Submit Work for Review'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Sponsor Review & Release Button */}
        {bounty.status === 'InReview' && (
          <div style={{ borderTop: '2px solid #000000', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#000000', margin: 0 }}>
                  Sponsor Action: Approve &amp; Disburse
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: '2px 0 0 0', fontWeight: 600 }}>
                  Releases ${bounty.amount} USDC from escrow to creator with zero creator gas fees.
                </p>
              </div>

              <span style={{ fontSize: '0.75rem', background: '#bbf7d0', color: '#166534', border: '1.5px solid #000000', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                CREATOR GAS: $0.00
              </span>
            </div>

            <button
              onClick={handleRelease}
              disabled={isReleasing}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
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
