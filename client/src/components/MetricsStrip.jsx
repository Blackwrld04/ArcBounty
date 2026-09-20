import React from 'react';
import { TrendingUp, Clock, Bot, Shield, CheckCircle } from 'lucide-react';

export default function MetricsStrip({ stats }) {
  const metrics = [
    {
      label: 'Total Value in Escrow',
      value: `$${(stats?.tvlUsdc || 28450).toLocaleString()} USDC`,
      change: '+24.6% this week',
      icon: <Shield size={18} color="#c1ff72" />,
      highlight: true
    },
    {
      label: 'Completed Disbursals',
      value: `$${(stats?.totalSettledUsdc || 142800).toLocaleString()}`,
      change: '164 bounties settled',
      icon: <CheckCircle size={18} color="#10b981" />
    },
    {
      label: 'Avg Settlement Speed',
      value: `${stats?.avgSettlementTimeMs || 384}ms`,
      change: 'Malachite BFT Finality',
      icon: <Clock size={18} color="#00f2fe" />
    },
    {
      label: 'AI Agent Disbursals',
      value: `${stats?.aiAgentClaimsPercent || 42}%`,
      change: 'Machine-to-machine settled',
      icon: <Bot size={18} color="#c1ff72" />
    }
  ];

  return (
    <section style={{ padding: '30px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '16px',
                border: item.highlight ? '1px solid rgba(193, 255, 114, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: item.highlight ? 'rgba(193, 255, 114, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500 }}>
                  {item.label}
                </p>
                <p className="font-space" style={{
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: item.highlight ? '#c1ff72' : '#ffffff',
                  letterSpacing: '-0.02em',
                  marginTop: '2px'
                }}>
                  {item.value}
                </p>
                <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px' }}>
                  {item.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
