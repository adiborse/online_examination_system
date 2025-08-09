const User = require('./User');
const Question = require('./Question');
const Result = require('./Result');

// Define associations
User.hasMany(Question, { foreignKey: 'createdBy', as: 'questions' });
Question.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Result, { foreignKey: 'userId', as: 'results' });
Result.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    User,
    Question,
    Result
};
