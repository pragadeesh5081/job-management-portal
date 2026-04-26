const express = require('express');
const { body, validationResult } = require('express-validator');
const { Application, Job, User } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { Op } = require('sequelize');

const router = express.Router();

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Job Seeker only)
router.post('/', [
  auth,
  authorize('job_seeker'),
  upload.single('resume'),
  body('jobId').isInt().withMessage('Job ID must be an integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    const { jobId } = req.body;
    const userId = req.user.id;
    const resumeUrl = `/uploads/${req.file.filename}`;

    // Check if job exists
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      where: { userId, jobId }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = await Application.create({
      userId,
      jobId,
      resumeUrl,
      status: 'Applied'
    });

    // Get the complete application with related data
    const createdApplication = await Application.findByPk(application.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'recruiter',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application: createdApplication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get all applications of current user (job seeker)
// @access  Private (Job Seeker only)
router.get('/my-applications', [auth, authorize('job_seeker')], async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'recruiter',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a specific job
// @access  Private (Recruiter only - job owner)
router.get('/job/:jobId', [auth, authorize('recruiter')], async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists and belongs to the recruiter
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiterId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.findAll({
      where: { jobId, isArchivedByRecruiter: false },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company', 'location']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (Shortlist/Reject)
// @access  Private (Recruiter only - job owner)
router.put('/:id/status', [
  auth,
  authorize('recruiter'),
  body('status').isIn(['Shortlisted', 'Rejected']).withMessage('Status must be Shortlisted or Rejected')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job'
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the job belongs to the current recruiter
    if (application.job.recruiterId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    await application.update({ status });

    const updatedApplication = await Application.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'company', 'location']
        }
      ]
    });

    res.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/recruiter/all
// @desc    Get all applications for jobs posted by current recruiter
// @access  Private (Recruiter only)
router.get('/recruiter/all', [auth, authorize('recruiter')], async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [
        {
          model: Job,
          as: 'job',
          where: { recruiterId: req.user.id },
          attributes: ['id', 'title', 'company', 'location']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete an application (withdraw application or recruiter delete)
// @access  Private (Job Seeker or Recruiter)
router.delete('/:id', [auth], async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: 'job' }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the user is authorized to delete this application
    if (req.user.role === 'job_seeker' && application.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    } else if (req.user.role === 'recruiter' && application.job.recruiterId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    } else if (req.user.role !== 'job_seeker' && req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    if (req.user.role === 'recruiter') {
      // Soft delete: hide from recruiter's dashboard
      await application.update({ isArchivedByRecruiter: true });
      return res.json({ message: 'Application removed from your view' });
    } else {
      // Hard delete: withdrawn by job seeker
      await application.destroy();
      return res.json({ message: 'Application deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
