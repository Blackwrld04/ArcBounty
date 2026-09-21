import React, { useState, useEffect } from 'react';
import {
  Shield,
  Wallet,
  DollarSign,
  Users,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Search,
  ArrowRight,
  Sparkles,
  Lock,
  RefreshCw,
  Clock,
  Layers,
  Award,
  ChevronRight,
  AlertTriangle,
  FileText,
  Key,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { truncateAddress } from '../utils/arc';

export default function AdminDashboard({ user, wallet, onBackToExplore }) {
  // Master Administrator Password Authentication State
  const [adminToken, setAdminToken] = useState(() => {
    return sessionStorage.getItem('arcbounty_admin_token') || '';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  // Admin Console State
  const [stats, setStats] = useState(null);
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [distributingId, setDistributingId] = useState(null);
  const [settlementResult, setSettlementResult] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null); // { bounty, submission }

  const handlePasswordLogin = async (e) => {
    if (e) e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Please enter administrator password.');
      return;
    }

    setAuthenticating(true);
    setAuthError('');
    try {
      const res = await fetch('http://localhost:4050/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem('arcbounty_admin_token', data.token);
        setAdminToken(data.token);
        setPasswordInput('');
      } else {
        setAuthError(data.error || 'Invalid administrator password. Access denied.');
      }
    } catch (err) {
      setAuthError('Connection failed: ' + err.message);
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLockConsole = async () => {
    try {
      if (adminToken) {
        await fetch('http://localhost:4050/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` }
        });
      }
    } catch (e) {}
    sessionStorage.removeItem('arcbounty_admin_token');
    setAdminToken('');
    if (onBackToExplore) {
      onBackToExplore();
    }
  };

  const fetchAdminData = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const [statsRes, bountiesRes] = await Promise.all([
        fetch('http://localhost:4050/api/admin/stats', { headers }),
        fetch('http://localhost:4050/api/admin/bounties', { headers })
      ]);

      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      } else if (statsRes.status === 401 || statsRes.status === 403) {
        // Invalidate stale token
        sessionStorage.removeItem('arcbounty_admin_token');
        setAdminToken('');
        setAuthError('Admin session expired. Please re-enter your password.');
        return;
      }

      const bountiesData = await bountiesRes.json();
      if (bountiesData.success) {
        setBounties(bountiesData.bounties);
      }
    } catch (err) {
      console.error('[AdminDashboard] Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdminData();
    }
  }, [adminToken]);

  const handleSelectBounty = async (bounty) => {
    setSelectedBounty(bounty);
    setLoadingSubmissions(true);
    setSettlementResult(null);
    try {
      const res = await fetch(`http://localhost:4050/api/admin/bounties/${bounty.id}/submissions`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('[AdminDashboard] Failed to fetch submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleCopyWallet = (addr) => {
    navigator.clipboard.writeText(addr);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleExecuteDistribution = async () => {
    if (!confirmModal) return;
    const { bounty, submission } = confirmModal;
    setDistributingId(submission.id);

    try {
      const res = await fetch('http://localhost:4050/api/admin/distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          bountyId: bounty.id,
          submissionId: submission.id,
          amount: bounty.amount
        })
      });

      const data = await res.json();
      if (data.success) {
        setSettlementResult(data.settlement);
        setConfirmModal(null);
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.6 }
        });
        // Refresh telemetry & submissions
        fetchAdminData();
        handleSelectBounty(bounty);
      } else {
        alert(data.error || 'Failed to distribute funds');
      }
    } catch (err) {
      alert('Network error while distributing reward: ' + err.message);
    } finally {
      setDistributingId(null);
    }
  };

  // Guard: Master Password Gate Screen
  if (!adminToken) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 16px',
        backgroundColor: 'var(--bg-canvas)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          border: '2.5px solid #000000',
          boxShadow: '6px 6px 0px #000000',
          borderRadius: '14px',
          padding: '36px 30px',
          position: 'relative'
        }}>
          {/* Top header badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fee2e2',
              color: '#991b1b',
              border: '1.5px solid #000000',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.74rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Lock size={12} color="#991b1b" />
              <span>Restricted Access</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
              Circle Arc L1 (5042)
            </span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '26px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: '#1b3158',
              border: '2px solid #000000',
              boxShadow: '3px 3px 0px #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Key size={26} color="#ffcc6f" />
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
              ArcBounty Admin Portal
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Separate administrative environment. Enter master administrator password to access the platform escrow treasury and distribute prize USDC.
            </p>
          </div>

          {authError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#fef2f2',
              border: '1.5px solid #ef4444',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '20px',
              fontSize: '0.84rem',
              color: '#991b1b',
              fontWeight: 700
            }}>
              <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 900,
                color: '#0f172a',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Master Admin Password
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter administrator password..."
                  autoFocus
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 42px 12px 14px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    border: '2px solid #000000',
                    borderRadius: '8px',
                    boxShadow: '2.5px 2.5px 0px #000000',
                    outline: 'none',
                    background: '#ffffff',
                    color: '#0f172a'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authenticating || !passwordInput.trim()}
              style={{
                width: '100%',
                background: authenticating || !passwordInput.trim() ? '#cbd5e1' : '#1b3158',
                color: '#ffffff',
                border: '2px solid #000000',
                boxShadow: authenticating || !passwordInput.trim() ? 'none' : '3px 3px 0px #000000',
                borderRadius: '8px',
                padding: '13px',
                fontSize: '0.92rem',
                fontWeight: 900,
                cursor: authenticating || !passwordInput.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Key size={16} color="#ffcc6f" />
              <span>{authenticating ? 'Verifying Password...' : 'Unlock Admin Console'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '16px' }}>
            <button
              onClick={onBackToExplore}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={14} />
              <span>Return to Public Site</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredBounties = bounties.filter(b => {
    if (filterStatus !== 'All' && b.status.toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="container" style={{ padding: '36px 16px', maxWidth: '1200px' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '2.5px solid #000000'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: '#1b3158',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1.5px solid #000000'
            }}>
              ADMIN CONSOLE
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>
              Circle Arc Protocol (Chain ID 5042)
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Escrow Treasury &amp; Prize Disbursement
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#475569', margin: '4px 0 0 0' }}>
            Oversee deposited challenge bounties, review creator participants, and disburse USDC payouts with sub-second finality.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={fetchAdminData}
            style={{
              background: '#ffffff',
              border: '2px solid #000000',
              boxShadow: '2.5px 2.5px 0px #000000',
              borderRadius: '8px',
              padding: '9px 15px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh Telemetry</span>
          </button>

          <button
            onClick={onBackToExplore}
            className="btn-secondary"
            style={{ padding: '9px 15px', borderRadius: '8px', fontSize: '0.84rem' }}
          >
            <ArrowLeft size={14} />
            <span>Back to Public View</span>
          </button>

          <button
            onClick={handleLockConsole}
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              border: '2px solid #000000',
              boxShadow: '2.5px 2.5px 0px #000000',
              borderRadius: '8px',
              padding: '9px 15px',
              fontSize: '0.84rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Lock administrative console and require password"
          >
            <LogOut size={14} color="#991b1b" />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Total Escrowed USDC */}
        <div style={{
          background: '#ffffff',
          border: '2.5px solid #000000',
          boxShadow: '3px 3px 0px #000000',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              TOTAL ESCROW VOLUME
            </span>
            <DollarSign size={18} color="#1b3158" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            ${stats ? stats.totalEscrowedUsdc.toLocaleString() : '---'} <span style={{ fontSize: '1rem', color: '#64748b' }}>USDC</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
            Secured on Circle Arc L1
          </div>
        </div>

        {/* Total Bounties Created */}
        <div style={{
          background: '#ffffff',
          border: '2.5px solid #000000',
          boxShadow: '3px 3px 0px #000000',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              CREATED BOUNTIES
            </span>
            <Layers size={18} color="#1b3158" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            {stats ? stats.totalBounties : '---'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: '4px' }}>
            {stats?.openBounties || 0} Open &bull; {stats?.inReviewBounties || 0} In Review &bull; {stats?.settledBounties || 0} Settled
          </div>
        </div>

        {/* Total Submissions / Participants */}
        <div style={{
          background: '#ffffff',
          border: '2.5px solid #000000',
          boxShadow: '3px 3px 0px #000000',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              PARTICIPANTS &amp; PROOFS
            </span>
            <Users size={18} color="#1b3158" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            {stats ? stats.totalSubmissions : '---'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: '4px' }}>
            Creator deliverables submitted
          </div>
        </div>

        {/* Total Distributed USDC */}
        <div style={{
          background: '#ffffff',
          border: '2.5px solid #000000',
          boxShadow: '3px 3px 0px #000000',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              TOTAL DISTRIBUTED
            </span>
            <Award size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#10b981' }}>
            ${stats ? stats.totalDistributedUsdc.toLocaleString() : '---'} <span style={{ fontSize: '1rem', color: '#64748b' }}>USDC</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>
            {stats?.totalDistributions || 0} Payouts Executed
          </div>
        </div>
      </div>

      {/* Official Platform Treasury Wallet Card */}
      <div style={{
        background: '#101b2f',
        color: '#ffffff',
        border: '2.5px solid #000000',
        boxShadow: '4px 4px 0px #000000',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            background: '#1b3158',
            border: '2px solid #ffcc6f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={22} color="#ffcc6f" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ffcc6f', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              PLATFORM ESCROW TREASURY WALLET (USDC RECEIVER)
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: '#ffffff', marginTop: '2px', wordBreak: 'break-all' }}>
              {stats?.escrowWallet || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
              All sponsors pay here when creating challenges &bull; You control payouts from this address
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => handleCopyWallet(stats?.escrowWallet || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884')}
            style={{
              background: copiedWallet ? '#10b981' : '#1b3158',
              color: '#ffffff',
              border: '1.5px solid #2f578c',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {copiedWallet ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedWallet ? 'Copied' : 'Copy Address'}</span>
          </button>

          <a
            href={`https://explorer.arc.io/address/${stats?.escrowWallet || '0x38bEc58406E9b7941F48cCe61aE2d1847137f884'}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#0a1322',
              color: '#acc6e9',
              border: '1.5px solid #2f578c',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Arc Explorer</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Main Content: Bounties Table & Participant Review */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedBounty ? '1fr 1.15fr' : '1fr', gap: '24px' }}>
        
        {/* Left Column: Bounties Table */}
        <div style={{
          background: '#ffffff',
          border: '2.5px solid #000000',
          boxShadow: '4px 4px 0px #000000',
          borderRadius: '12px',
          padding: '24px',
          overflow: 'hidden'
        }}>
          {/* Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['All', 'Open', 'InReview', 'Settled'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    background: filterStatus === s ? 'var(--arc-protocol-navy)' : '#f1f5f9',
                    color: filterStatus === s ? '#ffffff' : '#475569',
                    border: '1.5px solid #000000',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search bounties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 30px',
                  borderRadius: '6px',
                  border: '1.5px solid #000000',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000000', background: '#f8fafc' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>CHALLENGE</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>REWARD</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>STATUS</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>PARTICIPANTS</th>
                  <th style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredBounties.map((b) => {
                  const isSelected = selectedBounty?.id === b.id;
                  return (
                    <tr
                      key={b.id}
                      onClick={() => handleSelectBounty(b)}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        background: isSelected ? '#fffae6' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'background 0.1s ease'
                      }}
                    >
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {b.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                          By: {b.maintainerName || truncateAddress(b.maintainer)}
                        </div>
                      </td>

                      <td style={{ padding: '12px', fontWeight: 900, color: '#0f172a' }}>
                        ${b.amount} <span style={{ fontSize: '0.72rem', color: '#64748b' }}>USDC</span>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          border: '1.5px solid #000000',
                          background: b.status === 'Settled' ? '#bbf7d0' : (b.status === 'InReview' ? '#fef08a' : '#e0f2fe'),
                          color: '#000000'
                        }}>
                          {b.status}
                        </span>
                      </td>

                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Users size={13} color="#64748b" />
                          <span style={{ fontWeight: 800, color: '#0f172a' }}>
                            {b.submissionsCount || 0}
                          </span>
                        </div>
                      </td>

                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelectBounty(b); }}
                          style={{
                            background: isSelected ? '#1b3158' : '#ffffff',
                            color: isSelected ? '#ffffff' : '#0f172a',
                            border: '1.5px solid #000000',
                            borderRadius: '6px',
                            padding: '5px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>Review</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredBounties.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                      No bounties found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Participant Submissions & Distribution Panel */}
        {selectedBounty && (
          <div style={{
            background: '#ffffff',
            border: '2.5px solid #000000',
            boxShadow: '4px 4px 0px #000000',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Selected Bounty Details Header */}
            <div style={{ borderBottom: '2px solid #000000', paddingBottom: '16px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  background: 'var(--arc-token-sand)',
                  border: '1.5px solid #000000',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {selectedBounty.category}
                </span>

                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                  ${selectedBounty.amount} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>USDC</span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
                {selectedBounty.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: '#64748b' }}>
                <span>ID: <code>{selectedBounty.id}</code></span>
                <span>Deposit: <strong style={{ color: '#10b981' }}>{selectedBounty.paymentStatus || 'funded'}</strong></span>
                <span>Escrow: <code>{truncateAddress(selectedBounty.escrowWallet)}</code></span>
              </div>
            </div>

            {/* Live Settlement Banner if just settled */}
            {settlementResult && (
              <div style={{
                background: '#bbf7d0',
                border: '2px solid #000000',
                boxShadow: '3px 3px 0px #000000',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, color: '#166534', marginBottom: '4px' }}>
                  <CheckCircle2 size={18} />
                  <span>USDC Disbursed to Creator!</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#14532d', margin: 0 }}>
                  Prize of <strong>${settlementResult.amount} USDC</strong> successfully transferred to <code>{settlementResult.recipient}</code>.
                </p>
                <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#166534', marginTop: '6px' }}>
                  Tx Hash: {settlementResult.txHash}
                </div>
              </div>
            )}

            {/* Submissions Section */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
                  Challenge Participants ({submissions.length})
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  Select a winning participant to disburse reward
                </span>
              </div>

              {loadingSubmissions ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  Loading challenge participant proofs...
                </div>
              ) : submissions.length === 0 ? (
                <div style={{
                  padding: '32px 20px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '8px',
                  color: '#64748b'
                }}>
                  <Users size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                  <p style={{ fontWeight: 700, margin: '0 0 4px 0', color: '#0f172a' }}>No Submissions Yet</p>
                  <p style={{ fontSize: '0.8rem', margin: 0 }}>
                    Creators have not submitted deliverables for this opportunity yet. Once submitted, their proof links and payout wallet addresses will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {submissions.map((sub, idx) => {
                    const isWinner = sub.status === 'awarded';
                    return (
                      <div
                        key={sub.id}
                        style={{
                          background: isWinner ? '#f0fdf4' : '#ffffff',
                          border: '2px solid #000000',
                          boxShadow: '3px 3px 0px #000000',
                          borderRadius: '8px',
                          padding: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: '#1b3158',
                              color: '#ffffff',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {idx + 1}
                            </span>
                            <div>
                              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                                {sub.creator_name || 'Anonymous Creator'}
                              </div>
                              {sub.creator_email && (
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                                  {sub.creator_email}
                                </div>
                              )}
                            </div>
                          </div>

                          {isWinner ? (
                            <span style={{
                              background: '#bbf7d0',
                              color: '#166534',
                              border: '1.5px solid #166534',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 900,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Award size={12} />
                              <span>WINNER PAID</span>
                            </span>
                          ) : (
                            <span style={{
                              background: '#f1f5f9',
                              color: '#475569',
                              border: '1px solid #cbd5e1',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              {sub.solver_type || 'Human Creator'}
                            </span>
                          )}
                        </div>

                        {/* Deliverable URL */}
                        <div style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          marginBottom: '10px'
                        }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                            DELIVERABLE URL
                          </div>
                          <a
                            href={sub.submission_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'var(--arc-validator-blue)',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              textDecoration: 'none',
                              wordBreak: 'break-all',
                              marginTop: '2px'
                            }}
                          >
                            <span>{sub.submission_url}</span>
                            <ExternalLink size={13} />
                          </a>
                        </div>

                        {/* Notes */}
                        {sub.notes && (
                          <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4, marginBottom: '10px', fontStyle: 'italic' }}>
                            "{sub.notes}"
                          </div>
                        )}

                        {/* Payout Wallet Address */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.78rem' }}>
                          <span style={{ color: '#64748b' }}>Payout Address:</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>
                            {sub.wallet_address}
                          </span>
                        </div>

                        {/* Action: Distribute Button */}
                        {!isWinner && (
                          <button
                            onClick={() => setConfirmModal({ bounty: selectedBounty, submission: sub })}
                            disabled={distributingId === sub.id}
                            className="btn-primary"
                            style={{
                              width: '100%',
                              padding: '10px',
                              borderRadius: '6px',
                              background: '#10b981',
                              fontSize: '0.85rem'
                            }}
                          >
                            <Award size={15} />
                            <span>{distributingId === sub.id ? 'Settling on Arc...' : `Distribute $${selectedBounty.amount} USDC to this Creator`}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="modal-backdrop" onClick={() => setConfirmModal(null)}>
          <div
            className="clean-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '14px',
              border: '2.5px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              padding: '28px',
              background: '#ffffff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#fffae6',
                border: '2px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={20} color="#b45309" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Confirm USDC Prize Payout
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Execution on Circle Arc Protocol (Chain ID 5042)
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '18px' }}>
              You are about to distribute the platform escrow prize of <strong style={{ color: '#0f172a' }}>${confirmModal.bounty.amount} USDC</strong> to:
            </p>

            <div style={{
              background: '#f8fafc',
              border: '2px solid #000000',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>RECIPIENT CREATOR</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                {confirmModal.submission.creator_name || 'Anonymous Creator'}
              </div>
              {confirmModal.submission.creator_email && (
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {confirmModal.submission.creator_email}
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: '8px' }}>PAYOUT WALLET ADDRESS</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', wordBreak: 'break-all' }}>
                {confirmModal.submission.wallet_address}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginTop: '8px' }}>CHALLENGE</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                {confirmModal.bounty.title}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="btn-secondary"
                style={{ padding: '12px 18px', borderRadius: '8px' }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteDistribution}
                disabled={distributingId !== null}
                className="btn-primary"
                style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#10b981' }}
              >
                <Award size={16} />
                <span>{distributingId !== null ? 'Disbursing...' : `Confirm & Pay $${confirmModal.bounty.amount} USDC`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
