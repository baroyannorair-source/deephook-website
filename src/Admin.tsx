import React from 'react';

export default function Admin() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Deephook Agency Admin Portal</h1>
          <span style={{ background: '#e2e8f0', padding: '6px 12px', borderRadius: '6px', fontSize: '14px' }}>Authorized</span>
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

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#333' }}>Client Messages & Form Submissions</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Manage incoming leads routed through your EmailJS client inquiry forms here.</p>
        </div>
      </div>
    </div>
  );
}
