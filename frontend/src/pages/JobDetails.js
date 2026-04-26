import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobAPI, applicationAPI } from '../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchJobDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, navigate]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobById(id);
      setJob(response.data);
    } catch (error) {
      setError('Failed to load job details. Please try again.');
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!resume) {
      setApplyError('Please upload your resume');
      return;
    }

    setApplying(true);
    setApplyError('');

    try {
      const formData = new FormData();
      formData.append('jobId', job.id);
      formData.append('resume', resume);

      const response = await applicationAPI.applyForJob(job.id, formData);
      
      if (response.data) {
        setApplySuccess(true);
        setShowApplyForm(false);
        setResume(null);
      }
    } catch (error) {
      setApplyError(error.response?.data?.message || 'Failed to apply for job');
      console.error('Error applying for job:', error);
    } finally {
      setApplying(false);
    }
  };

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
    setApplyError('');
  };

  const handleDeleteJob = async () => {
    if (!window.confirm('Are you sure you want to delete this job? This cannot be undone.')) return;
    try {
      await jobAPI.deleteJob(id);
      navigate('/dashboard/recruiter');
    } catch (error) {
      setDeleteError(error.response?.data?.message || 'Failed to delete job. Please try again.');
      console.error('Error deleting job:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error || 'Job not found'}
        </div>
        <Link to="/jobs" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
          &larr; Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {applySuccess && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6">
          Application submitted successfully!
        </div>
      )}

      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {deleteError}
        </div>
      )}

      {/* Job Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {job.company}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
              {job.salary && (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.salary}
                </span>
              )}
            </div>
          </div>
          {isAuthenticated && user.role === 'job_seeker' && (
            <button
              onClick={() => setShowApplyForm(!showApplyForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply Now
            </button>
          )}
          {isAuthenticated && user.role === 'recruiter' && job.recruiterId === user.id && (
            <div className="flex space-x-2">
              <Link
                to={`/edit-job/${job.id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              >
                Edit
              </Link>
              <button
                onClick={handleDeleteJob}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              >
                Delete Job
              </button>
            </div>
          )}
        </div>

        {/* Posted by */}
        <div className="text-sm text-gray-600 mb-4">
          Posted by {job.recruiter.name} ({job.recruiter.email}) on {new Date(job.createdAt).toLocaleDateString()}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.split(',').map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Job Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>
      </div>

      {/* Application Form */}
      {showApplyForm && isAuthenticated && user.role === 'job_seeker' ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Apply for this Position</h3>
          
          {applyError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {applyError}
            </div>
          )}

          <form onSubmit={handleApply}>
            <div className="mb-4">
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                Resume (PDF, DOC, or DOCX)
              </label>
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum file size: 5MB
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={applying}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Login/Register Prompt */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded">
          <p className="mb-2">You need to be logged in as a job seeker to apply for this position.</p>
          <div className="flex space-x-4">
            <Link to="/login" className="text-blue-600 hover:text-blue-500 underline">
              Login
            </Link>
            <Link to="/register" className="text-blue-600 hover:text-blue-500 underline">
              Register as Job Seeker
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6">
        <Link to="/jobs" className="text-blue-600 hover:text-blue-500">
          &larr; Back to Jobs
        </Link>
      </div>
    </div>
  );
};

export default JobDetails;
