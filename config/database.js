const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'onlineexam',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Connected successfully');
        
        // Sync database (create tables if they don't exist)
        await sequelize.sync({ force: false });
        console.log('Database tables synchronized');
        
        // Create default admin user if it doesn't exist
        await createDefaultAdmin();
        
    } catch (error) {
        console.error('Database connection error:', error);
        
        if (error.name === 'SequelizeConnectionRefusedError') {
            console.log('\n💡 MySQL Connection Error Solutions:');
            console.log('1. Make sure MySQL server is running');
            console.log('2. Check your MySQL credentials in .env file');
            console.log('3. Ensure the database exists or will be created');
            console.log('4. Default connection: root user with no password');
        }
        
        process.exit(1);
    }
};

const createDefaultAdmin = async () => {
    try {
        const User = require('../models/User');
        const bcrypt = require('bcryptjs');
        
        const adminExists = await User.findOne({ where: { email: 'admin@exam.com' } });
        
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 12);
            
            await User.create({
                name: 'System Admin',
                email: 'admin@exam.com',
                password: hashedPassword,
                role: 'admin'
            });
            
            console.log('Default admin user created: admin@exam.com / admin123');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

module.exports = { sequelize, connectDB };
