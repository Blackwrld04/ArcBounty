import React, { useState } from 'react';
import { X, Shield, ArrowRight, Bot, GitBranch, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { truncateAddress } from '../utils/arc';

export default function CreateBountyModal({ onClose, onCreateBounty, wallet }) {
  const [issueUrl, setIssueUrl] = useState('');
  const [title, setTitle] = useState('');
  const [repo, setRepo] = useState('');
  const [amount, setAmount] = useState('500');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(['TypeScript', 'Arc']);
  const [deadlineDays, setDeadlineDays] = useState('14');
  const [isAiEligible, setIsAiEligible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const availableTags = ['Rust', 'Solidity', 'TypeScript', 'Python', 'AI Agent', 'Mobile', 'Security', 'DeFi'];

  const toggleTag = (t) => {
    if (tags.includes(t)) {
      setTags(tags.filter((item) => item !== t));
    } else {
      setTags([...tags, t]);
    }
  };

  const handleUrlBlur = () => {
    if (!issueUrl) return;
    const match = issueUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
    if (match) {
      const [, owner, repoName, issueNum] = match;
      setRepo(`${owner}/${repoName}`);
      if (!title) {
        setTitle(`Feature Implementation: #${issueNum} in ${repoName}`);
      }
    } else if (!repo && issueUrl.includes('/')) {
      setRepo('open-source/project');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !issueUrl) return;

    setIsLoading(true);
    await onCreateBounty({
      title,
      repo: repo || 'github/open-source',
      issueUrl,
      amount: parseFloat(amount),
      description: description || 'Complete implementation with test vectors and documentation.',
      tags: tags.length > 0 ? tags : ['General'],
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
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel-dark animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          padding: '32px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-create-modal-btn"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#9ca3af',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(193, 255, 114, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c1ff72'
          }}>
            <Sparkles size={18} />
          </div>
          <span style={{ color: '#c1ff72', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Escrow Studio
          </span>
        </div>

        <h2 className="font-space" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
          Post a New Developer Bounty
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '24px' }}>
          Lock USDC in Circle Arc Escrow. Funds are released automatically once the solver's pull request is verified.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* GitHub Issue URL */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <GitBranch size={15} color="#c1ff72" />
              <span>GitHub Issue URL *</span>
            </label>
            <input
              id="create-bounty-url-input"
              type="url"
              placeholder="https://github.com/owner/repository/issues/104"
              value={issueUrl}
              onChange={(e) => setIssueUrl(e.target.value)}
              onBlur={handleUrlBlur}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Title & Repository */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', display: 'block', marginBottom: '6px' }}>
                Task Title *
              </label>
              <input
                id="create-bounty-title-input"
                type="text"
                placeholder="e.g. Implement Malachite Verifier in Rust"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', display: 'block', marginBottom: '6px' }}>
                Repository Name
              </label>
              <input
                id="create-bounty-repo-input"
                type="text"
                placeholder="circlefin/arc-consensus"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Reward Amount & Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <DollarSign size={15} color="#c1ff72" />
                <span>USDC Reward Amount *</span>
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
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(193, 255, 114, 0.4)',
                  color: '#c1ff72',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Calendar size={15} />
                <span>Completion Deadline</span>
              </label>
              <select
                id="create-bounty-deadline-select"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#090d14',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="3">3 Days (Sprint)</option>
                <option value="7">7 Days (1 Week)</option>
                <option value="14">14 Days (2 Weeks)</option>
                <option value="30">30 Days (1 Month)</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', display: 'block', marginBottom: '6px' }}>
              Skill & Technology Tags
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: tags.includes(tag) ? 'rgba(193, 255, 114, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: tags.includes(tag) ? '#c1ff72' : '#9ca3af',
                    border: tags.includes(tag) ? '1px solid #c1ff72' : '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* AI Agent Eligibility Switch */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bot size={20} color="#00f2fe" />
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                  Enable Autonomous AI Agent Solvers
                </p>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Allows coding swarms to query task via machine API and submit verified PRs.
                </p>
              </div>
            </div>
            <input
              id="ai-eligible-checkbox"
              type="checkbox"
              checked={isAiEligible}
              onChange={(e) => setIsAiEligible(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#c1ff72' }}
            />
          </div>

          {/* Submit CTA */}
          <button
            id="create-bounty-submit-btn"
            type="submit"
            disabled={isLoading}
            className="glass-button"
            style={{
              marginTop: '10px',
              padding: '16px',
              borderRadius: '12px',
              background: '#c1ff72',
              border: 'none',
              color: '#090d14',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>{isLoading ? 'Locking USDC Escrow on Arc...' : `Deposit $${amount} USDC & Post Bounty`}</span>
            <ArrowRight size={18} />
            <div className="button-shine" />
          </button>
        </form>
      </div>
    </div>
  );
}
