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

  // Active view switcher inside admin: 'builder' or 'manage'
  const [activeTab, setActiveTab] = useState<'builder' | 'manage'>('builder');

  // Inline canvas active modal popup state ('image' | 'text' | 'grid' | 'video' | null)
  const [activeModal, setActiveModal] = useState<'image' | 'text' | 'grid' | 'video' | null>(null);

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

  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleEditProject = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setCategory(project.category);
    setAspectRatio(project.aspectRatio);
    setDescription(project.description);
    setImageUrl(project.imageUrl);
    setYoutubeUrl(project.youtubeUrl);
    setGalleryInput(project.gallery ? project.gallery.join(', ') : '');
    setActiveTab('builder');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Brand Identity');
    setAspectRatio('1:1');
    setDescription('');
    setImageUrl('');
    setYoutubeUrl('');
    setGalleryInput('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      setError('Please provide at least a project title and main thumbnail image.');
      return;
    }

    const formattedYoutubeUrl = youtubeUrl.includes('watch?v=')
      ? youtubeUrl.replace('watch?v=', 'embed/')
      : youtubeUrl.includes('youtu.be/')
      ? youtubeUrl.replace('youtu.be/', 'www.youtube.com/embed/')
      : youtubeUrl;

    if (editingId !== null) {
      const updatedProjects = projects.map(p => 
        p.id === editingId 
          ? {
              ...p,
              title,
              category,
              aspectRatio,
              description,
              imageUrl,
              youtubeUrl: formattedYoutubeUrl,
              gallery: galleryInput ? galleryInput.split(',').map(s => s.trim()) : []
            }
          : p
      );
      saveProjectsToStorage(updatedProjects);
      setSuccessMessage('Project successfully updated!');
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title,
        category,
        aspectRatio,
        description,
        imageUrl,
        youtubeUrl: formattedYoutubeUrl,
        gallery: galleryInput ? galleryInput.split(',').map(s => s.trim()) : []
      };
      saveProjectsToStorage([newProject, ...projects]);
      setSuccessMessage('Project successfully published to portfolio!');
    }
    
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setYoutubeUrl('');
    setGalleryInput('');
    setError(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDeleteProject = (id: string) => {
    saveProjectsToStorage(projects.filter(p => p.id !== id));
    if (editingId === id) handleCancelEdit();
  };

  if (isAuthenticated) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', height: '100vh', overflow: 'hidden', background: '#0a0a0c', color: '#fff', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <FloatingPathsBackground position={1} />

        {/* Top Header Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#121216', borderBottom: '1px solid rgba(255,255,255,0.08)', zIndex: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', color: '#fff' }}>DEEPHOOK AGENCY CMS</span>
            <div style={{ display: 'flex', background: '#1c1c24', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setActiveTab('builder')}
                style={{ padding: '6px 16px', background: activeTab === 'builder' ? '#272733' : 'transparent', color: activeTab === 'builder' ? '#fff' : '#888', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}
              >
                Project Builder
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                style={{ padding: '6px 16px', background: activeTab === 'manage' ? '#272733' : 'transparent', color: activeTab === 'manage' ? '#fff' : '#888', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}
              >
                Manage Works ({projects.length})
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {successMessage && (
              <span style={{ fontSize: '0.75rem', color: '#4cd964', background: 'rgba(76,217,100,0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(76,217,100,0.2)' }}>
                {successMessage}
              </span>
            )}
            <button 
              onClick={onReturn}
              style={{ padding: '8px 16px', background: 'transparent', color: '#bbb', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              ← Return to Site
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              style={{ padding: '8px 16px', background: '#1c1c24', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Main Workspace Area */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          
          {activeTab === 'builder' ? (
            <>
              {/* Central Canvas Preview / Builder Area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '40px', alignItems: 'center', justifyContent: 'flex-start', background: '#0d0d10', position: 'relative' }}>
                
                {editingId !== null && (
                  <div style={{ width: '100%', maxWidth: '720px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', padding: '10px 16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#ffc107' }}>Editing Mode Active (Project ID: {editingId})</span>
                    <button onClick={handleCancelEdit} style={{ background: 'transparent', border: 'none', color: '#ffc107', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}>Cancel Edit</button>
                  </div>
                )}

                <div style={{ width: '100%', maxWidth: '720px', textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: '#aaa', letterSpacing: '0.05em', margin: '0 0 24px 0' }}>
                    {title ? `Live Preview: "${title}"` : 'Start building your project:'}
                  </h3>
                  
                  {/* Interactive Canvas Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
                    
                    <div onClick={() => setActiveModal('image')} style={{ background: '#141419', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 12px', borderRadius: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🖼️</div>
                      <span style={{ fontSize: '0.75rem', color: '#ccc', fontWeight: 500 }}>Image</span>
                    </div>

                    <div onClick={() => setActiveModal('text')} style={{ background: '#141419', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 12px', borderRadius: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>T</div>
                      <span style={{ fontSize: '0.75rem', color: '#ccc', fontWeight: 500 }}>Text / Title</span>
                    </div>

                    <div onClick={() => setActiveModal('grid')} style={{ background: '#141419', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 12px', borderRadius: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>⊞</div>
                      <span style={{ fontSize: '0.75rem', color: '#ccc', fontWeight: 500 }}>Photo Grid</span>
                    </div>

                    <div onClick={() => setActiveModal('video')} style={{ background: '#141419', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 12px', borderRadius: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>▶</div>
                      <span style={{ fontSize: '0.75rem', color: '#ccc', fontWeight: 500 }}>Video & Audio</span>
                    </div>

                  </div>
                </div>

                {/* Live Card Preview Box */}
                {imageUrl && (
                  <div style={{ width: '100%', maxWidth: '420px', background: '#141419', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', overflow: 'hidden', padding: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <div style={{ width: '100%', height: aspectRatio === '1:1' ? '280px' : '420px', background: '#000', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                      <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#fff' }}>{title || 'Untitled Project'}</h4>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', color: '#aaa' }}>{category}</span>
                  </div>
                )}

                {/* INLINE CANVAS POPUP MODALS FOR EACH BUTTON */}
                {activeModal && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ background: '#16161c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)', position: 'relative' }}>
                      
                      <button 
                        onClick={() => setActiveModal(null)} 
                        style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#888', fontSize: '1.1rem', cursor: 'pointer' }}
                      >
                        ✕
                      </button>

                      {activeModal === 'image' && (
                        <div>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#fff' }}>Configure Thumbnail Image</h4>
                          <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 20px 0' }}>Paste the main image URL for your project card display.</p>
                          <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Image URL</label>
                          <input 
                            type="text" 
                            value={imageUrl} 
                            onChange={(e) => setImageUrl(e.target.value)} 
                            placeholder="https://images.unsplash.com/..." 
                            style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box', marginBottom: '20px' }}
                          />
                        </div>
                      )}

                      {activeModal === 'text' && (
                        <div>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#fff' }}>Configure Project Title & Description</h4>
                          <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 20px 0' }}>Set the headline title and detailed overview text.</p>
                          <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Project Title</label>
                          <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="VISUAL CONTENT CREATION..." 
                            style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' }}
                          />
                          <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Detailed Description</label>
                          <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder="Project breakdown..." 
                            rows={3} 
                            style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box', marginBottom: '20px', resize: 'vertical' }}
                          />
                        </div>
                      )}

                      {activeModal === 'grid' && (
                        <div>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#fff' }}>Configure Photo Grid Gallery</h4>
                          <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 20px 0' }}>Add extra showcase images separated by commas.</p>
                          <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Gallery URLs (comma-separated)</label>
                          <input 
                            type="text" 
                            value={galleryInput} 
                            onChange={(e) => setGalleryInput(e.target.value)} 
                            placeholder="https://img1.jpg, https://img2.jpg" 
                            style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box', marginBottom: '20px' }}
                          />
                        </div>
                      )}

                      {activeModal === 'video' && (
                        <div>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#fff' }}>Configure Video & Audio Link</h4>
                          <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 20px 0' }}>Attach a YouTube video link or embedded media source.</p>
                          <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>YouTube URL</label>
                          <input 
                            type="text" 
                            value={youtubeUrl} 
                            onChange={(e) => setYoutubeUrl(e.target.value)} 
                            placeholder="https://www.youtube.com/watch?v=..." 
                            style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box', marginBottom: '20px' }}
                          />
                        </div>
                      )}

                      <button 
                        onClick={() => setActiveModal(null)} 
                        style={{ width: '100%', background: '#fff', color: '#000', fontWeight: 600, padding: '12px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', border: 'none' }}
                      >
                        Done / Apply to Canvas
                      </button>

                    </div>
                  </div>
                )}

              </div>

              {/* Right-Hand Inspector / Config Sidebar (Main Project Meta & Publish Control) */}
              <div style={{ width: '360px', background: '#121216', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px', flexShrink: 0 }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: '#888', margin: '0 0 20px 0', textTransform: 'uppercase' }}>Project Settings</h4>

                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Project Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. VISUAL CONTENT FOR JEWELRY" 
                      style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.8rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 8px', fontSize: '0.8rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                      >
                        <option value="Banner">Banner</option>
                        <option value="Logo">Logo</option>
                        <option value="Sticker">Sticker</option>
                        <option value="Flyer">Flyer</option>
                        <option value="Brand Identity">Brand Identity</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Preview Ratio</label>
                      <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value as '1:1' | '9:16')}
                        style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 8px', fontSize: '0.8rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                      >
                        <option value="1:1">1:1 Square</option>
                        <option value="9:16">9:16 Vertical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Main Thumbnail Image URL</label>
                    <input 
                      type="text" 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..." 
                      style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.8rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>YouTube Link</label>
                    <input 
                      type="text" 
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..." 
                      style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.8rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Detailed Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Project background and overview..." 
                      rows={3}
                      style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.8rem', color: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Gallery URLs (comma-separated)</label>
                    <input 
                      type="text" 
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      placeholder="url1.jpg, url2.jpg" 
                      style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.8rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  {error && <p style={{ fontSize: '0.75rem', color: '#ff5c5c', margin: 0 }}>{error}</p>}

                  <button 
                    type="submit"
                    style={{ width: '100%', background: '#fff', color: '#000', fontWeight: 600, padding: '12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', border: 'none', marginTop: '10px', letterSpacing: '0.05em' }}
                  >
                    {editingId !== null ? 'Save Changes' : 'Publish Project'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Manage Existing Projects View */
            <div style={{ flex: 1, overflowY: 'auto', padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.1em', margin: '0 0 20px 0', textTransform: 'uppercase' }}>Manage Uploaded Projects ({projects.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map((project) => (
                  <div key={project.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#121216', border: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '56px', height: '56px', background: '#222', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>{project.title}</h4>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px', color: '#bbb' }}>{project.category}</span>
                          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#888' }}>Ratio: {project.aspectRatio}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleEditProject(project)}
                        style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Edit in Builder
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        style={{ background: 'transparent', color: '#ff5c5c', border: '1px solid rgba(255,92,92,0.3)', padding: '6px 14px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#0a0a0c', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', overflow: 'hidden' }}>
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

      <div style={{ maxWidth: '400px', width: '100%', margin: 'auto', background: '#121216', border: '1px solid rgba(255,255,255,0.08)', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.12em', textAlign: 'center', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Admin Portal</h2>
        <p style={{ fontSize: '0.75rem', color: '#777', textAlign: 'center', margin: '0 0 28px 0', letterSpacing: '0.05em' }}>Enter your agency credentials</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '6px', letterSpacing: '0.05em' }}>Email / Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="baroyannorair@gmail.com" 
              style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#999', marginBottom: '6px', letterSpacing: '0.05em' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..." 
                style={{ width: '100%', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '12px 42px 12px 14px', fontSize: '0.85rem', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
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
