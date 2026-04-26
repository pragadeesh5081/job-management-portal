import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import MyApplications from './pages/MyApplications';
import ManageApplications from './pages/ManageApplications';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/dashboard/job-seeker" element={<JobSeekerDashboard />} />
            <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/manage-applications" element={<ManageApplications />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
