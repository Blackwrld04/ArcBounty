import React, { useState } from 'react';
import { Search, Filter, Sparkles, Bot } from 'lucide-react';
import BountyCard from './BountyCard';

export default function BountyList({ bounties, onSelectBounty, openCreateModal }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTag, setFilterTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiOnly, setAiOnly] = useState(false);

  const statusOptions = ['All', 'Open', 'InReview', 'Settled'];
  const tagOptions = ['All', 'Rust', 'Solidity', 'TypeScript', 'AI Agent', 'Mobile', 'Security'];

  const filteredBounties = bounties.filter((b) => {
    if (filterStatus !== 'All' && b.status.toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (filterTag !== 'All' && !b.tags.some((t) => t.toLowerCase() === filterTag.toLowerCase())) {
      return false;
    }
    if (aiOnly && !b.isAiEligible) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.repo.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section id="bounties-section" style={{ padding: '60px 0', position: 'relative' }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c1ff72', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              <Sparkles size={14} />
              <span>Verified Escrow Vault</span>
            </div>
            <h2 className="font-space" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Explore Arc Developer Tasks
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginTop: '4px' }}>
              Solve issues, submit PR proofs, and receive instant dollar-denominated USDC.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setAiOnly(!aiOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '999px',
                background: aiOnly ? 'rgba(193, 255, 114, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: aiOnly ? '1px solid #c1ff72' : '1px solid rgba(255, 255, 255, 0.1)',
                color: aiOnly ? '#c1ff72' : '#d1d5db',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Bot size={16} />
              <span>AI Agent Eligible Only</span>
            </button>
          </div>
        </div>

        {/* Controls: Search Bar & Filters */}
        <div className="glass-panel" style={{
          padding: '18px 24px',
          borderRadius: '18px',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Search Row */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={18}
              color="#6b7280"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              id="bounty-search-input"
              type="text"
              placeholder="Search by issue title, repository (e.g. circlefin), or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(193, 255, 114, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            {/* Status Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, marginRight: '4px' }}>
                STATUS:
              </span>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  id={`filter-status-${status.toLowerCase()}`}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: filterStatus === status ? '#c1ff72' : 'rgba(255, 255, 255, 0.05)',
                    color: filterStatus === status ? '#090d14' : '#9ca3af',
                    border: filterStatus === status ? '1px solid #c1ff72' : '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.2s'
                  }}
                >
                  {status === 'InReview' ? 'In Review' : status}
                </button>
              ))}
            </div>

            {/* Tag Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, marginRight: '4px' }}>
                STACK:
              </span>
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  id={`filter-tag-${tag.toLowerCase()}`}
                  onClick={() => setFilterTag(tag)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: filterTag === tag ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: filterTag === tag ? '#00f2fe' : '#9ca3af',
                    border: filterTag === tag ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.06)',
                    transition: 'all 0.2s'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', color: '#9ca3af', fontSize: '0.85rem' }}>
          <span>
            Showing <strong style={{ color: '#ffffff' }}>{filteredBounties.length}</strong> tasks on Arc L1
          </span>
          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            Escrow settled in Canonical USDC (0x3600...0000)
          </span>
        </div>

        {/* Bounty Grid */}
        {filteredBounties.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {filteredBounties.map((bounty) => (
              <BountyCard
                key={bounty.id}
                bounty={bounty}
                onSelect={onSelectBounty}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{
            padding: '60px 20px',
            textAlign: 'center',
            borderRadius: '20px',
            marginTop: '20px'
          }}>
            <p style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 600 }}>No matching bounties found</p>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginTop: '6px' }}>Try resetting your filter parameters or search query.</p>
            <button
              onClick={() => { setFilterStatus('All'); setFilterTag('All'); setSearchQuery(''); setAiOnly(false); }}
              style={{
                marginTop: '18px',
                padding: '10px 20px',
                borderRadius: '999px',
                background: '#c1ff72',
                color: '#090d14',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
