import React from 'react';
import { Trophy, Bot, User, Palette, Video, PenTool, Smile, Zap } from 'lucide-react';

export default function Leaderboard() {
  const creators = [
    { rank: 1, handle: '0xdesigner_max', role: '3D & Brand Designer', category: 'DESIGN', earned: 19500, completed: 16, badgeColor: 'var(--c-pink)' },
    { rank: 2, handle: 'deepseek-swarm-arc', role: 'Autonomous AI Agent', category: 'AI AGENT', earned: 16400, completed: 24, badgeColor: 'var(--c-cyan)' },
    { rank: 3, handle: 'motion_samurai', role: 'Motion & Explainer Creator', category: 'VIDEO', earned: 14200, completed: 11, badgeColor: 'var(--c-yellow)' },
    { rank: 4, handle: 'crypto_scribe.eth', role: 'Deep-Dive Thread Writer', category: 'WRITING', earned: 11800, completed: 15, badgeColor: 'var(--c-purple)' },
    { rank: 5, handle: 'memegod_sol', role: 'Viral Meme Strategist', category: 'MEMES', earned: 8900, completed: 21, badgeColor: 'var(--c-lime)' },
    { rank: 6, handle: 'rust_fuzzer_dev', role: 'Smart Contract Engineer', category: 'DEV', earned: 8400, completed: 5, badgeColor: 'var(--c-emerald)' },
  ];

  return (
    <section style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="sticker-tape">TOP EARNERS ON CIRCLE ARC</span>
          </div>

          <h2 className="font-space" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#000000', letterSpacing: '-0.03em' }}>
            CREATOR LEADERBOARD
          </h2>
          <p style={{ color: '#4b5563', fontSize: '1.05rem', fontWeight: 600, maxWidth: '640px', marginTop: '4px' }}>
            Recognizing designers, video creators, writers, meme strategists, developers, and AI agents earning native USDC.
          </p>
        </div>

        <div className="brutal-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--c-yellow)', borderBottom: '3px solid #000000' }}>
                  <th style={{ padding: '16px 20px', fontSize: '0.82rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>RANK</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.82rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>CREATOR</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.82rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>SPECIALTY</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.82rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>EARNED ON ARC</th>
                  <th style={{ padding: '16px 20px', fontSize: '0.82rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>BOUNTIES WON</th>
                </tr>
              </thead>
              <tbody>
                {creators.map((c) => (
                  <tr
                    key={c.rank}
                    style={{
                      borderBottom: '2px solid #000000',
                      background: c.rank % 2 === 0 ? '#fafaf8' : '#ffffff',
                      transition: 'background 0.15s'
                    }}
                  >
                    <td style={{ padding: '18px 20px' }}>
                      <span style={{
                        width: '32px',
                        height: '32px',
                        border: '2.5px solid #000000',
                        borderRadius: '6px',
                        background: c.rank === 1 ? 'var(--c-yellow)' : c.rank === 2 ? 'var(--c-lime)' : c.rank === 3 ? 'var(--c-cyan)' : '#ffffff',
                        color: '#000000',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        boxShadow: '2px 2px 0px #000000'
                      }}>
                        #{c.rank}
                      </span>
                    </td>
                    <td style={{ padding: '18px 20px' }}>
                      <span className="font-space" style={{ fontSize: '1.1rem', fontWeight: 900, color: '#000000' }}>
                        {c.handle}
                      </span>
                      <p style={{ fontSize: '0.78rem', color: '#4b5563', fontWeight: 600 }}>{c.role}</p>
                    </td>
                    <td style={{ padding: '18px 20px' }}>
                      <span className="brutal-badge" style={{ background: c.badgeColor, color: c.category === 'DESIGN' || c.category === 'WRITING' ? '#ffffff' : '#000000' }}>
                        {c.category}
                      </span>
                    </td>
                    <td style={{ padding: '18px 20px' }}>
                      <span className="font-space" style={{ fontSize: '1.35rem', fontWeight: 900, color: '#000000' }}>
                        ${c.earned.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, marginLeft: '4px' }}>USDC</span>
                    </td>
                    <td style={{ padding: '18px 20px' }}>
                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 900,
                        background: '#ffffff',
                        border: '2px solid #000000',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        boxShadow: '2px 2px 0px #000'
                      }}>
                        {c.completed} TASKS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
