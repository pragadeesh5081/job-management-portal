# Job Management Portal v1.0.1

A full-stack web application that connects job seekers and recruiters. The system allows recruiters to post job openings and manage applicants, while job seekers can search and apply for jobs.

## Current Version: 1.0.1
- **Release Date**: April 18, 2026
- **Status**: Production Ready

## Features

### User Roles
- **Job Seeker**: Browse jobs, apply for positions, track application status
- **Recruiter**: Post jobs, manage applications, review candidates

### Authentication
- User registration and login (both roles)
- JWT-based authentication
- Protected routes and middleware

### Job Seeker Features
- Browse all available jobs
- Search and filter jobs (by title, location, company)
- Apply for jobs with resume upload
- Track application status
- View application history

### Recruiter Features
- Create, update, delete job postings
- View all posted jobs
- Review applications for each job
- Shortlist or reject candidates
- Dashboard with job statistics

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL/PostgreSQL** with Sequelize ORM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Frontend
- **React.js** with functional components and hooks
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MySQL or PostgreSQL database
- Git

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd job-management
```

### 2. Database Setup

The application supports both MySQL and PostgreSQL. Choose the one you prefer.

#### Option 1: MySQL Setup

1. **Install MySQL** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mysql-server
   
   # macOS
   brew install mysql
   
   # Windows: Download from https://dev.mysql.com/downloads/mysql/
   ```

2. **Start MySQL and create database**
   ```bash
   # Start MySQL service
   sudo systemctl start mysql  # Linux
   brew services start mysql  # macOS
   
   # Login to MySQL
   mysql -u root -p
   
   # Run the setup script
   source database/setup_mysql.sql;
   
   # (Optional) Add sample data
   source database/seed_data.sql;
   ```

#### Option 2: PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   
   # Windows: Download from https://www.postgresql.org/download/windows/
   ```

2. **Start PostgreSQL and create database**
   ```bash
   # Start PostgreSQL service
   sudo systemctl start postgresql  # Linux
   brew services start postgresql  # macOS
   
   # Login to PostgreSQL
   sudo -u postgres psql
   
   # Run the setup script
   \i database/setup_postgresql.sql
   
   # (Optional) Add sample data
   \i database/seed_data.sql
   ```

#### Database Files
- `database/setup_mysql.sql` - MySQL database creation script
- `database/setup_postgresql.sql` - PostgreSQL database creation script  
- `database/seed_data.sql` - Sample data for testing
- `database/README.md` - Detailed database setup guide

#### Sample Data
The seed script includes:
- 3 sample recruiters (john@techcorp.com, sarah@innovate.com, michael@startup.com)
- 5 sample job seekers (alice@email.com, bob@email.com, etc.)
- 8 sample job postings
- 15 sample applications
- Default password for all sample users: `password123`

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

#### Configure Environment Variables

Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root              # Your database username
DB_PASSWORD=              # Your database password
DB_NAME=job_management
DB_PORT=3306              # 5432 for PostgreSQL

# JWT Secret (generate a strong secret)
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# Server Configuration
PORT=5000

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

#### Start the Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
job-management/
|-- backend/
|   |-- config/
|   |   |-- database.js
|   |-- middleware/
|   |   |-- auth.js
|   |   |-- upload.js
|   |-- models/
|   |   |-- User.js
|   |   |-- Job.js
|   |   |-- Application.js
|   |   |-- index.js
|   |-- routes/
|   |   |-- auth.js
|   |   |-- jobs.js
|   |   |-- applications.js
|   |-- uploads/          # Resume files
|   |-- .env
|   |-- package.json
|   |-- server.js
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |   |-- AuthContext.js
|   |   |-- pages/
|   |   |   |-- Login.js
|   |   |   |-- Register.js
|   |   |   |-- JobList.js
|   |   |   |-- JobDetails.js
|   |   |   |-- JobSeekerDashboard.js
|   |   |   |-- RecruiterDashboard.js
|   |   |   |-- PostJob.js
|   |   |   |-- MyApplications.js
|   |   |   |-- ManageApplications.js
|   |   |-- services/
|   |   |   |-- api.js
|   |   |-- App.js
|   |   |-- index.css
|   |   |-- index.js
|   |-- package.json
|   |-- tailwind.config.js
|   |-- postcss.config.js
|-- README.md
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: 'job_seeker', 'recruiter')
- `createdAt` (DateTime)

### Jobs Table
- `id` (Primary Key)
- `title` (String)
- `company` (String)
- `location` (String)
- `salary` (String, Optional)
- `description` (Text)
- `skills` (Text)
- `recruiterId` (Foreign Key to Users.id)
- `createdAt` (DateTime)

### Applications Table
- `id` (Primary Key)
- `userId` (Foreign Key to Users.id)
- `jobId` (Foreign Key to Jobs.id)
- `resumeUrl` (String)
- `status` (Enum: 'Applied', 'Shortlisted', 'Rejected')
- `createdAt` (DateTime)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs (with search/filter)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (Recruiter only)
- `PUT /api/jobs/:id` - Update job (Recruiter only)
- `DELETE /api/jobs/:id` - Delete job (Recruiter only)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications` - Apply for job (Job Seeker only)
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/:jobId` - Get applications for a job
- `PUT /api/applications/:id/status` - Update application status
- `GET /api/applications/recruiter/all` - Get all recruiter applications
- `DELETE /api/applications/:id` - Withdraw application

## Usage

### For Job Seekers

1. **Register**: Create an account with role "job_seeker"
2. **Login**: Access your dashboard
3. **Browse Jobs**: View all available jobs with search and filters
4. **Apply**: Click on a job to view details and apply with resume
5. **Track Applications**: Monitor application status in your dashboard

### For Recruiters

1. **Register**: Create an account with role "recruiter"
2. **Login**: Access your recruiter dashboard
3. **Post Jobs**: Create new job listings
4. **Manage Applications**: Review and update application statuses
5. **View Statistics**: Track job performance metrics

## File Upload

- Resume files are stored in `backend/uploads/` directory
- Supported formats: PDF, DOC, DOCX
- Maximum file size: 5MB
- Files are accessible via `/uploads/filename` endpoint

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- File upload restrictions

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Frontend build
cd frontend
npm run build

# Backend production setup
cd backend
npm start
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify database credentials in `.env`
   - Ensure database server is running
   - Check if database exists

2. **JWT Token Issues**
   - Verify JWT_SECRET is set in `.env`
   - Check token expiration

3. **File Upload Issues**
   - Ensure `uploads` directory exists
   - Check file permissions
   - Verify file size limits

4. **CORS Issues**
   - Backend CORS is configured for localhost:3000
   - Adjust if using different ports

### Environment Variables

Make sure all required environment variables are set:

```bash
# Database
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=job_management
DB_PORT=3306

# JWT
JWT_SECRET=your_strong_secret_key

# Server
PORT=5000
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues
3. Create a new issue with detailed information

## Future Enhancements

- Email notifications for application updates
- Advanced search and filtering
- Company profiles
- Candidate messaging system
- Interview scheduling
- Analytics dashboard
- Mobile app version
