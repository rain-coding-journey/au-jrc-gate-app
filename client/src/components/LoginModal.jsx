import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [role, setRole] = useState('guard');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!userId) return;
    const displayName = role === 'guard' ? `Guard ${userId}` : `Staff ${userId}`;
    login(role, userId, displayName);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '24px', borderRadius: '12px',
        width: '100%', maxWidth: '360px', boxShadow: 'var(--shadow-md)'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--primary)' }}>Portal Sign In</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', marginTop: '4px' }}
            >
              <option value="guard">Security Guard</option>
              <option value="staff">AU JRC Staff / Admin</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>ID Number</label>
            <input 
              type="text" 
              placeholder="e.g., GUARD-101 or STAFF-202" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', marginTop: '4px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', marginTop: '4px' }}
            />
          </div>
          <button 
            type="submit" 
            style={{ 
              backgroundColor: 'var(--primary)', color: '#fff', padding: '10px', 
              borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '8px' 
            }}
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}