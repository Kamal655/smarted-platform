import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContextValue';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import StudentDashboard from './pages/Student/StudentDashboard';
import RecruiterDashboard from './pages/Recruiter/RecruiterDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import InternshipList from './pages/Internships/InternshipList';
import PostInternship from './pages/Recruiter/PostInternship';
import InternshipDetails from './pages/Internships/InternshipDetails';
import MyApplications from './pages/Student/MyApplications';
import MyPostings from './pages/Recruiter/MyPostings';
import UserManagement from './pages/Admin/UserManagement';
import TaskBoard from './pages/Tasks/TaskBoard';
import ResumeAnalyzer from './pages/Student/ResumeAnalyzer';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import StudentDirectory from './pages/Recruiter/StudentDirectory';
import MockInterviewTerminal from './pages/Internships/MockInterviewTerminal';
import NotFound from './pages/NotFound';

// Global Spinner Component (Professional Light Mode)
export const GlobalSpinner = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
    <div className="mt-8 flex flex-col items-center gap-2">
      <p className="text-slate-900 font-black uppercase tracking-[0.3em] text-[11px] animate-pulse">
        SmartED
      </p>
    </div>
  </div>
);

function App() {
  const { loading, user } = useContext(AuthContext);

  if (loading) {
    return <GlobalSpinner />;
  }

  // Dashboard Selector based on role
  const getDashboard = () => {
    switch (user?.role) {
      case 'admin': return <AdminDashboard />;
      case 'recruiter': return <RecruiterDashboard />;
      case 'student': return <StudentDashboard />;
      default: return <Navigate to="/login" />;
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light" 
        toastClassName="!rounded-2xl !bg-white !text-slate-900 !border !border-slate-100 !font-bold !shadow-xl"
      />
      <Routes>
        {/* Public Landing & Auth */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        
        {/* Publicly Accessible Information Routes */}
        <Route path="/internships" element={<Layout><InternshipList /></Layout>} />
        <Route path="/internships/:id" element={<Layout><InternshipDetails /></Layout>} />

        {/* Protected Application Routes */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={getDashboard()} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/tasks" element={<TaskBoard />} />

                  {/* Student Only Routes */}
                  <Route path="/applications" element={
                    <ProtectedRoute allowedRoles={['student']}><MyApplications /></ProtectedRoute>
                  } />
                  <Route path="/resume-analyzer" element={
                    <ProtectedRoute allowedRoles={['student']}><ResumeAnalyzer /></ProtectedRoute>
                  } />
                  <Route path="/internships/:id/interview" element={
                    <ProtectedRoute allowedRoles={['student']}><MockInterviewTerminal /></ProtectedRoute>
                  } />

                  {/* Recruiter Only Routes */}
                  <Route path="/my-postings" element={
                    <ProtectedRoute allowedRoles={['recruiter']}><MyPostings /></ProtectedRoute>
                  } />
                  <Route path="/post-internship" element={
                    <ProtectedRoute allowedRoles={['recruiter']}><PostInternship /></ProtectedRoute>
                  } />
                  <Route path="/talent" element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}><StudentDirectory /></ProtectedRoute>
                  } />
                  <Route path="/profile/:id" element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}><PublicProfile /></ProtectedRoute>
                  } />

                  {/* Admin Only Routes */}
                  <Route path="/users" element={
                    <ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
