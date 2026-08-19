import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { QRScanner } from './components/QRScanner';
import { LoginModal } from './components/LoginModal';

function PortalContent() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--primary)', color: '#fff', padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', margin: 0 }}>Arellano University — Jose Rizal Campus</h1>
          <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Gate Security & Audit Portal</p>
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem' }}>{user.name} ({user.role.toUpperCase()})</span>
            <button onClick={logout} style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Sign In</button>
        )}
      </header>

      {/* Dynamic Main Body based on Role */}
      <main style={{ flex: 1, maxWidth: '800px', width: '100%', margin: '0 auto', padding: '24px 16px' }}>
        {!user ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2>Welcome to AU JRC Security System</h2>
            <p style={{ color: 'var(--text-muted)' }}>Please sign in as Guard or Staff to access your module.</p>
            <button onClick={() => setShowLogin(true)} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Select Role & Login
            </button>
          </div>
        ) : user.role === 'guard' ? (
          /* Guard Module: Active Camera Scanner */
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ marginBottom: '12px' }}>Gate Entry Scanner</h3>
            <QRScanner officerId={user.id} gateLocation="Gov. Pascual Ave Gate 1" />
          </div>
        ) : (
          /* Staff Module: Logs Overview */
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ marginBottom: '12px' }}>Staff Audit Portal</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time gate traffic and student clearance verification system.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', fontSize: '0.85rem' }}>
                  <th style={{ padding: '8px' }}>Time</th>
                  <th style={{ padding: '8px' }}>Student ID</th>
                  <th style={{ padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                <tr>
                  <td style={{ padding: '8px' }}>08:15 AM</td>
                  <td style={{ padding: '8px' }}>2024-00129</td>
                  <td style={{ padding: '8px', color: 'green' }}>Cleared</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PortalContent />
    </AuthProvider>
  );
}