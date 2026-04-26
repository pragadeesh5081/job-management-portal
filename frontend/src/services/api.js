import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Job API calls
export const jobAPI = {
  getAllJobs: (params = {}) => api.get('/api/jobs', { params }),
  getJobById: (id) => api.get(`/api/jobs/${id}`),
  createJob: (jobData) => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    return api.post('/api/jobs', jobData, config);
  },
  updateJob: (id, jobData) => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    return api.put(`/api/jobs/${id}`, jobData, config);
  },
  deleteJob: (id) => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    return api.delete(`/api/jobs/${id}`, config);
  },
  getMyJobs: () => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    return api.get('/api/jobs/recruiter/my-jobs', config);
  },
};

// Application API calls
export const applicationAPI = {
  applyForJob: (jobId, formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return api.post('/api/applications', formData, config);
  },
  getMyApplications: () => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    return api.get('/api/applications/my-applications', config);
  },
  getApplicationsByJob: (jobId) => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    return api.get(`/api/applications/job/${jobId}`, config);
  },
  updateApplicationStatus: (id, status) => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    return api.put(`/api/applications/${id}/status`, { status }, config);
  },
  getAllRecruiterApplications: () => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    return api.get('/api/applications/recruiter/all', config);
  },
  withdrawApplication: (id) => {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
    return api.delete(`/api/applications/${id}`, config);
  },
};

export default api;
