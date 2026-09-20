import React, { useState } from 'react';
import { Search, Filter, Sparkles, Bot, Palette, Video, PenTool, Smile, Zap, Globe } from 'lucide-react';
import BountyCard from './BountyCard';
import { CREATOR_CATEGORIES } from '../data/initialBounties';

export default function BountyList({ bounties, onSelectBounty, openCreateModal }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiOnly, setAiOnly] = useState(false);

  const statusOptions = ['All', 'Open', 'InReview', 'Settled'];

  const filteredBounties = bounties.filter((b) => {
    if (activeCategory !== 'ALL' && b.category !== activeCategory) {
      return false;
    }
    if (filterStatus !== 'All' && b.status.toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (aiOnly && !b.isAiEligible) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        (b.repo && b.repo.toLowerCase().includes(q)) ||
        b.description.toLowerCase().includes(q) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <section id="bounties-section" style={{ padding: '40px 0 80px 0', position: 'relative' }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="sticker-tape">CIRCLE ARC L1 · INSTANT ESCROW</span>
            </div>
            <h2 className="font-space" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 900, color: '#000000', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              ACTIVE CREATOR BOUNTIES
            </h2>
            <p style={{ color: '#4b5563', fontSize: '1.05rem', fontWeight: 600, marginTop: '4px' }}>
              Select your specialty, submit deliverables, and claim dollar-stable USDC payouts.
            </p>
          </div>

          <button
            onClick={() => setAiOnly(!aiOnly)}
            className={`brutal-btn ${aiOnly ? 'brutal-btn-lime' : 'brutal-btn-white'}`}
            style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          >
            <Bot size={18} />
            <span>AI AGENT ELIGIBLE ONLY</span>
          </button>
        </div>

        {/* Creator Category Tabs Bar (Brutalist) */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '20px',
          scrollbarWidth: 'none'
        }}>
          {CREATOR_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-${cat.id.toLowerCase()}`}
                onClick={() => setActiveCategory(cat.id)}
                className="brutal-btn"
                style={{
                  background: isSelected ? cat.color : '#ffffff',
                  color: '#000000',
                  padding: '10px 18px',
                  fontSize: '0.88rem',
                  whiteSpace: 'nowrap',
                  border: '3px solid #000000',
                  boxShadow: isSelected ? '6px 6px 0px #000000' : '3px 3px 0px #000000',
                  transform: isSelected ? 'translate(-2px, -2px)' : 'none'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Status Controls */}
        <div className="brutal-card" style={{
          padding: '20px',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Search Row */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={20}
              color="#000000"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              id="bounty-search-input"
              type="text"
              placeholder="Search by keyword, design style, video type, or repo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: '#ffffff',
                border: '3px solid #000000',
                borderRadius: '8px',
                boxShadow: '3px 3px 0px #000000',
                color: '#000000',
                fontSize: '1rem',
                fontWeight: 700,
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Status Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#000000', textTransform: 'uppercase' }}>
                STATUS:
              </span>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  id={`filter-status-${status.toLowerCase()}`}
                  onClick={() => setFilterStatus(status)}
                  className={`brutal-btn ${filterStatus === status ? 'brutal-btn-sand' : 'brutal-btn-white'}`}
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  {status === 'InReview' ? 'IN REVIEW' : status.toUpperCase()}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000000' }}>
              SHOWING <span style={{ background: 'var(--arc-sky-sync)', padding: '2px 6px', border: '1.5px solid #000', borderRadius: '4px' }}>{filteredBounties.length}</span> BOUNTIES
            </div>
          </div>
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
          <div className="brutal-card" style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: 'var(--arc-token-sand)',
            marginTop: '20px'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000000' }}>NO MATCHING BOUNTIES FOUND</h3>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1f2937', marginTop: '6px' }}>
              Try adjusting your category tabs or clearing your search keywords.
            </p>
            <button
              onClick={() => { setActiveCategory('ALL'); setFilterStatus('All'); setSearchQuery(''); setAiOnly(false); }}
              className="brutal-btn brutal-btn-navy"
              style={{ marginTop: '18px' }}
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
