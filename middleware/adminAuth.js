// Middleware to check if user is an admin
const adminAuth = (req, res, next) => {
    // Check if user is logged in
    if (!req.session || !req.session.user) {
        return res.status(401).redirect('/auth/login');
    }
    
    // Check if user is admin
    if (req.session.user.role !== 'admin') {
        return res.status(403).render('error', {
            title: 'Access Denied',
            user: req.session.user,
            message: 'Access denied. Admin privileges required.'
        });
    }
    
    // Attach user to request object
    req.user = req.session.user;
    next();
};

module.exports = adminAuth;
