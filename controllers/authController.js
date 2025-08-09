const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Render role selection page
const renderRoleSelection = (req, res) => {
    res.render('role-selection', {
        title: 'Choose Login Type - Online Exam System',
        error: null
    });
};

// Render admin login page
const renderAdminLogin = (req, res) => {
    res.render('admin-login', {
        title: 'Admin Login - Online Exam System',
        error: null
    });
};

// Render student login page
const renderStudentLogin = (req, res) => {
    res.render('student-login', {
        title: 'Student Login - Online Exam System',
        error: null
    });
};

// Render login page (legacy - redirects to role selection)
const renderLogin = (req, res) => {
    res.redirect('/login');
};

// Render register page
const renderRegister = (req, res) => {
    res.render('register', {
        title: 'Register - Online Exam System',
        error: null
    });
};

// Handle user registration
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return res.render('register', {
                title: 'Register - Online Exam System',
                error: 'All fields are required'
            });
        }
        
        if (password !== confirmPassword) {
            return res.render('register', {
                title: 'Register - Online Exam System',
                error: 'Passwords do not match'
            });
        }
        
        if (password.length < 6) {
            return res.render('register', {
                title: 'Register - Online Exam System',
                error: 'Password must be at least 6 characters long'
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            return res.render('register', {
                title: 'Register - Online Exam System',
                error: 'User with this email already exists'
            });
        }
        
        // Create new user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role: 'student'
        });
        
        // Auto login after registration
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        res.redirect('/exam/dashboard');
        
    } catch (error) {
        console.error('Registration error:', error);
        res.render('register', {
            title: 'Register - Online Exam System',
            error: 'Registration failed. Please try again.'
        });
    }
};

// Handle admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.render('admin-login', {
                title: 'Admin Login - Online Exam System',
                error: 'Email and password are required'
            });
        }
        
        // Find user and check if admin
        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user || !user.isActive || user.role !== 'admin') {
            return res.render('admin-login', {
                title: 'Admin Login - Online Exam System',
                error: 'Invalid admin credentials'
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('admin-login', {
                title: 'Admin Login - Online Exam System',
                error: 'Invalid admin credentials'
            });
        }
        
        // Update last login
        await user.update({ lastLogin: new Date() });
        
        // Create session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Admin login error:', error);
        res.render('admin-login', {
            title: 'Admin Login - Online Exam System',
            error: 'Login failed. Please try again.'
        });
    }
};

// Handle student login
const studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.render('student-login', {
                title: 'Student Login - Online Exam System',
                error: 'Email and password are required'
            });
        }
        
        // Find user and check if student
        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user || !user.isActive || user.role !== 'student') {
            return res.render('student-login', {
                title: 'Student Login - Online Exam System',
                error: 'Invalid student credentials'
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('student-login', {
                title: 'Student Login - Online Exam System',
                error: 'Invalid student credentials'
            });
        }
        
        // Update last login
        await user.update({ lastLogin: new Date() });
        
        // Create session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        res.redirect('/exam/dashboard');
    } catch (error) {
        console.error('Student login error:', error);
        res.render('student-login', {
            title: 'Student Login - Online Exam System',
            error: 'Login failed. Please try again.'
        });
    }
};

// Handle user login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.render('login', {
                title: 'Login - Online Exam System',
                error: 'Email and password are required'
            });
        }
        
        // Find user
        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user || !user.isActive) {
            return res.render('login', {
                title: 'Login - Online Exam System',
                error: 'Invalid email or password'
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', {
                title: 'Login - Online Exam System',
                error: 'Invalid email or password'
            });
        }
        
        // Update last login
        await user.update({ lastLogin: new Date() });
        
        // Create session
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        // Redirect based on role
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/exam/dashboard');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', {
            title: 'Login - Online Exam System',
            error: 'Login failed. Please try again.'
        });
    }
};

// Handle user logout
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
};

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });
};

module.exports = {
    renderRoleSelection,
    renderAdminLogin,
    renderStudentLogin,
    renderLogin,
    renderRegister,
    adminLogin,
    studentLogin,
    login,
    register,
    logout
};
