import { useContext } from 'react';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import RecruiterDashboard from '../components/dashboards/RecruiterDashboard';
import StudentDashboard from './Student/StudentDashboard';
import { AuthContext } from '../context/AuthContextValue';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'recruiter') return <RecruiterDashboard />;
  return <StudentDashboard />;
};

export default Dashboard;
