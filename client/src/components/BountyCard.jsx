import React from 'react';
import { ArrowUpRight, Bot, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export default function BountyCard({ bounty, onSelect }) {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'DESIGN': return 'var(--c-pink)';
      case 'VIDEO': return 'var(--c-yellow)';
      case 'WRITING': return 'var(--c-purple)';
      case 'MEMES': return 'var(--c-cyan)';
      case 'DEV': return 'var(--c-emerald)';
      case 'TRANSLATION': return 'var(--c-orange)';
      default: return 'var(--c-lime)';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return (
          <span className="brutal-badge" style={{ background: 'var(--c-lime)', color: '#000' }}>
            🟢 OPEN FOR SUBMISSIONS
          </span>
        );
      case 'InReview':
        return (
          <span className="brutal-badge" style={{ background: 'var(--c-yellow)', color: '#000' }}>
            ⏳ SUBMISSION IN REVIEW
          </span>
        );
      case 'Settled':
        return (
          <span className="brutal-badge" style={{ background: 'var(--c-cyan)', color: '#000' }}>
            ✅ BOUNTY PAID &amp; SETTLED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="brutal-card"
      onClick={() => onSelect(bounty)}
      style={{
        padding: '22px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div>
        {/* Top Header Row: Category sticker & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="brutal-badge"
              style={{
                background: getCategoryColor(bounty.category),
                color: bounty.category === 'DESIGN' || bounty.category === 'WRITING' ? '#ffffff' : '#000000'
              }}
            >
              {bounty.categoryName || bounty.category || 'CREATOR'}
            </span>
            {bounty.isAiEligible && (
              <span className="brutal-badge" style={{ background: '#ffffff', color: '#000' }} title="AI Creators & Agents Allowed">
                <Bot size={13} />
                AI-ELIGIBLE
              </span>
            )}
          </div>
          <div>{getStatusBadge(bounty.status)}</div>
        </div>

        {/* Task Title */}
        <h3 className="font-space" style={{
          fontSize: '1.25rem',
          fontWeight: 900,
          color: '#000000',
          lineHeight: 1.25,
          marginBottom: '10px'
        }}>
          {bounty.title}
        </h3>

        {/* Deliverable info */}
        <div style={{
          background: '#f4f4f0',
          border: '2px solid #000000',
          borderRadius: '6px',
          padding: '6px 10px',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#1f2937',
          marginBottom: '12px',
          display: 'inline-block'
        }}>
          📦 Deliverable: {bounty.submissionType || 'Work URL or Pull Request'}
        </div>

        {/* Description snippet */}
        <p style={{
          fontSize: '0.88rem',
          color: '#4b5563',
          lineHeight: 1.5,
          marginBottom: '16px',
          fontWeight: 500,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {bounty.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
          {bounty.tags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.72rem',
                color: '#000000',
                background: '#ffffff',
                border: '1.5px solid #000000',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 700
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Row: Reward Amount & Action CTA */}
      <div style={{
        paddingTop: '16px',
        borderTop: '2.5px solid #000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Bounty Value */}
        <div>
          <span style={{ fontSize: '0.68rem', color: '#4b5563', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
            USDC REWARD
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span className="font-space" style={{ fontSize: '1.65rem', fontWeight: 900, color: '#000000' }}>
              ${bounty.amount.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#000000', fontWeight: 800, background: 'var(--c-yellow)', padding: '1px 5px', border: '1px solid #000', borderRadius: '4px' }}>
              USDC
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          className="brutal-btn brutal-btn-yellow"
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
        >
          <span>SUBMIT WORK</span>
          <ArrowUpRight size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
