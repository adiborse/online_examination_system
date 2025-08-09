const { Question, Result, User } = require('../models');

// Render admin dashboard
const renderDashboard = async (req, res) => {
    try {
        const totalQuestions = await Question.count({ where: { isActive: true } });
        const totalStudents = await User.count({ where: { role: 'student', isActive: true } });
        const totalExams = await Result.count();
        const recentResults = await Result.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email']
            }],
            order: [['createdAt', 'DESC']],
            limit: 5
        });
        
        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            user: req.user,
            stats: {
                totalQuestions,
                totalStudents,
                totalExams
            },
            recentResults
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('error', {
            title: 'Error',
            user: req.user,
            message: 'Failed to load dashboard',
            error: error
        });
    }
};

// Render questions page
const renderQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        
        const questions = await Question.findAll({ 
            where: { isActive: true },
            include: [{
                model: User,
                as: 'creator',
                attributes: ['name']
            }],
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: limit
        });
        
        const totalQuestions = await Question.count({ where: { isActive: true } });
        const totalPages = Math.ceil(totalQuestions / limit);
        
        res.render('admin/questions', {
            title: 'Manage Questions',
            user: req.user,
            questions,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
        });
    } catch (error) {
        console.error('Questions page error:', error);
        res.render('error', {
            title: 'Error',
            user: req.user,
            message: 'Failed to load questions'
        });
    }
};

// Add new question
const addQuestion = async (req, res) => {
    try {
        const { question, option1, option2, option3, option4, correctAnswer, difficulty, subject, category } = req.body;
        
        // Validation
        if (!question || !option1 || !option2 || !option3 || !option4 || correctAnswer === undefined || !subject) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        const correctAnswerIndex = parseInt(correctAnswer);
        if (correctAnswerIndex < 0 || correctAnswerIndex > 3) {
            return res.status(400).json({
                success: false,
                message: 'Correct answer must be between 0 and 3'
            });
        }
        
        const newQuestion = await Question.create({
            question: question.trim(),
            options: [
                option1.trim(),
                option2.trim(),
                option3.trim(),
                option4.trim()
            ],
            correctAnswer: correctAnswerIndex,
            difficulty: difficulty || 'medium',
            subject: subject.trim(),
            category: category?.trim() || '',
            createdBy: req.user.id
        });
        
        res.json({
            success: true,
            message: 'Question added successfully',
            question: newQuestion
        });
        
    } catch (error) {
        console.error('Add question error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add question'
        });
    }
};

// Update question
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, option1, option2, option3, option4, correctAnswer, difficulty, subject, category } = req.body;
        
        const existingQuestion = await Question.findByPk(id);
        if (!existingQuestion) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        
        // Validation
        if (!question || !option1 || !option2 || !option3 || !option4 || correctAnswer === undefined || !subject) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        const correctAnswerIndex = parseInt(correctAnswer);
        if (correctAnswerIndex < 0 || correctAnswerIndex > 3) {
            return res.status(400).json({
                success: false,
                message: 'Correct answer must be between 0 and 3'
            });
        }
        
        // Update question
        await existingQuestion.update({
            question: question.trim(),
            options: [
                option1.trim(),
                option2.trim(),
                option3.trim(),
                option4.trim()
            ],
            correctAnswer: correctAnswerIndex,
            difficulty: difficulty || 'medium',
            subject: subject.trim(),
            category: category?.trim() || ''
        });
        
        res.json({
            success: true,
            message: 'Question updated successfully',
            question: existingQuestion
        });
        
    } catch (error) {
        console.error('Update question error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update question'
        });
    }
};

// Delete question
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        
        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        
        // Soft delete by setting isActive to false
        await question.update({ isActive: false });
        
        res.json({
            success: true,
            message: 'Question deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete question error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete question'
        });
    }
};

// Render results page
const renderResults = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        
        const results = await Result.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email']
            }],
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: limit
        });
        
        const totalResults = await Result.count();
        const totalPages = Math.ceil(totalResults / limit);
        
        // Calculate statistics
        const allResults = await Result.findAll({
            attributes: ['percentage']
        });
        
        let stats = { averageScore: 0, highestScore: 0, lowestScore: 0 };
        if (allResults.length > 0) {
            const percentages = allResults.map(r => r.percentage);
            stats = {
                averageScore: percentages.reduce((a, b) => a + b, 0) / percentages.length,
                highestScore: Math.max(...percentages),
                lowestScore: Math.min(...percentages)
            };
        }
        
        res.render('admin/results', {
            title: 'Exam Results',
            user: req.user,
            results,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
            stats
        });
    } catch (error) {
        console.error('Results page error:', error);
        res.render('error', {
            title: 'Error',
            user: req.user,
            message: 'Failed to load results'
        });
    }
};

// Get question by ID (API)
const getQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findByPk(id);
        
        if (!question || !question.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        
        res.json({
            success: true,
            question
        });
    } catch (error) {
        console.error('Get question error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch question'
        });
    }
};

module.exports = {
    renderDashboard,
    renderQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    renderResults,
    getQuestion
};
