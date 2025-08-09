const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
const auth = async (req, res, next) => {
    try {
        // Check if user is logged in via session
        if (req.session && req.session.user) {
            req.user = req.session.user;
            return next();
        }
        
        // Check for JWT token in header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).redirect('/auth/login');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        
        if (!user || !user.isActive) {
            return res.status(401).redirect('/auth/login');
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).redirect('/auth/login');
    }
};

// Middleware to check if user is a student
const studentAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).redirect('/auth/login');
    }
    
    if (req.user.role !== 'student') {
        return res.status(403).render('error', {
            title: 'Access Denied',
            user: req.user,
            message: 'Access denied. Students only.'
        });
    }
    
    next();
};

// Middleware to redirect authenticated users away from auth pages
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.session.user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('/exam/dashboard');
        }
    }
    next();
};

module.exports = {
    auth,
    studentAuth,
    redirectIfAuthenticated
};
