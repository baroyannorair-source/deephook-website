import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Floating Paths Background Component integrated directly
function FloatingPathsBackground({
  position,
  children,
  className,
}: {
  position: number;
  className?: string;
  children: React.ReactNode;
}) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(255,255,255,${0.05 + i * 0.02})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className={`w-full relative overflow-hidden ${className || ''}`}>
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full text-zinc-700 opacity-40"
          viewBox="0 0 696 316"
          fill="none"
        >
          {paths.map((path) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={0.15 + path.id * 0.02}
              initial={{ pathLength: 0.3, opacity: 0.4 }}
              animate={{
                pathLength: 1,
                opacity: [0.2, 0.5, 0.2],
                pathOffset: [0, 1, 0],
              }}
              transition={{
                duration: 20 + (path.id % 10),
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </svg>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

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
      <FloatingPathsBackground position={1} className="min-h-screen bg-black text-white p-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.15em', margin: 0 }}>DEEPHOOK AGENCY CMS — DASHBOARD</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            style={{ padding: '8px 16px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Log Out
          </button>
        </div>
        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Welcome to the authorized management portal.</p>
      </FloatingPathsBackground>
    );
  }

  return (
    <FloatingPathsBackground position={1} className="min-h-screen bg-black text-white flex flex-col justify-between p-6 box-border" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase' }}>DEEPHOOK AGENCY CMS</span>
        <button 
          onClick={onReturn}
          style={{ fontSize: '0.75rem', letterSpacing: '0.1em', padding: '8px 16px', background: 'transparent', color: '#fff', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' }}
        >
          ← Return to Site
        </button>
      </div>

      <div style={{ maxWidth: '420px', width: '100%', margin: '40px auto', background: 'rgba(15, 15, 15, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', padding: '32px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.1em', textAlign: 'center', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Admin Portal</h2>
        <p style={{ fontSize: '0.75rem', color: '#888', textAlign: 'center', margin: '0 0 24px 0', letterSpacing: '0.05em' }}>Enter your agency credentials</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px', letterSpacing: '0.05em' }}>Email / Username (Optional if using master key)</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="baroyannorair@gmail.com" 
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', padding: '10px 12px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px', letterSpacing: '0.05em' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..." 
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', padding: '10px 12px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
              required
            />
          </div>

          {error && <p style={{ fontSize: '0.75rem', color: '#ff6b6b', textAlign: 'center', margin: 0 }}>{error}</p>}

          <button 
            type="submit"
            style={{ width: '100%', background: '#fff', color: '#000', fontWeight: 600, padding: '11px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', border: 'none', marginTop: '4px' }}
          >
            Login
          </button>
        </form>
      </div>
      <div />
    </FloatingPathsBackground>
  );
}
