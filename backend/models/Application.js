const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id'
    }
  },
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 500]
    }
  },
  status: {
    type: DataTypes.ENUM('Applied', 'Shortlisted', 'Rejected'),
    allowNull: false,
    defaultValue: 'Applied'
  },
  isArchivedByRecruiter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Application;
