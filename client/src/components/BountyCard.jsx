import React from 'react';
import { GitPullRequest, Bot, Clock, ArrowUpRight, DollarSign, CheckCircle2 } from 'lucide-react';
import { formatUsdc } from '../utils/arc';

export default function BountyCard({ bounty, onSelect }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return (
          <span style={{
            fontSize: '0.72rem',
            padding: '3px 9px',
            borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            Open
          </span>
        );
      case 'InReview':
        return (
          <span style={{
            fontSize: '0.72rem',
            padding: '3px 9px',
            borderRadius: '999px',
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            color: '#eab308',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308' }} />
            PR in Review
          </span>
        );
      case 'Settled':
        return (
          <span style={{
            fontSize: '0.72rem',
            padding: '3px 9px',
            borderRadius: '999px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60a5fa',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <CheckCircle2 size={12} />
            Settled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="spotlight-card"
      onMouseMove={handleMouseMove}
      onClick={() => onSelect(bounty)}
      style={{
        padding: '24px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div>
        {/* Top Header Row: Repo & Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.78rem',
              color: '#9ca3af',
              fontFamily: 'Geist Mono, monospace',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {bounty.repo}
            </span>
            {bounty.isAiEligible && (
              <span style={{
                fontSize: '0.7rem',
                color: '#c1ff72',
                background: 'rgba(193, 255, 114, 0.12)',
                border: '1px solid rgba(193, 255, 114, 0.25)',
                padding: '2px 7px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }} title="Autonomous AI Agents Permitted">
                <Bot size={12} />
                AI-Ready
              </span>
            )}
          </div>
          <div>{getStatusBadge(bounty.status)}</div>
        </div>

        {/* Issue Title */}
        <h3 className="font-space" style={{
          fontSize: '1.18rem',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.35,
          marginBottom: '10px'
        }}>
          {bounty.title}
        </h3>

        {/* Description snippet */}
        <p style={{
          fontSize: '0.85rem',
          color: '#9ca3af',
          lineHeight: 1.55,
          marginBottom: '18px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {bounty.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {bounty.tags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: '0.72rem',
                color: '#d1d5db',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 500
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Row: Reward Amount & Action CTA */}
      <div style={{
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Bounty Value */}
        <div>
          <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Escrow Reward
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span className="font-space" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#c1ff72' }}>
              ${bounty.amount.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontFamily: 'Geist Mono, monospace' }}>
              USDC
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
            padding: '8px 14px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#c1ff72';
            e.currentTarget.style.color = '#090d14';
            e.currentTarget.style.borderColor = '#c1ff72';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          }}
        >
          <span>View Task</span>
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}
