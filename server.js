const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const examRoutes = require('./routes/exam');

// Import database configuration
const { connectDB } = require('./config/database');

// Import models to establish associations
require('./models');

const app = express();

// Connect to MySQL
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session store configuration
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'onlineexam',
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

// Session configuration
app.use(session({
    key: 'exam_session',
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Global middleware to pass user data to templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Root level auth routes for direct access
app.use('/', authRoutes);

// Legacy auth routes (for backward compatibility)
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/exam', examRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Online Exam System',
        user: req.session.user 
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).render('404', { 
        title: 'Page Not Found',
        user: req.session.user 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Server Error',
        user: req.session.user,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});
