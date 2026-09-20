import React from 'react';
import { ArrowUpRight, CheckCircle2, Clock, MessageSquare, Star, Bot, Zap } from 'lucide-react';

export default function BountyCard({ bounty, onSelect }) {
  // Category color configuration (Arc-themed)
  const getCategoryTheme = (cat) => {
    switch (cat) {
      case 'DESIGN':
        return { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff', label: '🎨 Design & 3D' };
      case 'VIDEO':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a', label: '🎬 Video & Motion' };
      case 'WRITING':
        return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', label: '✍️ Writing & Threads' };
      case 'MEMES':
        return { bg: '#fef9c3', text: '#854d0e', border: '#fef08a', label: '🐸 Memes & Social' };
      case 'DEV':
        return { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe', label: '💻 Code & Apps' };
      case 'TRANSLATION':
        return { bg: '#ffe4e6', text: '#9f1239', border: '#fecdd3', label: '🌐 Translation' };
      default:
        return { bg: '#f1f5f9', text: '#334155', border: '#e2e8f0', label: '⚡ Creative Task' };
    }
  };

  const theme = getCategoryTheme(bounty.category);

  return (
    <div
      onClick={() => onSelect(bounty)}
      className="bounty-row"
    >
      {/* Left: Sponsor Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          flexShrink: 0
        }}>
          {bounty.category === 'DESIGN' && '🎨'}
          {bounty.category === 'VIDEO' && '🎬'}
          {bounty.category === 'WRITING' && '✍️'}
          {bounty.category === 'MEMES' && '🐸'}
          {bounty.category === 'DEV' && '💻'}
          {bounty.category === 'TRANSLATION' && '🌐'}
          {!['DESIGN','VIDEO','WRITING','MEMES','DEV','TRANSLATION'].includes(bounty.category) && '⚡'}
        </div>

        {/* Center: Title & Metadata */}
        <div style={{ minWidth: 0, paddingRight: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h3 style={{
              fontSize: '0.98rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              lineHeight: 1.35
            }}>
              {bounty.title}
            </h3>

            {bounty.tags?.includes('Featured') || bounty.amount >= 1200 ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#7c3aed',
                background: '#f3e8ff',
                padding: '1px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                <Star size={10} fill="#7c3aed" />
                FEATURED
              </span>
            ) : null}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#64748b' }}>
            {/* Sponsor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#334155' }}>
              <span>{bounty.maintainerName || 'Arc Sponsor'}</span>
              <CheckCircle2 size={13} color="#2563eb" />
            </div>

            {/* Category Pill */}
            <span style={{
              background: theme.bg,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              padding: '1px 7px',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.72rem'
            }}>
              {theme.label}
            </span>

            {/* Deadline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={12} />
              <span>Due in 10d</span>
            </div>

            {/* Submissions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }} className="desktop-only">
              <MessageSquare size={12} />
              <span>{bounty.status === 'Open' ? 'Open' : '1 review'}</span>
            </div>

            {/* AI Agent badge if eligible */}
            {bounty.isAiEligible && (
              <span className="desktop-only" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--arc-validator-blue)', fontWeight: 600 }}>
                <Bot size={12} />
                <span>AI Eligible</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Payout Amount & Action Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, paddingLeft: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
            {/* Circle USDC Icon */}
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#2775ca',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 900
            }}>
              $
            </div>
            <span className="font-space" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              ${bounty.amount.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>USDC</span>
          </div>

          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: bounty.status === 'Settled' ? '#16a34a' : bounty.status === 'InReview' ? '#d97706' : '#64748b'
          }}>
            {bounty.status === 'Settled' ? '✓ Paid & Settled' : bounty.status === 'InReview' ? '⏳ Under Review' : '0 Gas Payout'}
          </span>
        </div>

        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          transition: 'all 0.15s ease'
        }}>
          <ArrowUpRight size={16} />
        </div>
      </div>
    </div>
  );
}
