import React, { useState } from 'react';

// Authorized admin list with emails and passwords (all have full control)
const AUTHORIZED_ADMINS = [
  { email: 'deephook.agency@gmail.com', password: 'byebyeBrain' },
  { email: 'baroyannorair@gmail.com', password: 'byebyeBrain' },
  // You can easily add more admins here:
  // { email: 'anotheradmin@deephook.agency', password: 'TheirPassword789' },
];

export default function Admin() {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState<{ email: string } | null>(null);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const matchedAdmin = AUTHORIZED_ADMINS.find(
      (admin) => admin.email.toLowerCase() === emailInput.trim().toLowerCase()
    );

    if (!matchedAdmin) {
      setLoginError('Access denied: Email not registered as an admin.');
      return;
    }

    if (matchedAdmin.password !== passwordInput) {
      setLoginError('Incorrect password.');
      return;
    }

    setCurrentAdmin({ email: matchedAdmin.email });
  };

  // Login form view
  if (!currentAdmin) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '400px', width: '100%', background: '#141414', padding: '30px', borderRadius: '8px', border: '1px solid #222' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '10px', textAlign: 'center' }}>Deephook Admin Portal</h2>
          <p style={{ color: '#888', fontSize: '13px', textAlign: 'center', marginBottom: '25px' }}>Sign in with your authorized agency email</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="email"
              placeholder="agency email (e.g. designer@deephook.agency)"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{ padding: '12px', background: '#1f1f1f', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              style={{ padding: '12px', background: '#1f1f1f', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '14px' }}
            />
            {loginError && <p style={{ color: '#ff5c5c', fontSize: '12px', margin: 0 }}>{loginError}</p>}
            <button type="submit" style={{ padding: '12px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Full Control Dashboard view for any logged-in admin
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' }}>Deephook Agency Admin Portal</h1>
            <span style={{ color: '#666', fontSize: '14px' }}>Logged in as: <strong>{currentAdmin.email}</strong> (Full Access)</span>
          </div>
          <button 
            onClick={() => setCurrentAdmin(null)}
            style={{ background: '#e2e8f0', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: '600', color: '#333' }}
          >
            Log Out
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Total Inquiries</h3>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#111' }}>—</p>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Active Projects</h3>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#111' }}>—</p>
          </div>
        </div>

        {/* Full Management Tools Panel */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '10px', color: '#333' }}>⚙️ Full Agency Controls</h2>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>You have full administrative privileges to manage portfolio projects, upload media (1:1 and 9:16), edit content, and handle inquiries.</p>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#333' }}>Client Messages & Form Submissions</h2>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Manage incoming leads routed through your EmailJS client inquiry forms here.</p>
        </div>
      </div>
    </div>
  );
}
