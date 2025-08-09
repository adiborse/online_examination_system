const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/auth');

// Render general login page (redirects to role selection)
router.get('/login', redirectIfAuthenticated, authController.renderRoleSelection);

// Render admin login page
router.get('/admin/login', redirectIfAuthenticated, authController.renderAdminLogin);

// Render student login page
router.get('/student/login', redirectIfAuthenticated, authController.renderStudentLogin);

// Render register page
router.get('/register', redirectIfAuthenticated, authController.renderRegister);

// Handle admin login
router.post('/admin/login', redirectIfAuthenticated, authController.adminLogin);

// Handle student login
router.post('/student/login', redirectIfAuthenticated, authController.studentLogin);

// Handle registration
router.post('/register', redirectIfAuthenticated, authController.register);

// Handle logout
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

module.exports = router;
