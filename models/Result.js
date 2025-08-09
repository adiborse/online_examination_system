const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Result = sequelize.define('Result', {
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
    examId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'general-exam'
    },
    questions: {
        type: DataTypes.JSON,
        allowNull: false
    },
    totalQuestions: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    correctAnswers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
    },
    timeSpent: {
        type: DataTypes.INTEGER, // in seconds
        allowNull: false
    },
    examDuration: {
        type: DataTypes.INTEGER, // in minutes
        allowNull: false,
        defaultValue: 60
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    submissionType: {
        type: DataTypes.ENUM('manual', 'auto'),
        defaultValue: 'manual'
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'createdAt']
        },
        {
            fields: ['percentage']
        }
    ]
});

// Virtual field for grade calculation
Result.prototype.getGrade = function() {
    const percentage = parseFloat(this.percentage);
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
};

// Add grade to JSON output
Result.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    values.grade = this.getGrade();
    return values;
};

module.exports = Result;
