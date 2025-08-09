const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { auth, studentAuth } = require('../middleware/auth');

// Apply authentication to all routes
router.use(auth);

// Student dashboard (accessible to all authenticated users)
router.get('/dashboard', examController.renderDashboard);

// Student-only routes
router.use(studentAuth);

// Exam routes
router.get('/start', examController.startExam);
router.get('/question/:questionIndex', examController.renderQuestion);
router.post('/save-answer', examController.saveAnswer);
router.get('/submit', examController.submitExam);
router.post('/submit', examController.submitExam);

// Result routes
router.get('/result/:resultId', examController.renderResult);

// API routes
router.get('/status', examController.getExamStatus);

module.exports = router;
