const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Question text is required' },
            len: { args: [1, 500], msg: 'Question cannot be more than 500 characters' }
        }
    },
    options: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isValidOptions(value) {
                if (!Array.isArray(value) || value.length !== 4) {
                    throw new Error('Question must have exactly 4 options');
                }
            }
        }
    },
    correctAnswer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: { args: [0], msg: 'Correct answer index must be between 0 and 3' },
            max: { args: [3], msg: 'Correct answer index must be between 0 and 3' }
        }
    },
    difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        defaultValue: 'medium'
    },
    subject: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Subject is required' },
            len: { args: [1, 50], msg: 'Subject cannot be more than 50 characters' }
        }
    },
    category: {
        type: DataTypes.STRING(50),
        validate: {
            len: { args: [0, 50], msg: 'Category cannot be more than 50 characters' }
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['subject', 'difficulty', 'isActive']
        }
    ]
});

module.exports = Question;
