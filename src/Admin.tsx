import React, { useState } from 'react';

export function AdminPortal({ onReturn }: { onReturn: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validAdmins = [
      { email: 'baroyannorair@gmail.com', pass: 'byebyeBrain' },
      { email: 'deephook.agency@gmail.com', pass: 'byebyeBrain' }
    ];

    const isMasterKey = password === 'byebyeBrain';
    const isValidUser = validAdmins.some(
      admin => (username === '' || username.toLowerCase() === admin.email.toLowerCase()) && password === admin.pass
    );

    if (isMasterKey || isValidUser) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  if (isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.15em', margin: 0 }}>DEEPHOOK AGENCY CMS — DASHBOARD</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            style={{ padding: '10px 20px', background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Log Out
          </button>
        </div>
        <p style={{ color: '#888', fontSize: '0.95rem' }}>Welcome to the authorized management portal.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: '#777', textTransform: 'uppercase' }}>DEEPHOOK AGENCY CMS</span>
        <button 
          onClick={onReturn}
          style={{ fontSize: '0.75rem', letterSpacing: '0.1em', padding: '10px 18px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}
        >
          ← Return to Site
        </button>
      </div>

      <div style={{ maxWidth: '420px', width: '100%', margin: 'auto', background: 'rgba(18, 18, 18, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 500, letterSpacing: '0.12em', textAlign: 'center', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Admin Portal</h2>
        <p style={{ fontSize: '0.75rem', color: '#777', textAlign: 'center', margin: '0 0 28px 0', letterSpacing: '0.05em' }}>Enter your agency credentials</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>Email / Username (Optional if using master key)</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="baroyannorair@gmail.com" 
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..." 
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
              required
            />
          </div>

          {error && <p style={{ fontSize: '0.75rem', color: '#ff5c5c', textAlign: 'center', margin: 0 }}>{error}</p>}

          <button 
            type="submit"
            style={{ width: '100%', background: '#fff', color: '#000', fontWeight: 600, padding: '12px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', border: 'none', marginTop: '6px', letterSpacing: '0.05em' }}
          >
            Login
          </button>
        </form>
      </div>
      <div />
    </div>
  );
}
