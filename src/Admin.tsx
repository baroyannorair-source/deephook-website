import React, { useState } from 'react';

function FloatingPathsBackground({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <style>{`
        @keyframes floatPath {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-10px) rotate(1deg); opacity: 0.5; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
        }
        .floating-path {
          animation: floatPath 15s ease-in-out infinite;
        }
      `}</style>
      <svg
        style={{ width: '100%', height: '100%', opacity: 0.35 }}
        viewBox="0 0 696 316"
        fill="none"
      >
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.15 + (path.id % 5) * 0.05}
            className="floating-path"
            style={{ color: '#71717a', animationDelay: `${path.id * 0.5}s`, animationDuration: `${12 + (path.id % 8)}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

interface Project {
  id: string;
  title: string;
  category: string;
  aspectRatio: '1:1' | '9:16';
  description: string;
  imageUrl: string;
  youtubeUrl: string;
  gallery: string[];
}

export function AdminPortal({ onReturn }: { onReturn: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // CMS Form States synced with localStorage
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('deephook_portfolio_works');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: '1',
        title: 'VISUAL CONTENT CREATION FOR SILVER JEWELRY BRAND',
        category: 'Brand Identity',
        aspectRatio: '9:16',
        description: 'Qveen Jewellery 2021 Virtual Catwalk during London Fashion Week...',
        imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        gallery: []
      }
    ];
  });

  const saveProjectsToStorage = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('deephook_portfolio_works', JSON.stringify(updatedProjects));
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Brand Identity');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16'>('1:1');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      setError('Please provide at least a project title and main thumbnail image.');
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      title,
      category,
      aspectRatio,
      description,
      imageUrl,
      youtubeUrl,
      gallery: galleryInput ? galleryInput.split(',').map(s => s.trim()) : []
    };

    saveProjectsToStorage([newProject, ...projects]);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setYoutubeUrl('');
    setGalleryInput('');
    setError(null);
    setSuccessMessage('Project successfully uploaded to portfolio!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDeleteProject = (id: string) => {
   saveProjectsToStorage(projects.filter(p => p.id !== id));
  };

  if (isAuthenticated) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', background: '#050505', color: '#fff', padding: '40px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
        <FloatingPathsBackground position={1} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.15em', margin: 0 }}>DEEPHOOK AGENCY CMS</h1>
              <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 0 0' }}>Portfolio Manager & Uploader</p>
            </div>
            <button 
              onClick={() => setIsAuthenticated(false)}
              style={{ padding: '10px 20px', background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Log Out
            </button>
          </div>

          {successMessage && (
            <div style={{ background: 'rgba(40, 167, 69, 0.2)', border: '1px solid rgba(40, 167, 69, 0.4)', color: '#4cd964', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.85rem' }}>
              {successMessage}
            </div>
          )}

          {/* Project Upload Form */}
          <div style={{ background: 'rgba(18, 18, 18, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', padding: '32px', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '0.1em', margin: '0 0 20px 0', textTransform: 'uppercase' }}>Upload New Portfolio Work</h2>
            
            <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>Project Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. VISUAL CONTENT FOR JEWELRY BRAND" 
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>Category Tag</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="Banner">Banner</option>
                    <option value="Logo">Logo</option>
                    <option value="Sticker">Sticker</option>
                    <option value="Flyer">Flyer</option>
                    <option value="Brand Identity">Brand Identity</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>Preview Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as '1:1' | '9:16')}
                    style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="1:1">1:1 Square</option>
                    <option value="9:16">9:16 Vertical</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>Main Thumbnail Image URL</label>
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..." 
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>YouTube Video Link / Embed URL</label>
                <input 
                  type="text" 
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..." 
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>Detailed Description / Project Info</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write project background, client overview, and execution notes..." 
                  rows={4}
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>Modal Gallery Image URLs (comma-separated)</label>
                <input 
                  type="text" 
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  placeholder="https://img1.com/a.jpg, https://img2.com/b.jpg" 
                  style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit"
                style={{ width: '100%', background: '#fff', color: '#000', fontWeight: 600, padding: '12px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', border: 'none', letterSpacing: '0.05em', marginTop: '8px' }}
              >
                Publish Project to Website
              </button>
            </form>
          </div>

          {/* Existing Projects List */}
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '0.1em', margin: '0 0 16px 0', textTransform: 'uppercase' }}>Manage Uploaded Projects ({projects.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map((project) => (
                <div key={project.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 15, 15, 0.9)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '56px', height: '56px', background: '#222', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{project.title}</h4>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', color: '#ccc' }}>{project.category}</span>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', color: '#aaa' }}>Ratio: {project.aspectRatio}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    style={{ background: 'transparent', color: '#ff5c5c', border: '1px solid rgba(255,92,92,0.3)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#050505', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', overflow: 'hidden' }}>
      <FloatingPathsBackground position={1} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.25em', color: '#777', textTransform: 'uppercase' }}>DEEPHOOK AGENCY CMS</span>
        <button 
          onClick={onReturn}
          style={{ fontSize: '0.75rem', letterSpacing: '0.1em', padding: '10px 18px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}
        >
          ← Return to Site
        </button>
      </div>

      <div style={{ maxWidth: '420px', width: '100%', margin: 'auto', background: 'rgba(18, 18, 18, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 500, letterSpacing: '0.12em', textAlign: 'center', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Admin Portal</h2>
        <p style={{ fontSize: '0.75rem', color: '#777', textAlign: 'center', margin: '0 0 28px 0', letterSpacing: '0.05em' }}>Enter your agency credentials</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>Email / Username</label>
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
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..." 
                style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 42px 12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
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
      <div style={{ position: 'relative', zIndex: 1 }} />
    </div>
  );
}
