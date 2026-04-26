-- PostgreSQL Database Setup Script for Job Management Portal

-- Create database
CREATE DATABASE job_management;

-- Connect to the database
\c job_management;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'job_seeker' CHECK (role IN ('job_seeker', 'recruiter')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for Users table
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON Users(role);

-- Create Jobs table
CREATE TABLE IF NOT EXISTS Jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary VARCHAR(50),
    description TEXT NOT NULL,
    skills TEXT NOT NULL,
    recruiterId INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiterId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create indexes for Jobs table
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON Jobs(recruiterId);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON Jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON Jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON Jobs(location);

-- Create full-text search index for PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_jobs_search ON Jobs USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_description ON Jobs USING gin(description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON Jobs USING gin(skills gin_trgm_ops);

-- Create Applications table
CREATE TABLE IF NOT EXISTS Applications (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    jobId INTEGER NOT NULL,
    resumeUrl VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Shortlisted', 'Rejected')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (jobId) REFERENCES Jobs(id) ON DELETE CASCADE,
    UNIQUE(userId, jobId)
);

-- Create indexes for Applications table
CREATE INDEX IF NOT EXISTS idx_applications_user ON Applications(userId);
CREATE INDEX IF NOT EXISTS idx_applications_job ON Applications(jobId);
CREATE INDEX IF NOT EXISTS idx_applications_status ON Applications(status);

-- Create a database user (optional - for better security)
-- CREATE USER jobuser WITH PASSWORD 'jobpassword';
-- GRANT ALL PRIVILEGES ON DATABASE job_management TO jobuser;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO jobuser;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO jobuser;

-- Show the created tables
\dt

-- Display table structures
\d Users
\d Jobs
\d Applications
