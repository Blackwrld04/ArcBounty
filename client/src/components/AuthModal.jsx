import React, { useState } from 'react';
import { X, Check, ArrowRight, Wallet, Shield, Zap, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: email.split('@')[0],
        username: email.split('@')[0],
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        address: '0x461cd48D95993242bB04774cc68042795586BbAd',
        balance: 10000,
        type: 'email'
      });
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: 'Olajide Abdulquadri',
        username: 'olajide-amaranth-18',
        email: 'olajideabdulquadri22@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        address: '0x461cd48D95993242bB04774cc68042795586BbAd',
        balance: 10000,
        type: provider
      });
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="clean-card"
        style={{
          width: '100%',
          maxWidth: '820px',
          display: 'flex',
          overflow: 'hidden',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          minHeight: '480px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} color="#64748b" />
        </button>

        {/* Left Panel: Value Proposition & 3D Artwork (Gibwork style) */}
        <div
          className="desktop-only"
          style={{
            width: '42%',
            background: 'linear-gradient(145deg, #1b3158 0%, #2f578c 50%, #412c5c 100%)',
            color: '#ffffff',
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '18px' }}>
              <Zap size={13} fill="#ffcc6f" color="#ffcc6f" />
              <span>Circle Arc Ecosystem</span>
            </div>

            <h2 className="font-space" style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '14px' }}>
              Find Talent, Find Work
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', opacity: 0.9 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Check size={16} color="#acc6e9" style={{ marginTop: '2px', flexShrink: 0 }} strokeWidth={2.5} />
                <span>Global access to top Web3 creators without traditional barriers.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Check size={16} color="#acc6e9" style={{ marginTop: '2px', flexShrink: 0 }} strokeWidth={2.5} />
                <span>Escrowed in pure Circle USDC (0x3600...0000) with zero gas for creators.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Check size={16} color="#acc6e9" style={{ marginTop: '2px', flexShrink: 0 }} strokeWidth={2.5} />
                <span>Deterministic &lt;400ms Malachite BFT instant settlement.</span>
              </div>
            </div>
          </div>

          {/* 3D Creator Badge */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '14px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#e9a13f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              🎨
            </div>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>Verified Creator Guild</p>
              <p style={{ fontSize: '0.72rem', opacity: 0.75, margin: 0 }}>Design · Video · Writing · Dev</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Authentication Forms */}
        <div style={{
          flex: 1,
          padding: '40px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ marginBottom: '22px' }}>
            <h3 className="font-space" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px' }}>
              {mode === 'login' ? 'Login to your ArcBounty creator account' : 'Join thousands of Web3 creators and sponsors'}
            </p>
          </div>

          {/* Email input form */}
          <form onSubmit={handleEmailSubmit} style={{ marginBottom: '18px' }}>
            <div style={{ marginBottom: '12px' }}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color 0.15s ease'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'var(--arc-protocol-navy)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.15s ease'
              }}
            >
              <span>{isLoading ? 'Authenticating...' : 'Continue with Email'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Social & Web3 Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('github')}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('wallet')}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--arc-validator-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Wallet size={16} />
              <span>Connect Web3 Wallet (MetaMask / Rabby)</span>
            </button>
          </div>

          {/* Toggle between mode */}
          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748b', marginTop: '18px' }}>
            {mode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--arc-validator-blue)',
                fontWeight: 700,
                cursor: 'pointer',
                marginLeft: '4px'
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', marginTop: '10px' }}>
            By continuing, you confirm that you accept our Terms of Service &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
