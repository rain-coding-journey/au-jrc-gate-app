import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { QRScanner } from './components/QRScanner';
import { QRGenerator } from './components/QRGenerator';
import { LoginModal } from './components/LoginModal';

function MainTabs() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'generator' | 'logs'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Navigation Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid var(--border)',
        paddingBottom: '8px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('scanner')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeTab === 'scanner' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'scanner' ? '#fff' : 'var(--text-main)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          📷 Live Gate Scanner
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeTab === 'generator' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'generator' ? '#fff' : 'var(--text-main)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🎴 Pass Generator
        </button>

        {user?.role === 'staff' && (
          <button
            onClick={() => setActiveTab('logs')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'logs' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'logs' ? '#fff' : 'var(--text-main)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📊 Entry Audit Logs
          </button>
        )}
      </div>

      {/* Tab Panels */}
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
        {activeTab === 'scanner' && (
          <QRScanner officerId={user?.id || 'OFFICER-101'} gateLocation="Gov. Pascual Ave Gate 1" />
        )}

        {activeTab === 'generator' && (
          <QRGenerator />
        )}

        {activeTab === 'logs' && user?.role === 'staff' && (
          <div>
            <h3>Audit Entry Records</h3>
            <p style={{ color: 'var(--text-muted)' }}>Historical logs from database entries.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PortalContent() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header Bar */}
      <header style={{
        backgroundColor: 'var(--primary)',
        color: '#fff',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>Arellano University — Jose Rizal Campus</h1>
          <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>Gate Security & Entry Portal</p>
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.name} ({user.role.toUpperCase()})</span>
            <button
              onClick={logout}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#fff', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            Sign In
          </button>
        )}
      </header>

      {/* Main Body */}
      <main style={{ flex: 1, maxWidth: '800px', width: '100%', margin: '0 auto', padding: '24px 16px' }}>
        <MainTabs />
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
        Arellano University Gate Security &copy; {new Date().getFullYear()} — All Rights Reserved
      </footer>

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