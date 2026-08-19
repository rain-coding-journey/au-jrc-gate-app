import React from 'react';
import { QRScanner } from './components/QRScanner';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          <h2>Component Crashed</h2>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '24px 12px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#002B49', margin: 0 }}>Arellano University - Jose Rizal Campus</h1>
        <p style={{ color: '#555', marginTop: '4px' }}>Security Gate Entry & Log Verification Portal</p>
      </header>

      <main>
        <ErrorBoundary>
          <QRScanner officerId="OFFICER-JRC-101" gateLocation="Gov. Pascual Ave Gate 1" />
        </ErrorBoundary>
      </main>
    </div>
  );
}