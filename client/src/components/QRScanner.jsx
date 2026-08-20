import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { saveScanOffline, getOfflineScans, clearOfflineScans } from '../utils/offlineDb';

export const QRScanner = ({ officerId, gateLocation }) => {
  const [scanResult, setScanResult] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 });
    scanner.render(handleScanSuccess, () => {});

    return () => {
      scanner.clear().catch(() => {});
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = async () => {
    const pendingLogs = await getOfflineScans();
    if (pendingLogs.length === 0) return;

    setSyncing(true);
    try {
      const response = await fetch('/api/v1/scan/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
        },
        body: JSON.stringify({
          device_id: 'GUARD-TABLET-MAIN',
          logs: pendingLogs,
        }),
      });

      if (response.ok) {
        await clearOfflineScans();
        console.log('Offline queue successfully synced to server');
      }
    } catch (err) {
      console.error('Failed sync attempt:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleScanSuccess = async (decodedText) => {
    let studentId = decodedText;
    let studentName = null;
    let strand = null;

    // 1. Parse JSON payload safely
    try {
      const parsedData = JSON.parse(decodedText);
      studentId = parsedData.studentId || parsedData.student_id || decodedText;
      studentName = parsedData.name || parsedData.full_name || null;
      strand = parsedData.strand || parsedData.program || null;
    } catch (e) {
      // Scanned QR code is plain text (fallback)
      console.log('Scanned plain text QR:', decodedText);
    }

    const payload = {
      student_id: studentId,
      full_name: studentName,
      strand: strand,
      gate_location: gateLocation,
      officer_id: officerId,
      scanned_at: new Date().toISOString(),
    };

    if (navigator.onLine) {
      try {
        const response = await fetch('/api/v1/scan/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        setScanResult(data);
      } catch (err) {
        await saveScanOffline(payload);
        setScanResult({
          status: 'OFFLINE_RECORDED',
          student_id: studentId,
          student: { full_name: studentName, program: strand },
        });
      }
    } else {
      await saveScanOffline(payload);
      setScanResult({
        status: 'OFFLINE_RECORDED',
        student_id: studentId,
        student: { full_name: studentName, program: strand },
      });
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px', fontFamily: 'sans-serif' }}>
      <h2>AU JRC Security Gate Portal</h2>
      <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: isOnline ? '#e6fffa' : '#fff5f5' }}>
        <strong>Network Status:</strong> {isOnline ? '🟢 Online' : '🔴 Offline (Local Caching Active)'}
        {syncing && <span> — Syncing offline logs...</span>}
      </div>

      <div id="qr-reader" style={{ width: '100%' }}></div>

      {scanResult && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          borderRadius: '8px',
          color: '#fff',
          backgroundColor: scanResult.access === 'ALLOWED' ? '#2e7d32' : scanResult.status === 'OFFLINE_RECORDED' ? '#ed6c02' : '#c62828'
        }}>
          <h3>{scanResult.access === 'ALLOWED' ? '✅ ENTRY ALLOWED' : scanResult.status === 'OFFLINE_RECORDED' ? '⚠️ OFFLINE LOGGED' : '🚫 ACCESS DENIED'}</h3>
          <p><strong>Student ID:</strong> {scanResult.student?.student_id || scanResult.student_id}</p>
          
          {(scanResult.student?.full_name || scanResult.student?.name) && (
            <p><strong>Name:</strong> {scanResult.student.full_name || scanResult.student.name}</p>
          )}

          {(scanResult.student?.program || scanResult.student?.strand) && (
            <p><strong>Strand/Program:</strong> {scanResult.student.program || scanResult.student.strand}</p>
          )}
        </div>
      )}
    </div>
  );
};