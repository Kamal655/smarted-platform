import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

const MentorDashboard = () => {
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, tasksRes, progressRes] = await Promise.all([
          api.get('/users'),
          api.get('/tasks'),
          api.get('/progress')
        ]);
        setInterns(usersRes.data.filter(u => u.role === 'intern'));
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

  if (loading) return <div className="layout-container"><p>Syncing systems...</p></div>;

  return (
    <div className="layout-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Mentor Operations Control</h1>
        <div className="badge badge-blue">Mentor Status: Active</div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Assigned Interns</div>
          <div className="stat-value">{interns.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">System Tasks</div>
          <div className="stat-value">{tasks.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Submissions</div>
          <div className="stat-value">{submissions.length}</div>
        </div>
      </div>

      <div className="card mb-8">
        <h2>Assign Management Task</h2>
        <div className="form-group">
          <label>Project Task Description</label>
          <input type="text" placeholder="e.g., Code Review for Frontend API" />
        </div>
        <div className="form-group">
          <label>Reporting Deadline</label>
          <input type="date" />
        </div>
        <button className="btn btn-primary">Assign To Team</button>
      </div>

      <div className="card">
        <h2>Active Project Submissions</h2>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Intern Name</th>
                <th>Task ID</th>
                <th>Hours Logged</th>
                <th>Submission Status</th>
                <th>Date Logged</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 600 }}>{s.user?.name || 'Assigned Intern'}</td>
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
  );
};

export default MentorDashboard;
