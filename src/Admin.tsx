import React, { useState } from 'react';

export function AdminPortal({ onReturn }: { onReturn: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validAdmins = [
      { email: 'deephook.agency@gmail.com', password: 'byebyeBrain' },
      { email: 'baroyannorair@gmail.com', password: 'byebyeBrain' }
    ];

    const isMasterKey = password === 'deephook2026' && (username === 'admin' || username === 'deephook2026' || username === '');
    const isValidUser = validAdmins.some(
      admin => username.trim().toLowerCase() === admin.email.toLowerCase() && password === admin.pass
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
      <div className="min-h-screen bg-black text-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-wider">DEEPHOOK AGENCY CMS — DASHBOARD</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm rounded transition"
          >
            Log Out
          </button>
        </div>
        {/* Your Admin Dashboard Content Goes Here */}
        <p className="text-zinc-400">Welcome to the authorized management portal.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6">
      <div className="flex justify-between items-center">
        <span className="text-xs tracking-widest text-zinc-400">DEEPHOOK AGENCY CMS</span>
        <button 
          onClick={onReturn}
          className="text-xs tracking-wider px-4 py-2 border border-zinc-700 hover:border-zinc-500 rounded transition"
        >
          ← Return to Site
        </button>
      </div>

      <div className="max-w-md w-full mx-auto bg-zinc-900/50 border border-zinc-800 p-8 rounded-xl shadow-2xl">
        <h2 className="text-xl font-medium tracking-wide text-center mb-2">ADMIN PORTAL</h2>
        <p className="text-xs text-zinc-500 text-center mb-6">Enter your agency credentials or master key</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Email / Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="name@deephook.agency or admin" 
              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..." 
              className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-600"
              required
            />
          </div>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-white text-black font-medium py-2 rounded text-sm hover:bg-zinc-200 transition"
          >
            Login
          </button>
        </form>
      </div>

      <div></div> {/* Spacer to keep layout balanced */}
    </div>
  );
}
