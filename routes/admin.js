const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Apply admin authentication to all routes
router.use(adminAuth);

// Dashboard
router.get('/dashboard', adminController.renderDashboard);

// Questions management
router.get('/questions', adminController.renderQuestions);
router.post('/questions', adminController.addQuestion);
router.get('/questions/:id', adminController.getQuestion);
router.put('/questions/:id', adminController.updateQuestion);
router.delete('/questions/:id', adminController.deleteQuestion);

// Results management
router.get('/results', adminController.renderResults);

module.exports = router;
