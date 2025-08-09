const Question = require('../models/Question');
const Result = require('../models/Result');
const User = require('../models/User');

// Render student dashboard
const renderDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get user's exam history
        const examHistory = await Result.findAll({
            where: { userId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email']
            }],
            order: [['createdAt', 'DESC']],
            limit: 5
        });
        
        // Get total questions available
        const totalQuestions = await Question.count({ where: { isActive: true } });
        
        // Calculate user's best score
        const bestScore = examHistory.length > 0 
            ? Math.max(...examHistory.map(result => result.percentage))
            : 0;
        
        res.render('student/dashboard', {
            title: 'Student Dashboard',
            user: req.user,
            examHistory,
            totalQuestions,
            bestScore: bestScore.toFixed(1),
            hasExamHistory: examHistory.length > 0
        });
    } catch (error) {
        console.error('Student dashboard error:', error);
        res.render('error', {
            title: 'Error',
            user: req.user,
            message: 'Failed to load dashboard'
        });
    }
};

// Start exam
const startExam = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Check if user has an ongoing exam
        const ongoingExam = req.session.examData;
        if (ongoingExam && ongoingExam.userId === userId) {
            return res.redirect(`/exam/question/${ongoingExam.currentQuestion}`);
        }
        
        // Get all active questions
        const questions = await Question.findAll({
            where: { isActive: true },
            attributes: ['id', 'question', 'options'],
            order: [['createdAt', 'ASC']]
        });
        
        if (questions.length === 0) {
            return res.render('error', {
                title: 'No Questions Available',
                user: req.user,
                message: 'No questions are available for the exam at this time.'
            });
        }
        
        // Create exam session
        const examData = {
            userId,
            questions: questions.map(q => q.id),
            currentQuestion: 0,
            answers: {},
            startTime: new Date(),
            duration: 60 // 60 minutes
        };
        
        req.session.examData = examData;
        
        res.redirect(`/exam/question/0`);
        
    } catch (error) {
        console.error('Start exam error:', error);
        res.render('error', {
            title: 'Error',
            user: req.user,
            message: 'Failed to start exam'
        });
    }
};

// Render exam question
const renderQuestion = async (req, res) => {
    try {
        const { questionIndex } = req.params;
        const examData = req.session.examData;
        
        if (!examData || examData.userId !== req.user.id) {
            return res.redirect('/exam/dashboard');
        }
        
        const currentIndex = parseInt(questionIndex);
        
        if (currentIndex < 0 || currentIndex >= examData.questions.length) {
            return res.redirect('/exam/dashboard');
        }
        
        // Check if exam time has expired
        const timeElapsed = (new Date() - new Date(examData.startTime)) / 1000 / 60; // minutes
        if (timeElapsed > examData.duration) {
            return res.redirect('/exam/submit');
        }
        
        const questionId = examData.questions[currentIndex];
        const question = await Question.findByPk(questionId);
        
        if (!question) {
            return res.redirect('/exam/dashboard');
        }
        
        const timeRemaining = Math.max(0, examData.duration - timeElapsed);
        
        res.render('student/exam', {
            title: `Question ${currentIndex + 1} of ${examData.questions.length}`,
            user: req.user,
            question,
            currentIndex,
            totalQuestions: examData.questions.length,
            timeRemaining: Math.ceil(timeRemaining),
            selectedAnswer: examData.answers[questionId] || null,
            isLastQuestion: currentIndex === examData.questions.length - 1
        });
        
    } catch (error) {
        console.error('Render question error:', error);
        res.render('error', {
            title: 'Error',
            user: req.user,
            message: 'Failed to load question'
        });
    }
};

