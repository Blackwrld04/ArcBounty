import React, { useState } from 'react';
import { Filter, Sparkles, Bot, Search, SlidersHorizontal, ArrowRight, Layers } from 'lucide-react';
import BountyCard from './BountyCard';
import SidebarWidgets from './SidebarWidgets';
import { CREATOR_CATEGORIES } from '../data/initialBounties';

export default function BountyList({
  bounties,
  onSelectBounty,
  stats,
  openCreateModal,
  searchQuery,
  setSearchQuery,
  setActiveTab
}) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('All');

  // Filter logic
  const filteredBounties = bounties.filter((b) => {
    // Category
    if (activeCategory !== 'ALL' && b.category !== activeCategory) {
      return false;
    }
    // Status
    if (activeStatus !== 'All' && b.status !== activeStatus) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchDesc = b.description?.toLowerCase().includes(q);
      const matchCat = b.category?.toLowerCase().includes(q);
      const matchTags = b.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCat || matchTags;
    }
    return true;
  });

  return (
    <section style={{ padding: '24px 0 60px 0' }}>
      <div className="container">

        {/* 70% / 30% Dual Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '36px',
          alignItems: 'start'
        }}>
          {/* Main Feed (Left 70%) */}
          <div>
            {/* Header & Subtabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <div>
                <h2 className="font-space" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#000000', margin: 0, letterSpacing: '-0.02em' }}>
                  Browse Opportunities
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '2px 0 0 0', fontWeight: 600 }}>
                  Showing {filteredBounties.length} open creator tasks across Content, Design, Dev, Social, and Other
                </p>
              </div>

              {/* Status Filter Subtabs (Neo-Brutalist) */}
              <div style={{ display: 'flex', gap: '6px', background: '#ffffff', padding: '4px', borderRadius: '8px', border: '2px solid #000000', boxShadow: '2px 2px 0px #000000' }}>
                {['All', 'Open', 'InReview', 'Settled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setActiveStatus(st)}
                    style={{
                      background: activeStatus === st ? 'var(--arc-protocol-navy)' : 'transparent',
                      color: activeStatus === st ? '#ffffff' : '#000000',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    {st === 'InReview' ? 'In Review' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills (Exact 6 Categories: All Bounties, Content, Design, Development, All Social, Other) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '14px',
              marginBottom: '16px'
            }}>
              {CREATOR_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  id={`filter-category-${cat.id.toLowerCase()}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Bounty Horizontal Rows Stream */}
            {filteredBounties.length > 0 ? (
              <div>
                {filteredBounties.map((bounty) => (
                  <BountyCard
                    key={bounty.id}
                    bounty={bounty}
                    onSelect={onSelectBounty}
                  />
                ))}
              </div>
            ) : (
              <div className="clean-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#000000' }}>
                  No matching bounties found
                </p>
                <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px', fontWeight: 500 }}>
                  Try switching categories or clearing your search filter.
                </p>
                <button
                  onClick={() => { setActiveCategory('ALL'); setActiveStatus('All'); setSearchQuery(''); }}
                  className="btn-secondary"
                  style={{ marginTop: '16px' }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar Widgets (Right 30%) */}
          <div className="desktop-only" style={{ position: 'sticky', top: '90px' }}>
            <SidebarWidgets
              stats={stats}
              onOpenCreate={openCreateModal}
              onOpenSwarm={() => setActiveTab && setActiveTab('swarm')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
