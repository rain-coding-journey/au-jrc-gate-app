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
        paddingBottom: '8px'
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