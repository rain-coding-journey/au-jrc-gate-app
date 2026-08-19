import React from 'react';
import { QRScanner } from './components/QRScanner';

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Header / App Bar */}
      <header style={{
        backgroundColor: 'var(--primary)',
        color: '#ffffff',
        padding: '16px 24px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '18px'
          }}>
            AU
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0, lineHeight: 1.2 }}>
              Arellano University — Jose Rizal Campus
            </h1>
            <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0 }}>
              Security Gate Entry & Log Verification Portal
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.825rem'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981'
          }}></span>
          <span>System Online</span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        flex: 1,
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Officer Meta Card */}
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '16px 20px',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Active Gate
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Gov. Pascual Ave Gate 1
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Officer ID
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>
              OFFICER-JRC-101
            </div>
          </div>
        </div>

        {/* Scanner Container Card */}
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <QRScanner officerId="OFFICER-JRC-101" gateLocation="Gov. Pascual Ave Gate 1" />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '16px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)'
      }}>
        Arellano University Gate Security &copy; {new Date().getFullYear()} — All Rights Reserved
      </footer>
    </div>
  );
}