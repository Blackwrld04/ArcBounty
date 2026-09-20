import React, { useState } from 'react';
import { X, Check, ArrowRight, Wallet, Shield, Zap, Sparkles, Palette } from 'lucide-react';

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
          borderRadius: '14px',
          border: 'var(--border-thick)',
          boxShadow: 'var(--shadow-hard)',
          position: 'relative',
          minHeight: '480px',
          background: '#ffffff'
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
            background: '#ffffff',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} color="#000000" />
        </button>

        {/* Left Brand Panel (Circle Arc Navy Theme) */}
        <div style={{
          width: '40%',
          background: 'linear-gradient(135deg, #1b3158 0%, #2f578c 100%)',
          color: '#ffffff',
          padding: '36px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '2.5px solid #000000'
        }} className="desktop-only">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1.5px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--arc-protocol-navy)'
              }}>
                <Zap size={18} fill="#e9a13f" color="#e9a13f" />
              </div>
              <span className="font-space" style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Arc<span style={{ color: 'var(--arc-token-sand)' }}>Bounty</span>
              </span>
            </div>

            <h3 className="font-space" style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '14px' }}>
              The Capital Engine for Web3 Creators
            </h3>

            <p style={{ fontSize: '0.85rem', opacity: 0.88, lineHeight: 1.5, marginBottom: '24px' }}>
              Sign in to earn canonical Circle USDC with zero gas fees or fund creative bounties in Content, Design, Dev, and Social.
            </p>

            {/* Feature Bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="var(--arc-token-sand)" strokeWidth={3} />
                <span>Zero creator gas via EIP-3009 transfer authorizations.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="var(--arc-token-sand)" strokeWidth={3} />
                <span>Deterministic &lt;400ms Malachite BFT instant settlement.</span>
              </div>
            </div>
          </div>

          {/* Verified Creator Guild Badge */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'var(--arc-blockstream-gold)',
              border: '1.5px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Palette size={20} color="#000000" strokeWidth={2.4} />
            </div>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 800, margin: 0 }}>Verified Creator Guild</p>
              <p style={{ fontSize: '0.72rem', opacity: 0.8, margin: 0 }}>Design · Content · Dev · Social</p>
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
            <h3 className="font-space" style={{ fontSize: '1.65rem', fontWeight: 900, color: '#000000' }}>
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#4b5563', marginTop: '4px', fontWeight: 500 }}>
              {mode === 'login' ? 'Login to your ArcBounty creator profile' : 'Join thousands of Web3 creators and sponsors on Circle Arc'}
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
                  borderRadius: '8px',
                  border: '2px solid #000000',
                  boxShadow: '2px 2px 0px #000000',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
            >
              <span>{isLoading ? 'Processing...' : mode === 'login' ? 'Continue with Email' : 'Sign Up with Email'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span>OR CONNECT WITH</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Social / Wallet Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#ffffff',
                border: '2px solid #000000',
                boxShadow: '2px 2px 0px #000000',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
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
                borderRadius: '8px',
                background: '#ffffff',
                border: '2px solid #000000',
                boxShadow: '2px 2px 0px #000000',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
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
                borderRadius: '8px',
                background: 'var(--arc-static-ether)',
                border: '2px solid #000000',
                boxShadow: '2px 2px 0px #000000',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--arc-protocol-navy)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              <Wallet size={16} />
              <span>Connect Web3 Wallet (MetaMask / Rabby)</span>
            </button>
          </div>

          {/* Toggle between mode */}
          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#4b5563', marginTop: '18px', fontWeight: 600 }}>
            {mode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--arc-validator-blue)',
                fontWeight: 800,
                cursor: 'pointer',
                marginLeft: '6px',
                textDecoration: 'underline'
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b', marginTop: '10px' }}>
            By continuing, you confirm that you accept our Terms of Service &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
