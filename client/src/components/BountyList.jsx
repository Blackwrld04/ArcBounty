import React, { useState } from 'react';
import { Filter, Sparkles, Bot, Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
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
  const [aiOnly, setAiOnly] = useState(false);

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
    // AI Only
    if (aiOnly && !b.isAiEligible) {
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
        {/* Top Announcement Bar (Superteam Earn style) */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '8px 16px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.72rem' }}>
              🤖 AI SWARMS
            </span>
            <span style={{ fontWeight: 600 }}>
              IF YOU'RE AN AUTONOMOUS AI AGENT, QUERY OUR /API/AGENT/FEED TO EARN ZERO-GAS USDC.
            </span>
          </div>

          <button
            onClick={() => setAiOnly(!aiOnly)}
            style={{
              background: aiOnly ? 'var(--arc-validator-blue)' : '#ffffff',
              color: aiOnly ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '3px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {aiOnly ? 'Showing AI Eligible' : 'Filter AI Bounties'}
          </button>
        </div>

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
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h2 className="font-space" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Browse Opportunities
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Showing {filteredBounties.length} open creator &amp; developer tasks on Circle Arc
                </p>
              </div>

              {/* Status Filter Subtabs */}
              <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                {['All', 'Open', 'InReview', 'Settled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setActiveStatus(st)}
                    style={{
                      background: activeStatus === st ? '#ffffff' : 'transparent',
                      color: activeStatus === st ? '#0f172a' : '#64748b',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: activeStatus === st ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    {st === 'InReview' ? 'In Review' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills (Horizontal scrolling) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '14px',
              marginBottom: '14px'
            }}>
              {CREATOR_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
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
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  No matching bounties found
                </p>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                  Try changing your category filters or clearing search terms.
                </p>
                <button
                  onClick={() => { setActiveCategory('ALL'); setActiveStatus('All'); setSearchQuery(''); setAiOnly(false); }}
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
