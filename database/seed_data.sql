-- Sample Data for Job Management Portal
-- Run this after setting up the database to populate with sample data

USE job_management;

-- Insert sample recruiters
INSERT INTO Users (name, email, password, role) VALUES
('John Smith', 'john@techcorp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'recruiter'),
('Sarah Johnson', 'sarah@innovate.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'recruiter'),
('Michael Davis', 'michael@startup.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'recruiter');

-- Insert sample job seekers
INSERT INTO Users (name, email, password, role) VALUES
('Alice Wilson', 'alice@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'job_seeker'),
('Bob Brown', 'bob@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'job_seeker'),
('Carol White', 'carol@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'job_seeker'),
('David Lee', 'david@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'job_seeker'),
('Emma Martinez', 'emma@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'job_seeker');

-- Insert sample jobs
INSERT INTO Jobs (title, company, location, salary, description, skills, recruiterId) VALUES
('Senior Frontend Developer', 'TechCorp', 'San Francisco, CA', '$120,000 - $150,000', 
'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building responsive web applications using modern JavaScript frameworks.', 
'React, JavaScript, TypeScript, HTML5, CSS3, Redux, Node.js', 1),

('Full Stack Engineer', 'Innovate Solutions', 'New York, NY', '$100,000 - $130,000',
'Join our dynamic team as a Full Stack Engineer. You will work on both frontend and backend components of our web applications, collaborating with cross-functional teams.',
'React, Node.js, MongoDB, Express, JavaScript, AWS, Docker', 2),

('Backend Developer', 'StartupHub', 'Austin, TX', '$90,000 - $120,000',
'We are seeking a talented Backend Developer to design and implement server-side logic, APIs, and database architecture. Experience with cloud platforms is a plus.',
'Node.js, Python, PostgreSQL, MongoDB, REST APIs, GraphQL, AWS', 3),

('UI/UX Designer', 'TechCorp', 'Remote', '$80,000 - $100,000',
'Looking for a creative UI/UX Designer to create amazing user experiences. You will work closely with product managers and developers to design intuitive interfaces.',
'Figma, Adobe XD, Sketch, HTML, CSS, JavaScript, Prototyping', 1),

('DevOps Engineer', 'Innovate Solutions', 'Seattle, WA', '$110,000 - $140,000',
'We need a DevOps Engineer to automate our deployment processes and manage our cloud infrastructure. Experience with CI/CD pipelines is essential.',
'Docker, Kubernetes, AWS, Jenkins, Terraform, Linux, Python', 2),

('Mobile App Developer', 'StartupHub', 'Los Angeles, CA', '$95,000 - $125,000',
'Join our mobile team to develop native and cross-platform mobile applications. Experience with both iOS and Android development is preferred.',
'React Native, Swift, Kotlin, JavaScript, Mobile Development, APIs', 3),

('Data Scientist', 'TechCorp', 'Boston, MA', '$130,000 - $160,000',
'We are looking for a Data Scientist to analyze complex datasets and build machine learning models. Strong background in statistics and programming is required.',
'Python, R, Machine Learning, TensorFlow, SQL, Data Analysis, Statistics', 1),

('Product Manager', 'Innovate Solutions', 'Chicago, IL', '$100,000 - $130,000',
'Seeking an experienced Product Manager to lead product development initiatives. You will work with engineering, design, and marketing teams.',
'Product Management, Agile, Scrum, Analytics, User Research, Strategy', 2);

-- Insert sample applications
INSERT INTO Applications (userId, jobId, resumeUrl, status) VALUES
(4, 1, '/uploads/resume-alice-frontend.pdf', 'Applied'),
(5, 1, '/uploads/resume-bob-frontend.docx', 'Shortlisted'),
(6, 2, '/uploads/resume-carol-fullstack.pdf', 'Applied'),
(7, 2, '/uploads/resume-david-fullstack.pdf', 'Shortlisted'),
(8, 3, '/uploads/resume-emma-backend.pdf', 'Applied'),
(4, 4, '/uploads/resume-alice-design.pdf', 'Applied'),
(5, 5, '/uploads/resume-bob-devops.pdf', 'Applied'),
(6, 6, '/uploads/resume-carol-mobile.pdf', 'Shortlisted'),
(7, 7, '/uploads/resume-david-datascience.pdf', 'Applied'),
(8, 8, '/uploads/resume-emma-product.pdf', 'Rejected'),
(4, 2, '/uploads/resume-alice-fullstack.pdf', 'Applied'),
(5, 3, '/uploads/resume-bob-backend.pdf', 'Applied'),
(6, 4, '/uploads/resume-carol-design.pdf', 'Shortlisted'),
(7, 5, '/uploads/resume-david-devops.pdf', 'Applied'),
(8, 6, '/uploads/resume-emma-mobile.pdf', 'Applied');

-- Display the inserted data
SELECT 'Users:' as table_name;
SELECT id, name, email, role FROM Users;

SELECT 'Jobs:' as table_name;
SELECT id, title, company, location, salary FROM Jobs;

SELECT 'Applications:' as table_name;
SELECT a.id, u.name as applicant, j.title as job_title, a.status, a.createdAt 
FROM Applications a 
JOIN Users u ON a.userId = u.id 
JOIN Jobs j ON a.jobId = j.id;
