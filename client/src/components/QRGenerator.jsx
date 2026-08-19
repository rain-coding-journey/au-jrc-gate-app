import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function QRGenerator() {
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [strandSection, setStrandSection] = useState('11 ICT 1A');
  const [generatedPayload, setGeneratedPayload] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!studentId || !fullName) return;

    // Standardized payload format for scanner
    const payload = JSON.stringify({
      studentId: studentId.trim(),
      name: fullName.trim(),
      strand: strandSection
    });

    setGeneratedPayload(payload);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <h3 style={{ margin: 0, color: 'var(--primary)' }}>Issue Student QR Pass</h3>

      {/* Input Form */}
      <form onSubmit={handleGenerate} style={{ display: 'grid', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Student ID</label>
          <input
            type="text"
            placeholder="e.g., 2024-00129"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', marginTop: '4px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Full Name</label>
          <input
            type="text"
            placeholder="e.g., Juan Dela Cruz"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', marginTop: '4px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Section / Strand</label>
          <input
            type="text"
            value={strandSection}
            onChange={(e) => setStrandSection(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', marginTop: '4px' }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: 'var(--primary)', color: '#fff', padding: '10px',
            borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '8px'
          }}
        >
          Generate Pass
        </button>
      </form>

      {/* Printable Generated Card Preview */}
      {generatedPayload && (
        <div style={{
          marginTop: '16px',
          padding: '20px',
          border: '2px dashed var(--primary)',
          borderRadius: '12px',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem', textAlign: 'center' }}>
            ARELLANO UNIVERSITY — JOSE RIZAL CAMPUS
          </div>

          <QRCodeSVG value={generatedPayload} size={180} level="H" includeMargin={true} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{fullName}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ID: {studentId}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{strandSection}</div>
          </div>

          <button
            onClick={handlePrint}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Print Gate Pass Card
          </button>
        </div>
      )}
    </div>
  );
}