const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Job, User, Application } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs with optional search and filters
// @access  Public
router.get('/', [
  query('search').optional().isString(),
  query('location').optional().isString(),
  query('company').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, location, company, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { skills: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by location
    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    // Filter by company
    if (company) {
      whereClause.company = { [Op.like]: `%${company}%` };
    }

    const jobs = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      jobs: jobs.rows,
      total: jobs.count,
      page: parseInt(page),
      totalPages: Math.ceil(jobs.count / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Application,
          as: 'applications',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Recruiter only)
router.post('/', [
  auth,
  authorize('recruiter'),
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('company').trim().isLength({ min: 2 }).withMessage('Company must be at least 2 characters'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('skills').trim().isLength({ min: 5 }).withMessage('Skills must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, salary, description, skills } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      salary,
      description,
      skills,
      recruiterId: req.user.id
    });

    const createdJob = await Job.findByPk(job.id, {
      include: [
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Job created successfully',
      job: createdJob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Recruiter only - job owner)
router.put('/:id', [
  auth,
  authorize('recruiter'),
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('company').optional().trim().isLength({ min: 2 }).withMessage('Company must be at least 2 characters'),
  body('location').optional().trim().isLength({ min: 2 }).withMessage('Location must be at least 2 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('skills').optional().trim().isLength({ min: 5 }).withMessage('Skills must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the job belongs to the current recruiter
    if (job.recruiterId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const { title, company, location, salary, description, skills } = req.body;

    await job.update({
      title: title || job.title,
      company: company || job.company,
      location: location || job.location,
      salary: salary || job.salary,
      description: description || job.description,
      skills: skills || job.skills
    });

    const updatedJob = await Job.findByPk(job.id, {
      include: [
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Recruiter only - job owner)
router.delete('/:id', [auth, authorize('recruiter')], async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the job belongs to the current recruiter
    if (job.recruiterId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.destroy();

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/recruiter/my-jobs
// @desc    Get all jobs posted by current recruiter
// @access  Private (Recruiter only)
router.get('/recruiter/my-jobs', [auth, authorize('recruiter')], async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { recruiterId: req.user.id },
      include: [
        {
          model: Application,
          as: 'applications',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
