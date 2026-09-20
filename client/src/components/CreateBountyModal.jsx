import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Bot, DollarSign, Calendar, Check, HelpCircle } from 'lucide-react';
import { CREATOR_CATEGORIES } from '../data/initialBounties';

export default function CreateBountyModal({ isOpen, onClose, onCreateBounty, wallet, user }) {
  const [step, setStep] = useState(1); // 1: Category & Title, 2: Description & AI Compose, 3: Reward & Escrow
  const [category, setCategory] = useState('DESIGN');
  const [title, setTitle] = useState('');
  const [submissionType, setSubmissionType] = useState('Figma / 3D Render Link');
  const [amount, setAmount] = useState('500');
  const [description, setDescription] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('14');
  const [isAiEligible, setIsAiEligible] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const availableCategories = CREATOR_CATEGORIES.filter(c => c.id !== 'ALL');

  // AI Compose helper (Gibwork style)
  const handleAiCompose = () => {
    if (!title) {
      alert('Please enter a brief task title first.');
      return;
    }
    setIsAiGenerating(true);
    setTimeout(() => {
      setDescription(
        `### Objective\nCreate a world-class ${category.toLowerCase()} deliverable for the Circle Arc ecosystem that showcases high aesthetic excellence and institutional speed.\n\n### Deliverables\n- High-resolution production assets\n- Source files (e.g. Figma / Blender / GitHub repo)\n- Brief implementation summary\n\n### Acceptance Criteria\n1. Satisfies Circle brand guidelines\n2. Completed within ${deadlineDays} days\n3. Verifiable deliverable URL provided on submission`
      );
      setIsAiGenerating(false);
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    setIsSubmitting(true);
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
      tags: [category, 'Circle Arc', 'USDC'],
      deadlineDays: parseInt(deadlineDays, 10),
      isAiEligible,
      maintainer: wallet.address,
      maintainerName: user?.name || 'Circle Creative Guild'
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="clean-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '18px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          padding: '32px',
          position: 'relative'
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
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} color="#64748b" />
        </button>

        {/* Stepper Breadcrumbs (Gibwork style) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          {[
            { num: 1, label: 'Category & Title' },
            { num: 2, label: 'Specifications' },
            { num: 3, label: 'USDC Escrow' }
          ].map((s, idx) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step >= s.num ? 'var(--arc-protocol-navy)' : '#e2e8f0',
                color: step >= s.num ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {s.num}
              </div>
              <span style={{
                fontSize: '0.82rem',
                fontWeight: step === s.num ? 700 : 500,
                color: step === s.num ? '#0f172a' : '#64748b'
              }}>
                {s.label}
              </span>
              {idx < 2 && <span style={{ color: '#cbd5e1' }}>/</span>}
            </div>
          ))}
        </div>

        {/* STEP 1: Category & Title */}
        {step === 1 && (
          <div>
            <h2 className="font-space" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              What do you need built?
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '22px' }}>
              Choose a creator discipline and define the task title.
            </p>

            {/* Category Chips */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                SELECT DISCIPLINE
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableCategories.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`category-pill ${category === c.id ? 'active' : ''}`}
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div style={{ marginBottom: '26px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                TASK TITLE
              </label>
              <input
                type="text"
                placeholder="e.g., Design 3D Mascot for Circle Arc, or Write Deep-Dive Thread on Malachite BFT"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '1rem',
                  fontWeight: 600,
                  outline: 'none',
                  color: '#0f172a'
                }}
              />
            </div>

            <button
              type="button"
              disabled={!title.trim()}
              onClick={() => setStep(2)}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '10px', opacity: title.trim() ? 1 : 0.5 }}
            >
              <span>Continue to Specifications</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: Description & AI Compose */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 className="font-space" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Task Details &amp; Deliverables
              </h2>
              {/* AI Compose Button (Gibwork style) */}
              <button
                type="button"
                onClick={handleAiCompose}
                disabled={isAiGenerating}
                style={{
                  background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                  color: '#7c3aed',
                  border: '1px solid #ddd6fe',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} color="#7c3aed" />
                <span>{isAiGenerating ? 'Synthesizing...' : 'AI Compose'}</span>
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '18px' }}>
              Specify acceptance criteria or let AI draft the brief.
            </p>

            {/* Deliverable Type */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                EXPECTED DELIVERABLE TYPE
              </label>
              <select
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  background: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="Figma / 3D Render Link">Figma / 3D Blender GLTF Link</option>
                <option value="Video (Loom, YouTube, TikTok, MP4)">Video (Loom, YouTube 4K, MP4)</option>
                <option value="Twitter/X Thread or Article Link">Twitter/X Thread / Notion Doc</option>
                <option value="Memes / Image / Sticker Set">Memes / Sticker Pack / Image Assets</option>
                <option value="GitHub Pull Request / Live App">GitHub Pull Request / Contract Verifier</option>
                <option value="Markdown Translation PR">Markdown Translation PR</option>
              </select>
            </div>

            {/* Rich Requirements Editor */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                DESCRIPTION &amp; CRITERIA
              </label>
              <textarea
                rows={6}
                placeholder="Describe project requirements, design aesthetic, references, and evaluation criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  lineHeight: 1.5
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary"
                style={{ padding: '12px 18px', borderRadius: '10px' }}
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary"
                style={{ flex: 1, padding: '12px', borderRadius: '10px' }}
              >
                <span>Continue to Escrow Payout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: USDC Escrow & Deposit */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h2 className="font-space" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Lock Canonical USDC in Arc Escrow
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
              Funds are secured in pure Circle USDC (0x3600...0000) and released upon your approval.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  REWARD AMOUNT (USDC)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>$</span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 28px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  COMPLETION DEADLINE
                </label>
                <select
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
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

            {/* AI Eligibility Toggle */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot size={20} color="var(--arc-validator-blue)" />
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Permit AI Agents &amp; Autonomous Swarms
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    Allows machine creator agents to query and solve via API feed
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={isAiEligible}
                onChange={(e) => setIsAiEligible(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-secondary"
                style={{ padding: '12px 18px', borderRadius: '10px' }}
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ flex: 1, padding: '14px', borderRadius: '10px', background: '#10b981' }}
              >
                <span>{isSubmitting ? 'Securing in Arc Escrow...' : `Lock $${amount} USDC in Escrow & Post`}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
