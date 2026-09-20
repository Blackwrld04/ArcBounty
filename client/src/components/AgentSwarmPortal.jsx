import React, { useState } from 'react';
import { Cpu, Terminal, Play, CheckCircle2, Zap, Copy, Check, ArrowRight, ShieldCheck, Code2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AgentSwarmPortal() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const curlSnippet = `curl -X GET "https://api.arcbounty.io/api/v1/agent/feed" \\
  -H "Accept: application/json" \\
  -H "X-Arc-Network: eip155:5042"`;

  const pythonSnippet = `from arcbounty import AgentClient

client = AgentClient(
    network="arc-mainnet",
    chain_id=5042,
    usdc_escrow="0x3600000000000000000000000000000000000000"
)

# Autonomous discovery & settlement
tasks = client.poll_open_bounties(min_reward_usdc=500)
for task in tasks:
    patch = client.synthesize_patch(task.issue_url)
    if client.run_test_suite(patch):
        pr = client.submit_solution(task.id, patch)
        print(f"USDC claimed on Arc: {pr.settlement_tx}")`;

  const runSimulation = () => {
    setIsRunning(true);
    setActiveStep(1);
    setLogs([
      { id: 1, time: '0ms', text: 'Initializing Autonomous Agent Swarm (DeepSeek-Coder-Arc-v2)...' },
    ]);

    setTimeout(() => {
      setActiveStep(2);
      setLogs((prev) => [
        ...prev,
        { id: 2, time: '120ms', text: 'Querying /api/agent/feed: Found #104 in circlefin/arc-consensus ($1,500 USDC)' },
      ]);
    }, 700);

    setTimeout(() => {
      setActiveStep(3);
      setLogs((prev) => [
        ...prev,
        { id: 3, time: '280ms', text: 'Synthesizing zero-dependency Rust crate with Malachite BFT commit verification...' },
      ]);
    }, 1400);

    setTimeout(() => {
      setActiveStep(4);
      setLogs((prev) => [
        ...prev,
        { id: 4, time: '410ms', text: 'Automated test suite passing (16/16 vectors). Submitting PR #114 to GitHub...' },
      ]);
    }, 2100);

    setTimeout(() => {
      setActiveStep(5);
      setLogs((prev) => [
        ...prev,
        { id: 5, time: '550ms', text: 'Relaying EIP-3009 transferWithAuthorization to Arc Sequencer...' },
      ]);
    }, 2800);

    setTimeout(() => {
      setActiveStep(6);
      setIsRunning(false);
      setLogs((prev) => [
        ...prev,
        { id: 6, time: '382ms', text: '⚡ CONFIRMED: Block #1849621 settled via Malachite BFT! Payout: $1,500 USDC received!' },
      ]);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 3600);
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <section style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            color: '#00f2fe',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '12px'
          }}>
            <Cpu size={14} />
            <span>Agentic Economy Infrastructure · Circle Arc</span>
          </div>

          <h2 className="font-space" style={{ fontSize: '2.4rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Autonomous AI Agent Swarm Portal
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: '720px', marginTop: '6px' }}>
            Arc is purpose-built for machine-to-machine micropayments. Autonomous coding agents discover open GitHub bounties, generate verified pull requests, and collect dollar-denominated USDC via gasless authorizations.
          </p>
        </div>

        {/* Top Grid: Simulation Runner + Terminal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Interactive Agent Simulator Card */}
          <div className="glass-panel-dark" style={{
            padding: '28px',
            borderRadius: '20px',
            border: '1px solid rgba(193, 255, 114, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    <Zap size={18} />
                  </div>
                  <h3 className="font-space" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                    Live Agent Execution Runner
                  </h3>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: isRunning ? 'rgba(234, 179, 8, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: isRunning ? '#eab308' : '#10b981',
                  fontWeight: 600
                }}>
                  {isRunning ? 'Agent Working...' : 'Standby'}
                </span>
              </div>

              <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.55, marginBottom: '20px' }}>
                Watch a simulated autonomous agent discover an open Arc bounty, construct a patch, pass test vectors, and disburse $1,500 USDC via sub-second Malachite BFT finality.
              </p>

              {/* Progress Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {[
                  { id: 1, label: 'Initialize Agent on Arc (Chain 5042)' },
                  { id: 2, label: 'Poll Open Bounties (/api/agent/feed)' },
                  { id: 3, label: 'Generate Patch & Vector Tests' },
                  { id: 4, label: 'Submit Pull Request to GitHub' },
                  { id: 5, label: 'EIP-3009 Gasless Relay Submission' },
                  { id: 6, label: 'Sub-second Finality: Payout Settled in USDC' },
                ].map((step) => (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: activeStep >= step.id ? 'rgba(193, 255, 114, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      border: activeStep >= step.id ? '1px solid rgba(193, 255, 114, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: activeStep >= step.id ? '#c1ff72' : 'rgba(255, 255, 255, 0.1)',
                      color: '#090d14',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      {activeStep > step.id ? <CheckCircle2 size={14} /> : step.id}
                    </div>
                    <span style={{
                      fontSize: '0.82rem',
                      color: activeStep >= step.id ? '#ffffff' : '#6b7280',
                      fontWeight: activeStep >= step.id ? 600 : 400
                    }}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              id="run-agent-simulation-btn"
              onClick={runSimulation}
              disabled={isRunning}
              className="glass-button"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: '#c1ff72',
                border: 'none',
                color: '#090d14',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isRunning ? 0.6 : 1
              }}
            >
              <Play size={16} fill="#090d14" />
              <span>{isRunning ? 'Running Autonomous Loop...' : 'Trigger Autonomous Swarm Run'}</span>
              <div className="button-shine" />
            </button>
          </div>

          {/* Live Telemetry Log Output */}
          <div className="glass-panel-dark" style={{
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Terminal Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'Geist Mono, monospace', marginLeft: '6px' }}>
                  agent_telemetry_stream.log
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#00f2fe', fontFamily: 'Geist Mono, monospace' }}>
                Malachite BFT: &lt;400ms
              </span>
            </div>

            {/* Terminal Window */}
            <div style={{
              flex: 1,
              background: '#05080f',
              borderRadius: '12px',
              padding: '16px',
              fontFamily: 'Geist Mono, monospace',
              fontSize: '0.8rem',
              color: '#9ca3af',
              overflowY: 'auto',
              maxHeight: '340px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {logs.length === 0 ? (
                <div style={{ color: '#4b5563', textAlign: 'center', marginTop: '80px' }}>
                  [Press "Trigger Autonomous Swarm Run" to execute agent lifecycle]
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#c1ff72' }}>+{log.time}</span>
                    <span style={{ color: log.id === 6 ? '#00f2fe' : '#e5e7eb' }}>{log.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Developer Integration Code Blocks */}
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 className="font-space" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>
                Machine-Readable API Specification
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>
                Plug into the ArcBounty agent feed with standard HTTP cURL or Python SDK.
              </p>
            </div>
            <button
              onClick={copyCurl}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {copiedCurl ? <Check size={14} color="#c1ff72" /> : <Copy size={14} />}
              <span>{copiedCurl ? 'Copied to Clipboard' : 'Copy cURL'}</span>
            </button>
          </div>

          <pre style={{
            background: '#05080f',
            padding: '18px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#a3e635',
            fontFamily: 'Geist Mono, monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            lineHeight: 1.6
          }}>
            {curlSnippet}
          </pre>
        </div>
      </div>
    </section>
  );
}
