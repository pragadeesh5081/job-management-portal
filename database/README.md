# Database Setup Guide

This directory contains all the necessary scripts and documentation for setting up the database for the Job Management Portal.

## Database Options

The application supports both **MySQL** and **PostgreSQL**. Choose the one you're most comfortable with.

## Quick Setup Instructions

### Option 1: MySQL Setup

1. **Install MySQL** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mysql-server
   
   # macOS (using Homebrew)
   brew install mysql
   
   # Windows
   # Download from https://dev.mysql.com/downloads/mysql/
   ```

2. **Start MySQL Service**
   ```bash
   # Linux
   sudo systemctl start mysql
   
   # macOS
   brew services start mysql
   
   # Windows
   # Start from Services or run `net start mysql`
   ```

3. **Login to MySQL**
   ```bash
   mysql -u root -p
   ```

4. **Run the Setup Script**
   ```sql
   source /path/to/database/setup_mysql.sql;
   ```

5. **(Optional) Add Sample Data**
   ```sql
   source /path/to/database/seed_data.sql;
   ```

### Option 2: PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS (using Homebrew)
   brew install postgresql
   
   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Start PostgreSQL Service**
   ```bash
   # Linux
   sudo systemctl start postgresql
   
   # macOS
   brew services start postgresql
   
   # Windows
   # Start from Services
   ```

3. **Login to PostgreSQL**
   ```bash
   sudo -u postgres psql
   ```

4. **Run the Setup Script**
   ```sql
   \i /path/to/database/setup_postgresql.sql
   ```

5. **(Optional) Add Sample Data**
   ```sql
   \i /path/to/database/seed_data.sql
   ```

## Environment Configuration

After setting up the database, update your backend `.env` file:

### For MySQL:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=job_management
DB_PORT=3306
```

### For PostgreSQL:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_postgresql_password
DB_NAME=job_management
DB_PORT=5432
```

## Database Schema

### Users Table
- **Purpose**: Stores user authentication and role information
- **Columns**: id, name, email, password (hashed), role, timestamps
- **Roles**: 'job_seeker' or 'recruiter'

### Jobs Table
- **Purpose**: Stores job postings created by recruiters
- **Columns**: id, title, company, location, salary, description, skills, recruiterId, timestamps
- **Relationship**: Many jobs belong to one recruiter (Users table)

### Applications Table
- **Purpose**: Tracks job applications submitted by job seekers
- **Columns**: id, userId, jobId, resumeUrl, status, timestamps
- **Status**: 'Applied', 'Shortlisted', or 'Rejected'
- **Relationship**: Links users to jobs with application status

## Sample Data

The `seed_data.sql` script includes:

- **3 Sample Recruiters** from different companies
- **5 Sample Job Seekers** ready to apply
- **8 Sample Job Postings** across different roles and locations
- **15 Sample Applications** showing different statuses

**Default Passwords**: All sample users use the hashed password for "password123"

## Database Management

### Common MySQL Commands
```sql
-- View all databases
SHOW DATABASES;

-- Use the job management database
USE job_management;

-- View all tables
SHOW TABLES;

-- View table structure
DESCRIBE Users;

-- Reset database (drop and recreate)
DROP DATABASE job_management;
SOURCE setup_mysql.sql;
```

### Common PostgreSQL Commands
```sql
-- View all databases
\l

-- Connect to job management database
\c job_management

-- View all tables
\dt

-- View table structure
\d Users

-- Reset database
DROP DATABASE job_management;
\i setup_postgresql.sql
```

## Troubleshooting

### Connection Issues
1. **Check if database server is running**
   - MySQL: `sudo systemctl status mysql`
   - PostgreSQL: `sudo systemctl status postgresql`

2. **Verify credentials in .env file**
   - Ensure username and password are correct
   - Check that database name matches

3. **Port conflicts**
   - MySQL default: 3306
   - PostgreSQL default: 5432
   - Make sure ports are not blocked by firewall

### Permission Issues
1. **MySQL**: Ensure the user has privileges on the database
   ```sql
   GRANT ALL PRIVILEGES ON job_management.* TO 'username'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **PostgreSQL**: Ensure the user has database ownership
   ```sql
   ALTER DATABASE job_management OWNER TO username;
   ```

### Sequelize Sync Issues
If you encounter issues with Sequelize auto-syncing:
1. Check database connection in `backend/config/database.js`
2. Verify table names match (Sequelize uses pluralized names)
3. Ensure foreign key relationships are properly defined

## Backup and Restore

### MySQL Backup
```bash
# Backup
mysqldump -u username -p job_management > backup.sql

# Restore
mysql -u username -p job_management < backup.sql
```

### PostgreSQL Backup
```bash
# Backup
pg_dump -U username job_management > backup.sql

# Restore
psql -U username job_management < backup.sql
```

## Performance Optimization

### Recommended Indexes
The setup scripts already include essential indexes for:
- User email lookups
- Job searches (title, company, location)
- Application queries
- Foreign key relationships

### Full-Text Search
- MySQL: Uses `FULLTEXT` index on job title, description, and skills
- PostgreSQL: Uses `pg_trgm` extension with GIN indexes

## Security Considerations

1. **Use strong passwords** for database users
2. **Limit database user permissions** - don't use root in production
3. **Enable SSL** for database connections in production
4. **Regular backups** and test restore procedures
5. **Monitor database logs** for suspicious activity

## Next Steps

After setting up the database:

1. Install backend dependencies: `cd backend && npm install`
2. Configure environment variables
3. Start backend server: `npm run dev`
4. Install frontend dependencies: `cd frontend && npm install`
5. Start frontend: `npm start`
6. Register users and test the application!
