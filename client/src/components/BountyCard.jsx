import React from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  Star,
  Zap,
  Palette,
  FileText,
  Code,
  Share2,
  Globe,
  Layers
} from 'lucide-react';

export default function BountyCard({ bounty, onSelect }) {
  // Category theme mapped cleanly to official Circle Arc colors
  const getCategoryTheme = (cat) => {
    switch (cat) {
      case 'DESIGN':
        return { bg: '#f3e8ff', text: '#6b21a8', border: '#000000', label: 'Design' };
      case 'CREATIVE':
      case 'CONTENT':
        return { bg: '#fff7ed', text: '#c2410c', border: '#000000', label: 'Content' };
      case 'DEV':
        return { bg: '#eff6ff', text: '#1d4ed8', border: '#000000', label: 'Development' };
      case 'SOCIAL':
        return { bg: '#fefce8', text: '#a16207', border: '#000000', label: 'All Social' };
      case 'OTHER':
        return { bg: '#fff1f2', text: '#be123c', border: '#000000', label: 'Other' };
      default:
        return { bg: '#fff7ed', text: '#c2410c', border: '#000000', label: 'Content' };
    }
  };

  const theme = getCategoryTheme(bounty.category);

  return (
    <div
      onClick={() => onSelect(bounty)}
      className="bounty-row"
    >
      {/* Left: Sponsor Avatar & Discipline Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '10px',
          background: theme.bg,
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {bounty.category === 'DESIGN' && <Palette size={22} color="#664c88" strokeWidth={2.3} />}
          {bounty.category === 'CONTENT' && <FileText size={22} color="#c2410c" strokeWidth={2.3} />}
          {bounty.category === 'DEV' && <Code size={22} color="#1d4ed8" strokeWidth={2.3} />}
          {bounty.category === 'SOCIAL' && <Share2 size={22} color="#a16207" strokeWidth={2.3} />}
          {bounty.category === 'OTHER' && <Globe size={22} color="#be123c" strokeWidth={2.3} />}
          {!['DESIGN', 'CONTENT', 'DEV', 'SOCIAL', 'OTHER'].includes(bounty.category) && (
            <Layers size={22} color="#1b3158" strokeWidth={2.3} />
          )}
        </div>

        {/* Center: Title & Metadata */}
        <div style={{ minWidth: 0, paddingRight: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: '#000000',
              margin: 0,
              lineHeight: 1.35
            }}>
              {bounty.title}
            </h3>

            {bounty.tags?.includes('Featured') || bounty.amount >= 1200 ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#000000',
                background: 'var(--arc-token-sand)',
                border: '1.5px solid #000000',
                boxShadow: '1.5px 1.5px 0px #000000',
                padding: '1px 7px',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                <Star size={10} fill="#000000" strokeWidth={2} />
                FEATURED
              </span>
            ) : null}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#4b5563' }}>
            {/* Sponsor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#000000' }}>
              <span>{bounty.maintainerName || 'Arc Sponsor'}</span>
              <CheckCircle2 size={13} color="var(--arc-validator-blue)" />
            </div>

            {/* Category Pill */}
            <span style={{
              background: theme.bg,
              color: theme.text,
              border: '1.5px solid #000000',
              boxShadow: '1.5px 1.5px 0px #000000',
              padding: '2px 8px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.72rem',
              textTransform: 'uppercase'
            }}>
              {theme.label}
            </span>

            {/* Deadline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Clock size={12} />
              <span>Due in 10d</span>
            </div>

            {/* Submissions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }} className="desktop-only">
              <MessageSquare size={12} />
              <span>{bounty.status === 'Open' ? 'Open' : '1 review'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Payout Amount & Action Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0, paddingLeft: '12px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
            {/* Circle USDC Symbol */}
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'var(--arc-usdc-blue)',
              color: '#ffffff',
              border: '1.5px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 900
            }}>
              $
            </div>
            <span className="font-space" style={{ fontSize: '1.3rem', fontWeight: 900, color: '#000000' }}>
              ${bounty.amount.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4b5563' }}>USDC</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '4px',
            fontSize: '0.74rem',
            fontWeight: 700,
            marginTop: '2px',
            color: bounty.status === 'Settled' ? '#16a34a' : bounty.status === 'InReview' ? '#d97706' : '#64748b'
          }}>
            {bounty.status === 'Settled' ? (
              <>
                <CheckCircle2 size={12} color="#16a34a" />
                <span>Paid &amp; Settled</span>
              </>
            ) : bounty.status === 'InReview' ? (
              <>
                <Clock size={12} color="#d97706" />
                <span>Under Review</span>
              </>
            ) : (
              <>
                <Zap size={12} color="var(--arc-validator-blue)" />
                <span>0 Gas Payout</span>
              </>
            )}
          </div>
        </div>

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: '#ffffff',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000',
          transition: 'all 0.15s ease'
        }}>
          <ArrowUpRight size={17} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
