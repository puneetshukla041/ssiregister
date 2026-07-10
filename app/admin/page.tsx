"use client";

import { useState } from 'react';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/physicians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unauthorized');
      setRecords(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 980, margin: '40px auto', padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Admin View</h1>
      <p style={{ color: '#666', marginTop: 0 }}>View physician registrations from MongoDB.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360, marginBottom: 24 }}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" disabled={loading} style={{ padding: '10px 14px', cursor: 'pointer' }}>
          {loading ? 'Loading…' : 'Access'}
        </button>
      </form>

      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}

      {records.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Phone</th>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Hospital</th>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Specialty</th>
                <th style={{ padding: 8, borderBottom: '1px solid #ddd' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr key={String(item._id)}>
                  <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.firstName} {item.lastName}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.email}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.phone}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.hospital}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{item.specialty || '-'}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  );
}
