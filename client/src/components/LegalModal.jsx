import React from 'react';
import { X, FileText, Shield, HelpCircle, Mail, MessageSquare, ExternalLink } from 'lucide-react';

export default function LegalModal({ type, onClose }) {
  if (!type) return null;

  const contentMap = {
    terms: {
      title: 'Terms of Service',
      subtitle: 'ArcBounty Institutional Challenge & Escrow Protocol Rules',
      icon: <FileText size={20} color="#1b3158" />,
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
          <div>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>1. Bounty Creation &amp; Escrow Funding</strong>
            Sponsors post challenges by depositing USDC into the designated platform escrow wallet (0x8b415aE3956992b0cbC6C78c485A4d099F6331cE). All funds remain securely locked in escrow until deliverable approval and distribution.
          </div>
          <div>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>2. Deliverable Submissions &amp; Work Ownership</strong>
            Creators submitting deliverables retain copyright until winner selection and reward payout. Upon distribution of USDC from escrow, full commercial usage rights transfer to the challenge sponsor.
          </div>
          <div>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>3. Payout Settlement &amp; Malachite BFT Finality</strong>
            Payouts are disbursed directly by the platform admin from the escrow contract to the creator's designated wallet address with deterministic &lt;400ms finality.
          </div>
          <div>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>4. Code of Conduct</strong>
            Plagiarism, misleading work, or fraudulent activity results in immediate platform disqualification and forfeiture of challenge payouts.
          </div>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Creator Data, Cryptographic Verification & Security',
      icon: <Shield size={20} color="#166534" />,
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
          <div>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>1. Minimalist Data Collection</strong>
            ArcBounty adheres to strict Web3 data minimization. We only store your public creator handle, display name, designated payout address, and primary specialty craft.
          </div>
          <div>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>2. Email &amp; Gmail Verification</strong>
            Your email is used solely to authenticate your creator account and dispatch single-use 6-digit verification codes via authenticated Gmail SMTP. We never sell, rent, or spam your inbox.
          </div>
          <div>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>3. On-Chain Cryptographic Privacy</strong>
            Wallet connections utilize EIP-4361 Sign-In with Ethereum (SIWE). No private keys or seed phrases ever leave your browser wallet extension.
          </div>
          <div>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>4. Persistent SQLite Storage</strong>
            User records and payout transactions are securely persisted in encrypted SQLite storage with WAL journaling.
          </div>
        </div>
      )
    },
    support: {
      title: 'Support & Assistance',
      subtitle: 'Get Help with Challenges, Submissions & Payouts',
      icon: <HelpCircle size={20} color="#d97706" />,
      body: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            Have a question about an active bounty, deliverable verification, or an escrow payout? Our core team and community moderators are here to assist.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                border: '2px solid #000000',
                background: '#fffae6',
                boxShadow: '2px 2px 0px #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#000000" />
                <div>
                  <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.86rem' }}>Official Email Support</strong>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Direct assistance from core maintainers</span>
                </div>
              </div>
              <a
                href="mailto:support@arcbounty.io"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
              >
                support@arcbounty.io
              </a>
            </div>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                border: '2px solid #000000',
                background: '#ffffff',
                boxShadow: '2px 2px 0px #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={18} color="#000000" />
                <div>
                  <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.86rem' }}>Community Discord</strong>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Chat with sponsors and creators</span>
                </div>
              </div>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none', gap: '4px' }}
              >
                <span>Join Discord</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )
    }
  };

  const item = contentMap[type] || contentMap.terms;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="clean-card slide-step"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '28px',
          borderRadius: '12px',
          border: '2.5px solid #000000',
          boxShadow: '6px 6px 0px #000000',
          background: '#ffffff',
          position: 'relative',
          maxHeight: '88vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#ffffff',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} color="#000000" />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', paddingRight: '36px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {item.icon}
          </div>
          <div>
            <h3 className="font-space" style={{ fontSize: '1.25rem', fontWeight: 900, color: '#000000', margin: 0 }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: 600 }}>
              {item.subtitle}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1.5px solid #e2e8f0', paddingTop: '16px', marginBottom: '20px' }}>
          {item.body}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', padding: '10px', fontSize: '0.86rem', justifyContent: 'center' }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
