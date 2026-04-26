-- MySQL Database Setup Script for Job Management Portal

-- Create database
CREATE DATABASE IF NOT EXISTS job_management;

-- Use the database
USE job_management;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('job_seeker', 'recruiter') NOT NULL DEFAULT 'job_seeker',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Create Jobs table
CREATE TABLE IF NOT EXISTS Jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary VARCHAR(50),
    description TEXT NOT NULL,
    skills TEXT NOT NULL,
    recruiterId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiterId) REFERENCES Users(id) ON DELETE CASCADE,
    INDEX idx_recruiter (recruiterId),
    INDEX idx_title (title),
    INDEX idx_company (company),
    INDEX idx_location (location),
    FULLTEXT idx_search (title, description, skills)
);

-- Create Applications table
CREATE TABLE IF NOT EXISTS Applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    jobId INT NOT NULL,
    resumeUrl VARCHAR(500) NOT NULL,
    status ENUM('Applied', 'Shortlisted', 'Rejected') NOT NULL DEFAULT 'Applied',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (jobId) REFERENCES Jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (userId, jobId),
    INDEX idx_user (userId),
    INDEX idx_job (jobId),
    INDEX idx_status (status)
);

-- Create a database user (optional - for better security)
-- CREATE USER IF NOT EXISTS 'jobuser'@'localhost' IDENTIFIED BY 'jobpassword';
-- GRANT ALL PRIVILEGES ON job_management.* TO 'jobuser'@'localhost';
-- FLUSH PRIVILEGES;

-- Show the created tables
SHOW TABLES;

-- Display table structures
DESCRIBE Users;
DESCRIBE Jobs;
DESCRIBE Applications;
