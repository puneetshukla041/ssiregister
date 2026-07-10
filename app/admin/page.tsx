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
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
          
          :root {
            --ink: #161A1F;
            --ink-soft: #5B6472;
            --line: #E4E8EC;
            --paper: #F6F8F9;
            --card: #FFFFFF;
            --teal: #2FBF9F;
            --blue: #2E4FA3;
            --blue-light: #4FA9E8;
            --teal-tint: #EAF9F5;
            --blue-tint: #EEF1FA;
            --danger: #D8483C;
            --radius: 14px;
          }
          * { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; }
          body {
            background:
              radial-gradient(1100px 500px at 90% -10%, var(--teal-tint) 0%, rgba(234,249,245,0) 60%),
              radial-gradient(900px 500px at -10% 10%, var(--blue-tint) 0%, rgba(238,241,250,0) 60%),
              var(--paper);
            font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: var(--ink);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px 20px;
          }

          .sheet {
            width: 100%;
            /* Wider max-width for the admin table */
            max-width: 1024px; 
          }

          .brandbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 28px;
          }
          .brandbar img {
            height: 50px;
            width: auto;
            display: block;
          }
          .brandbar .tag {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 11.5px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--ink-soft);
            border: 1px solid var(--line);
            background: var(--card);
            padding: 6px 12px;
            border-radius: 100px;
          }

          .card {
            background: var(--card);
            border: 1px solid var(--line);
            border-radius: var(--radius);
            box-shadow: 0 1px 2px rgba(22,26,31,0.04), 0 20px 40px -24px rgba(22,26,31,0.18);
            overflow: hidden;
          }

          .card-top {
            height: 5px;
            background: linear-gradient(90deg, var(--blue) 0%, var(--blue-light) 45%, var(--teal) 100%);
          }

          .card-header {
            padding: 36px 40px 30px;
            background:
              radial-gradient(560px 220px at 100% 0%, rgba(47,191,159,0.16) 0%, rgba(47,191,159,0) 70%),
              linear-gradient(135deg, var(--blue-tint) 0%, var(--teal-tint) 100%);
            border-bottom: 1px solid var(--line);
          }
          @media (max-width: 520px) {
            .card-header { padding: 26px 22px 22px; }
          }

          .card-body {
            padding: 36px 40px 36px;
          }
          
          /* Remove padding for the table section so it stretches edge-to-edge */
          .card-body-table {
            padding: 0;
            border-top: 1px solid var(--line);
          }

          @media (max-width: 520px) {
            .card-body { padding: 26px 22px 26px; }
          }

          .eyebrow {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--teal);
            font-weight: 500;
            margin: 0 0 10px;
          }

          h1 {
            font-size: 26px;
            line-height: 1.25;
            font-weight: 800;
            letter-spacing: -0.01em;
            margin: 0 0 10px;
            color: var(--ink);
          }

          p.lede {
            font-size: 14.5px;
            line-height: 1.6;
            color: var(--ink-soft);
            margin: 0;
            max-width: 56ch;
          }

          form { margin: 0; }

          .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            max-width: 600px;
          }
          @media (max-width: 480px) {
            .row { grid-template-columns: 1fr; }
          }

          .field {
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
          }

          label {
            font-size: 13px;
            font-weight: 600;
            color: var(--ink);
            margin-bottom: 7px;
          }

          input {
            font-family: inherit;
            font-size: 14.5px;
            color: var(--ink);
            background: var(--paper);
            border: 1.5px solid var(--line);
            border-radius: 9px;
            padding: 12px 13px;
            outline: none;
            transition: border-color .15s ease, background .15s ease, box-shadow .15s ease;
            width: 100%;
          }
          input::placeholder {
            color: #A7AEB8;
          }
          input:hover {
            border-color: #C7CFD6;
          }
          input:focus {
            background: #fff;
            border-color: var(--teal);
            box-shadow: 0 0 0 4px rgba(47,191,159,0.14);
          }

          .error-msg {
            font-size: 13.5px;
            color: var(--danger);
            margin-top: 16px;
            font-weight: 500;
          }

          .submit-row {
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 16px;
          }

          button.submit {
            font-family: inherit;
            font-size: 15px;
            font-weight: 700;
            color: #fff;
            background: linear-gradient(90deg, var(--blue) 0%, var(--teal) 100%);
            border: none;
            border-radius: 9px;
            padding: 13px 26px;
            cursor: pointer;
            transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
            box-shadow: 0 8px 20px -8px rgba(46,79,163,0.55);
          }
          button.submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 12px 24px -10px rgba(46,79,163,0.6);
          }
          button.submit:active {
            transform: translateY(0);
          }
          button.submit:disabled {
            opacity: 0.7;
            cursor: default;
            transform: none;
          }

          .foot {
            text-align: center;
            margin-top: 22px;
            font-size: 12px;
            color: var(--ink-soft);
          }

          /* Table Specific Styles */
          .table-scroll {
            width: 100%;
            overflow-x: auto;
            /* Hide scrollbar for cleaner look, but allow scrolling */
            -ms-overflow-style: none;  
            scrollbar-width: thin;
          }
          .admin-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            text-align: left;
            min-width: 800px;
          }
          .admin-table th {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: var(--ink-soft);
            padding: 16px 24px;
            border-bottom: 1px solid var(--line);
            background: rgba(246, 248, 249, 0.6);
            white-space: nowrap;
          }
          .admin-table td {
            font-size: 14.5px;
            color: var(--ink);
            padding: 16px 24px;
            border-bottom: 1px solid var(--line);
            vertical-align: middle;
            white-space: nowrap;
          }
          .admin-table tbody tr {
            transition: background 0.15s ease;
          }
          .admin-table tbody tr:hover {
            background: var(--teal-tint);
          }
          .admin-table tbody tr:last-child td {
            border-bottom: none;
          }
        `
      }} />

      <div className="sheet">
        <div className="brandbar">
          <img src="/logo.png" alt="SSInnovations" />
          <span className="tag">Admin View</span>
        </div>

        <div className="card">
          <div className="card-top"></div>
          
          <div className="card-header">
            <p className="eyebrow">Database Access</p>
            <h1>Physician Records</h1>
            <p className="lede">Authenticate to view the latest physician registration data from MongoDB.</p>
          </div>

          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="field">
                  <label htmlFor="username">Username</label>
                  <input 
                    id="username"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Enter admin username" 
                    required 
                  />
                </div>
                <div className="field">
                  <label htmlFor="password">Password</label>
                  <input 
                    id="password"
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter password" 
                    required 
                  />
                </div>
              </div>

              <div className="submit-row">
                <button type="submit" className="submit" disabled={loading}>
                  {loading ? 'Authenticating…' : 'Access Records'}
                </button>
              </div>
              
              {error && <div className="error-msg">{error}</div>}
            </form>
          </div>

          {/* Render table only if records exist */}
          {records.length > 0 && (
            <div className="card-body-table">
              <div className="table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Hospital</th>
                      <th>Specialty</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((item) => (
                      <tr key={String(item._id)}>
                        <td style={{ fontWeight: 600 }}>{item.firstName} {item.lastName}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.hospital}</td>
                        <td>{item.specialty || '-'}</td>
                        <td style={{ color: 'var(--ink-soft)' }}>
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        <p className="foot">© 2026 SSInnovations. All rights reserved.</p>
      </div>
    </>
  );
}