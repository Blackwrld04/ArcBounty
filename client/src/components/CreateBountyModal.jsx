import React, { useState } from 'react';
import { X, DollarSign, Calendar, Sparkles, ArrowRight, Bot } from 'lucide-react';
import { CREATOR_CATEGORIES } from '../data/initialBounties';

export default function CreateBountyModal({ onClose, onCreateBounty, wallet }) {
  const [category, setCategory] = useState('DESIGN');
  const [title, setTitle] = useState('');
  const [submissionType, setSubmissionType] = useState('Figma / 3D Render Link');
  const [amount, setAmount] = useState('500');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['Design', 'Arc']);
  const [deadlineDays, setDeadlineDays] = useState('14');
  const [isAiEligible, setIsAiEligible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const availableCategories = CREATOR_CATEGORIES.filter((c) => c.id !== 'ALL');

  const deliverableOptions = [
    'Figma / 3D Render Link',
    'Video (Loom, YouTube, TikTok, MP4)',
    'Twitter/X Mega-Thread or Article',
    'Memes / Image / Sticker Set',
    'GitHub Pull Request / Live App',
    'Markdown / Docs Translation',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    setIsLoading(true);
    const catObj = CREATOR_CATEGORIES.find((c) => c.id === category) || CREATOR_CATEGORIES[1];

    await onCreateBounty({
      title,
      category,
      categoryName: catObj.label.replace(/^[^\s]+\s/, ''),
      categoryColor: catObj.color,
      submissionType,
      issueUrl: `https://arcbounty.io/task/${Date.now().toString().slice(-4)}`,
      amount: parseFloat(amount),
      description: description || 'Deliver high quality creative work satisfying requirements.',
      tags: tags.length > 0 ? tags : ['Creator', 'Arc'],
      deadlineDays: parseInt(deadlineDays, 10),
      isAiEligible,
      maintainer: wallet.address,
    });
    setIsLoading(false);
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
          maxWidth: '680px',
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
        <button
          id="close-create-modal-btn"
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

        <span className="sticker-tape" style={{ marginBottom: '10px' }}>
          CREATOR ESCROW STUDIO
        </span>

        <h2 className="font-space" style={{ fontSize: '1.9rem', fontWeight: 900, color: '#000000', marginBottom: '6px' }}>
          POST A CREATOR BOUNTY
        </h2>
        <p style={{ color: '#4b5563', fontSize: '0.95rem', fontWeight: 600, marginBottom: '22px' }}>
          Lock USDC in Circle Arc Escrow. Payout is instantly disbursed when you approve the deliverable.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Category Picker */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', display: 'block', marginBottom: '8px' }}>
              CHOOSE CREATOR CATEGORY *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {availableCategories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className="brutal-btn"
                  style={{
                    background: category === c.id ? c.color : '#ffffff',
                    color: category === c.id ? (c.textColor || '#000000') : '#000000',
                    padding: '8px',
                    fontSize: '0.78rem',
                    border: '2.5px solid #000000',
                    boxShadow: category === c.id ? '4px 4px 0px #000' : '2px 2px 0px #000'
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', display: 'block', marginBottom: '6px' }}>
              TASK TITLE *
            </label>
            <input
              id="create-bounty-title-input"
              type="text"
              placeholder="e.g. Design 3D Mascot for Circle Arc, or Create 60s Viral Video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '3px solid #000000',
                borderRadius: '8px',
                boxShadow: '3px 3px 0px #000000',
                fontSize: '0.95rem',
                fontWeight: 700,
                outline: 'none'
              }}
            />
          </div>

          {/* Deliverable Type */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', display: 'block', marginBottom: '6px' }}>
              EXPECTED DELIVERABLE TYPE *
            </label>
            <select
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '3px solid #000000',
                borderRadius: '8px',
                boxShadow: '3px 3px 0px #000000',
                fontSize: '0.9rem',
                fontWeight: 700,
                background: '#ffffff',
                outline: 'none'
              }}
            >
              {deliverableOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Reward Amount & Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', display: 'block', marginBottom: '6px' }}>
                USDC REWARD AMOUNT *
              </label>
              <input
                id="create-bounty-amount-input"
                type="number"
                min="10"
                step="10"
                placeholder="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '3px solid #000000',
                  borderRadius: '8px',
                  boxShadow: '3px 3px 0px #000000',
                  background: 'var(--arc-token-sand)',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', display: 'block', marginBottom: '6px' }}>
                COMPLETION DEADLINE
              </label>
              <select
                id="create-bounty-deadline-select"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px',
                  border: '3px solid #000000',
                  borderRadius: '8px',
                  boxShadow: '3px 3px 0px #000000',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  background: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="3">3 Days (Rapid Sprint)</option>
                <option value="7">7 Days (1 Week)</option>
                <option value="14">14 Days (2 Weeks)</option>
                <option value="30">30 Days (1 Month)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', display: 'block', marginBottom: '6px' }}>
              DETAILED REQUIREMENTS &amp; SPECS
            </label>
            <textarea
              rows={3}
              placeholder="Describe requirements, aesthetic references, target audience, and evaluation criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '3px solid #000000',
                borderRadius: '8px',
                boxShadow: '3px 3px 0px #000000',
                fontSize: '0.9rem',
                fontWeight: 600,
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* AI Eligibility Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            border: '2.5px solid #000000',
            borderRadius: '8px',
            background: 'var(--arc-sky-sync)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} strokeWidth={2.5} />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 900, color: '#000000' }}>
                  PERMIT AI AGENTS &amp; AI CREATORS
                </p>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#1f2937' }}>
                  Allows autonomous agent swarms to query and submit solutions via API.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAiEligible}
              onChange={(e) => setIsAiEligible(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#000' }}
            />
          </div>

          {/* Submit Button */}
          <button
            id="create-bounty-submit-btn"
            type="submit"
            disabled={isLoading}
            className="brutal-btn brutal-btn-gold"
            style={{ padding: '16px', fontSize: '1.1rem', marginTop: '6px' }}
          >
            <span>{isLoading ? 'DEPOSITING IN ARC ESCROW...' : `LOCK $${amount} USDC IN ESCROW & POST`}</span>
            <ArrowRight size={22} strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
}
