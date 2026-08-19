import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function StudentQRPass({ studentId, name, strand }) {
  // Combine data into a JSON string payload for the gate scanner
  const qrData = JSON.stringify({ studentId, name, strand });

  return (
    <div style={{ textAlign: 'center', padding: '16px', background: '#fff', borderRadius: '8px' }}>
      <h3>{name}</h3>
      <p>{studentId} — {strand}</p>
      
      <QRCodeSVG 
        value={qrData} 
        size={200} 
        level="H" 
        includeMargin={true} 
      />
    </div>
  );
}