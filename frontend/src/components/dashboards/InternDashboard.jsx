import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

const InternDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, progressRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/progress')
        ]);
        setTasks(tasksRes.data);
        setSubmissions(progressRes.data);
      } catch (error) {
        console.error('Data sync failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalHours = submissions.reduce((acc, curr) => acc + curr.hours, 0);

  if (loading) return <div className="layout-container"><p>Syncing systems...</p></div>;

  return (
    <div className="layout-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Intern Workspace Control</h1>
        <div className="badge badge-green">Connected: Active Session</div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Assigned Project Tasks</div>
          <div className="stat-value">{tasks.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Productive Hours</div>
          <div className="stat-value">{totalHours} hrs</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Tasks Completed</div>
          <div className="stat-value">{submissions.filter(s => s.status === 'Completed').length}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2>Assigned Project Tasks</h2>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No current tasks assigned to this sector.</p>
            ) : (
              tasks.map((t) => (
                <div key={t._id} className="card" style={{ padding: '1rem', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600 }}>{t.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{t.description}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <span className="badge badge-blue">{t.status.toUpperCase()}</span>
                    <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>Submit Progress</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h2>Recent Activity Log</h2>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th>Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s._id}>
                    <td>{s.task?.title || 'System Task'}</td>
                    <td>{s.hours} hrs</td>
                    <td>
                      <span className={`badge ${s.status === 'Completed' ? 'badge-green' : 'badge-blue'}`}>
                        {s.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;
