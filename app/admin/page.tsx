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

  // --- EXPORT FUNCTIONS ---
  
  const exportToExcel = () => {
    if (records.length === 0) return;
    
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Hospital', 'Specialty', 'Created At'];
    
    // Wrap values in quotes to handle commas within the data securely
    const rows = records.map(r => [
      `"${r.firstName}"`, 
      `"${r.lastName}"`, 
      `"${r.email}"`, 
      `"${r.phone}"`, 
      `"${r.hospital}"`, 
      `"${r.specialty || '-'}"`, 
      `"${new Date(r.createdAt).toLocaleString()}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "physician_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Relies on the @media print CSS below to format the page for PDF saving
    window.print();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
          
          :root {
            --ink: #161A1F;
            --ink-soft: #5B6472;
            --line: rgba(228, 232, 236, 0.6);
            --paper: #F6F8F9;
            --card: rgba(255, 255, 255, 0.75);
            --teal: #2FBF9F;
            --blue: #2E4FA3;
            --blue-light: #4FA9E8;
            --teal-tint: #EAF9F5;
            --blue-tint: #EEF1FA;
            --danger: #D8483C;
            --radius: 18px;
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
            max-width: 1024px; 
            transition: all 0.3s ease;
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
            border: 1px solid rgba(228, 232, 236, 0.8);
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            padding: 6px 12px;
            border-radius: 100px;
          }

          .card {
            background: var(--card);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.6);
            border-radius: var(--radius);
            box-shadow: 0 4px 6px -1px rgba(22,26,31,0.05), 0 24px 48px -12px rgba(22,26,31,0.12);
            overflow: hidden;
          }

          .card-top {
            height: 5px;
            background: linear-gradient(90deg, var(--blue) 0%, var(--blue-light) 45%, var(--teal) 100%);
          }

          .card-header {
            padding: 36px 40px 30px;
            background:
              radial-gradient(560px 220px at 100% 0%, rgba(47,191,159,0.12) 0%, rgba(47,191,159,0) 70%),
              linear-gradient(135deg, rgba(238,241,250,0.5) 0%, rgba(234,249,245,0.5) 100%);
            border-bottom: 1px solid var(--line);
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 20px;
          }

          .header-text { flex: 1; min-width: 280px; }

          @media (max-width: 520px) {
            .card-header { padding: 26px 22px 22px; flex-direction: column; align-items: flex-start; }
          }

          .card-body {
            padding: 36px 40px 36px;
          }
          
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
            font-weight: 600;
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

          /* Export Toolbar */
          .export-toolbar {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          
          .btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: inherit;
            font-size: 13.5px;
            font-weight: 600;
            color: var(--ink);
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid #D1D7DC;
            border-radius: 8px;
            padding: 8px 14px;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .btn-secondary:hover {
            background: #fff;
            border-color: #B0B8C1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.03);
            transform: translateY(-1px);
          }
          .btn-secondary svg { width: 16px; height: 16px; opacity: 0.7; }

          form { margin: 0; }

          .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            max-width: 600px;
          }
          @media (max-width: 560px) {
            .row { grid-template-columns: 1fr; gap: 0px; }
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
            background: rgba(255,255,255,0.5);
            border: 1.5px solid #D1D7DC;
            border-radius: 9px;
            padding: 12px 13px;
            outline: none;
            transition: all .15s ease;
            width: 100%;
          }
          input::placeholder { color: #A7AEB8; }
          input:hover { border-color: #A7AEB8; background: #fff; }
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
            background: #FDF4F3;
            padding: 10px 14px;
            border-radius: 8px;
            display: inline-block;
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
            transition: transform .15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow .15s ease, opacity .15s ease;
            box-shadow: 0 8px 20px -8px rgba(46,79,163,0.55);
          }
          button.submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px -10px rgba(46,79,163,0.6);
          }
          button.submit:active { transform: translateY(0); }
          button.submit:disabled { opacity: 0.7; cursor: default; transform: none; }

          .foot {
            text-align: center;
            margin-top: 22px;
            font-size: 12px;
            color: var(--ink-soft);
          }

          /* Premium Table Styles */
          .table-scroll {
            width: 100%;
            overflow-x: auto;
            -ms-overflow-style: none;  
            scrollbar-width: thin;
          }
          .table-scroll::-webkit-scrollbar { height: 6px; }
          .table-scroll::-webkit-scrollbar-track { background: transparent; }
          .table-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
          
          .admin-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            min-width: 800px;
          }
          .admin-table th {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: var(--ink-soft);
            padding: 18px 24px;
            border-bottom: 1px solid var(--line);
            background: rgba(246, 248, 249, 0.4);
            white-space: nowrap;
          }
          .admin-table td {
            font-size: 14px;
            color: var(--ink);
            padding: 16px 24px;
            border-bottom: 1px solid rgba(0,0,0,0.04);
            vertical-align: middle;
            white-space: nowrap;
            transition: background 0.15s ease;
          }
          .admin-table tbody tr { transition: background 0.15s ease; cursor: default; }
          .admin-table tbody tr:hover td { background: rgba(234, 249, 245, 0.4); }
          .admin-table tbody tr:last-child td { border-bottom: none; }

          /* 🖨️ Print Styles specifically for PDF generation */
          @media print {
            body { background: white !important; padding: 0 !important; }
            .brandbar, form, .export-toolbar, .card-top, .foot, .eyebrow, .lede { display: none !important; }
            .sheet { max-width: 100% !important; margin: 0 !important; }
            .card { box-shadow: none !important; border: none !important; border-radius: 0 !important; backdrop-filter: none !important;}
            .card-header { padding: 0 0 20px 0 !important; background: transparent !important; border-bottom: 2px solid #000 !important; }
            .card-body-table { border-top: none !important; }
            .admin-table th { color: #000 !important; border-bottom: 2px solid #000 !important; }
            .admin-table td { border-bottom: 1px solid #ccc !important; }
            /* Force background colors to print if needed */
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
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
            <div className="header-text">
              <p className="eyebrow">Database Access</p>
              <h1>Physician Records</h1>
              <p className="lede">Authenticate to view the latest physician registration data from MongoDB.</p>
            </div>
            
            {/* Export Toolbar only shows if there are records */}
            {records.length > 0 && (
              <div className="export-toolbar">
                <button onClick={exportToExcel} className="btn-secondary" title="Export to Excel (CSV)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="8" y1="13" x2="16" y2="13"></line>
                    <line x1="8" y1="17" x2="16" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Excel
                </button>
                <button onClick={exportToPDF} className="btn-secondary" title="Export to PDF">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  PDF
                </button>
              </div>
            )}
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