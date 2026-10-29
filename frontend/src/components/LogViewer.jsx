import React from 'react';
import { useSystemLogs } from '../hooks/useSystemData'; // Import your custom hook

export const LogViewer = () => {
  // Call the custom hook instead of writing useQuery directly here
  const { data, isLoading, isError } = useSystemLogs();

  return (
    <div style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', border: '1px solid #1e293b', marginTop: '2rem' }}>
      <h3 style={{ color: '#38bdf8', marginBottom: '0.75rem', fontSize: '1rem' }}>🖥️ Live Backend Logs (Winston Stream)</h3>
      <div style={{ background: '#020617', padding: '1rem', borderRadius: '4px', height: '150px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.85rem', color: '#cbd5e1' }}>
        {isLoading ? (
          <div>Loading logs...</div>
        ) : isError ? (
          <div style={{ color: '#f87171' }}>Failed to load logs from server.</div>
        ) : data?.logs?.length ? (
          data.logs.map((line, index) => <div key={index}>{line}</div>)
        ) : (
          <div>Waiting for logs...</div>
        )}
      </div>
    </div>
  );
};