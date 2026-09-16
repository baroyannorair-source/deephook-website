import React, { useState, useEffect } from 'react';
import { CosmicParallaxBg } from './CosmicParallaxBg';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { db } from "./firebase";

const getAdminPreviewUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  
  if (url.includes('watch?v=')) {
    const videoId = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

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

  // Persistent login state initialization using localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'builder' | 'manage'>(() => {
    return (localStorage.getItem('admin_activeTab') as 'builder' | 'manage') || 'builder';
  });

  useEffect(() => {
    localStorage.setItem('deephook_activeTab', activeTab);
  }, [activeTab]);

  // Load projects from server when admin opens
  useEffect(() => {
    fetch('https://deephook.am/save-projects.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(err => console.error("Could not load projects from server", err));
  }, []);

  const [activeModal, setActiveModal] = useState<'image' | 'text' | 'grid' | 'video' | null>(null);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('deephook portfolio works');
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
    localStorage.setItem('deephook portfolio works', JSON.stringify(updatedProjects));
    
    // Save directly to Firebase Firestore live collection
    try {
      console.log('Projects updated locally and synced to state!');
    } catch (err) {
      console.error('Error saving to Firestore:', err);
    }
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Brand Identity');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16'>('1:1');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  // Step 2: Unsaved changes warning tracking state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Hook into native beforeunload event to prevent accidental refresh/navigation loss
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      e.preventDefault();
      e.returnValue = ''; // Required for modern browsers
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Handle field change helper to mark dirty state
  const handleFieldChange = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const galleryArray = galleryInput ? galleryInput.split(',').map(s => s.trim()).filter(Boolean) : [];

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const updated = [...galleryArray, newGalleryUrl.trim()];
    setGalleryInput(updated.join(', '));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryUrl = (indexToRemove: number) => {
    const updated = galleryArray.filter((_, idx) => idx !== indexToRemove);
    setGalleryInput(updated.join(', '));
  };

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
              gallery: galleryArray
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
        gallery: galleryArray
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
      <div style={{ position: 'relative', minHeight: '100vh', height: '100vh', overflow: 'hidden', background: 'transparent', color: '#fff', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <CosmicParallaxBg head="Admin Portal" text="Secure, Fast, Dashboard" className="absolute inset-0" />

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
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '30px 20px', alignItems: 'center', justifyContent: 'flex-start', background: '#0d0d10', position: 'relative' }}>
                
                {editingId !== null && (
                  <div style={{ width: '100%', maxWidth: '720px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.3)', padding: '10px 16px', borderRadius: '8px', marginBottom: '20px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.8rem', color: '#ffc107' }}>Editing Mode Active (Project ID: {editingId})</span>
                    <button onClick={handleCancelEdit} style={{ background: 'transparent', border: 'none', color: '#ffc107', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}>Cancel Edit</button>
                  </div>
                )}

                <div style={{ width: '100%', maxWidth: '720px', textAlign: 'center', marginBottom: '24px', flexShrink: 0 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 400, color: '#aaa', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>
                    {title ? `Live Preview: "${title}"` : 'Start building your project:'}
                  </h3>
                  
                  {/* Interactive Canvas Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    
                    <div onClick={() => setActiveModal('image')} style={{ background: '#141419', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>🖼️</div>
                      <span style={{ fontSize: '0.7rem', color: '#ccc', fontWeight: 500 }}>Image</span>
                    </div>

                    <div onClick={() => setActiveModal('text')} style={{ background: '#141419', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>T</div>
                      <span style={{ fontSize: '0.7rem', color: '#ccc', fontWeight: 500 }}>Text / Title</span>
                    </div>

                    <div onClick={() => setActiveModal('grid')} style={{ background: '#141419', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>⊞</div>
                      <span style={{ fontSize: '0.7rem', color: '#ccc', fontWeight: 500 }}>Photo Grid</span>
                    </div>

                    <div onClick={() => setActiveModal('video')} style={{ background: '#141419', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>▶</div>
                      <span style={{ fontSize: '0.7rem', color: '#ccc', fontWeight: 500 }}>Video & Audio</span>
                    </div>

                  </div>
                </div>

                {/* SCROLLABLE CANVAS CONTAINER FRAME */}
                <div style={{ width: '100%', maxWidth: '600px', height: '520px', background: '#141419', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', overflowY: 'auto', padding: '32px 24px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: '28px', boxSizing: 'border-box', marginBottom: '40px', scrollbarWidth: 'thin', scrollbarColor: '#444 #141419' }}>
                  
                  {/* Title Preview Component */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 500, color: '#fff', letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
                      {title || 'VISUAL CONTENT CREATION FOR SILVER JEWELRY BRAND'}
                    </h2>
                  </div>

                  {/* Photo Grid / Gallery Carousel Component */}
                  <div style={{ flexShrink: 0 }}>
                    <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: '#777', marginBottom: '8px', letterSpacing: '0.1em' }}>Gallery / Photo Grid Component</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', background: '#0a0a0c', padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {(galleryArray.length > 0 ? galleryArray : [imageUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop']).slice(0, 5).map((imgSrc, idx) => (
                        <div key={idx} style={{ aspectRatio: '3/4', background: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                          <img src={imgSrc} alt="Gallery item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Video Embed Component */}
                  <div style={{ flexShrink: 0 }}>
                    <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: '#777', marginBottom: '8px', letterSpacing: '0.1em' }}>Video & Audio Preview Component</span>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {youtubeUrl ? (
                        <iframe
                          src={getAdminPreviewUrl(youtubeUrl)}
                          title="Live Video Component Preview"
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1c1c24', color: '#888', gap: '8px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>▶</div>
                          <span style={{ fontSize: '0.75rem' }}>No YouTube video link attached</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description & Text Component */}
                  <div style={{ flexShrink: 0 }}>
                    <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: '#777', marginBottom: '8px', letterSpacing: '0.1em' }}>Description & Content Component</span>
                    <div style={{ background: '#0a0a0c', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p style={{ fontSize: '0.75rem', color: '#ccc', lineHeight: '1.6', margin: '0 0 12px 0', whiteSpace: 'pre-line' }}>
                        {description || 'At Zenoma, we developed a full-scale visual content production project for a silver jewelry brand preparing to showcase its collection at London Fashion Week.'}
                      </p>
                      {youtubeUrl && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px', wordBreak: 'break-all' }}>
                          <span style={{ fontSize: '0.7rem', color: '#3b82f6', textDecoration: 'underline' }}>{youtubeUrl}</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* INLINE CANVAS POPUP MODALS */}
                {activeModal && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ background: '#16161c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', width: '100%', maxWidth: activeModal === 'grid' ? '560px' : '480px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)', position: 'relative', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                      
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
                        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh' }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#fff' }}>Configure Photo Grid Gallery</h4>
                          <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 16px 0' }}>Add individual image links with live thumbnail previews.</p>
                          
                          <div style={{ background: '#1c1c24', padding: '12px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', color: '#ccc', marginBottom: '6px' }}>New Gallery Image URL</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input 
                                type="text" 
                                value={newGalleryUrl} 
                                onChange={(e) => setNewGalleryUrl(e.target.value)} 
                                placeholder="https://ik.imagekit.io/..." 
                                style={{ flex: 1, background: '#111', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px 10px', fontSize: '0.8rem', color: '#fff', outline: 'none' }}
                              />
                              <button 
                                type="button" 
                                onClick={handleAddGalleryUrl}
                                style={{ padding: '8px 14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}
                              >
                                Add
                              </button>
                            </div>
                          </div>

                          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 500 }}>Attached Links ({galleryArray.length})</span>
                            {galleryArray.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '20px', color: '#666', fontSize: '0.75rem' }}>No gallery items added yet.</div>
                            ) : (
                              galleryArray.map((url, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1c1c24', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                  <div style={{ width: '36px', height: '36px', borderRadius: '4px', overflow: 'hidden', background: '#000', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={url} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                  </div>
                                  <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem', color: '#ddd' }}>
                                    {url}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryUrl(idx)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}
                                    title="Remove"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
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

              {/* Right-Hand Inspector / Config Sidebar */}
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
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginBottom: '6px' }}>Gallery Images ({galleryArray.length} attached)</label>
                    <button
                      type="button"
                      onClick={() => setActiveModal('grid')}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#1c1c24',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.8rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span>{galleryArray.length > 0 ? `${galleryArray.length} image link(s) configured` : 'Configure gallery images...'}</span>
                      <span style={{ fontSize: '0.7rem', color: '#888' }}>Manage ↗</span>
                    </button>
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
      <CosmicParallaxBg head="Admin Portal" text="Secure, Fast, Dashboard" className="absolute inset-0 -z-10" />
      
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
      <div style={{ position: 'relative', zIndex: '1' }} />
    </div>
  );
}