// Save answer and navigate
const saveAnswer = async (req, res) => {
    try {
        const { questionId, answer, action } = req.body;
        const examData = req.session.examData;
        
        if (!examData || examData.userId !== req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Invalid exam session'
            });
        }
        
        // Save answer if provided
        if (answer !== undefined && answer !== null && answer !== '') {
            examData.answers[questionId] = parseInt(answer);
        }
        
        req.session.examData = examData;
        
        const currentIndex = examData.questions.indexOf(parseInt(questionId));
        let nextIndex;
        
        switch (action) {
            case 'next':
                nextIndex = Math.min(currentIndex + 1, examData.questions.length - 1);
                break;
            case 'previous':
                nextIndex = Math.max(currentIndex - 1, 0);
                break;
            case 'submit':
                return res.json({
                    success: true,
                    redirect: '/exam/submit'
                });
            default:
                nextIndex = currentIndex;
        }
        
        res.json({
            success: true,
            redirect: `/exam/question/${nextIndex}`
        });
        
    } catch (error) {
        console.error('Save answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save answer'
        });
    }
};

// Submit exam
const submitExam = async (req, res) => {
    try {
        const examData = req.session.examData;
        
        if (!examData || examData.userId !== req.user.id) {
            return res.redirect('/exam/dashboard');
        }
        
        const endTime = new Date();
        const timeSpent = (endTime - new Date(examData.startTime)) / 1000; // seconds
        
        // Get all questions with correct answers
        const questions = await Question.findAll({
            where: {
                id: examData.questions
            }
        });
        
        let correctAnswers = 0;
        const resultQuestions = [];
        
        questions.forEach(question => {
            const selectedAnswer = examData.answers[question.id];
            const isCorrect = selectedAnswer === question.correctAnswer;
            
            if (isCorrect) {
                correctAnswers++;
            }
            
            resultQuestions.push({
                questionId: question.id,
                selectedAnswer: selectedAnswer !== undefined ? selectedAnswer : null,
                correctAnswer: question.correctAnswer,
                isCorrect
            });
        });
        
        const totalQuestions = questions.length;
        const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        
        // Create result record
        const result = await Result.create({
            userId: req.user.id,
            examId: 'default',
            questions: resultQuestions,
            totalQuestions: examData.questions.length,
            correctAnswers,
            score: correctAnswers,
            percentage: parseFloat(percentage.toFixed(2)),
            timeSpent: Math.round(timeSpent),
            examDuration: examData.duration,
            startTime: new Date(examData.startTime),
            endTime,
            submissionType: timeSpent > (examData.duration * 60) ? 'auto' : 'manual'
        });
        
        // Clear exam session
        delete req.session.examData;
        
        res.redirect(`/exam/result/${result.id}`);
        
    } catch (error) {
        console.error('Submit exam error:', error);
        res.render('error', {
            title: 'Error',
            user: req.user,
            message: 'Failed to submit exam'
        });
    }
};

// Render exam result
const renderResult = async (req, res) => {
    try {
        const { resultId } = req.params;
        
        const result = await Result.findByPk(resultId, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email']
            }]
        });
        
        if (!result || result.userId !== req.user.id) {
            return res.render('error', {
                title: 'Result Not Found',
                user: req.user,
                message: 'Exam result not found or access denied.'
            });
        }
        
        res.render('student/result', {
            title: 'Exam Result',
            user: req.user,
            result
        });
        
    } catch (error) {
        console.error('Render result error:', error);
        res.render('error', {
            title: 'Error',
            user: req.user,
            message: 'Failed to load result'
        });
    }
};

// Get exam status (for timer updates)
const getExamStatus = async (req, res) => {
    try {
        const examData = req.session.examData;
        
        if (!examData || examData.userId !== req.user.id) {
            return res.json({
                success: false,
                message: 'No active exam'
            });
        }
        
        const timeElapsed = (new Date() - new Date(examData.startTime)) / 1000 / 60; // minutes
        const timeRemaining = Math.max(0, examData.duration - timeElapsed);
        
        res.json({
            success: true,
            timeRemaining: Math.ceil(timeRemaining),
            isExpired: timeRemaining <= 0
        });
        
    } catch (error) {
        console.error('Get exam status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get exam status'
        });
    }
};

module.exports = {
    renderDashboard,
    startExam,
    renderQuestion,
    saveAnswer,
    submitExam,
    renderResult,
    getExamStatus
};
