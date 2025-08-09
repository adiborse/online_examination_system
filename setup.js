require('dotenv').config();

const { sequelize } = require('./config/database');
const bcrypt = require('bcryptjs');

// Import models
const { User, Question } = require('./models');

// Sample questions data
const sampleQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        difficulty: "easy",
        subject: "Geography",
        category: "World Capitals"
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "JavaScript", "Java", "C++"],
        correctAnswer: 1,
        difficulty: "easy",
        subject: "Computer Science",
        category: "Programming"
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Saturn", "Neptune"],
        correctAnswer: 1,
        difficulty: "easy",
        subject: "Science",
        category: "Astronomy"
    },
    {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correctAnswer: 1,
        difficulty: "medium",
        subject: "History",
        category: "World Wars"
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        difficulty: "medium",
        subject: "Chemistry",
        category: "Elements"
    },
    {
        question: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
        difficulty: "medium",
        subject: "Computer Science",
        category: "Data Structures"
    },
    {
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        correctAnswer: 2,
        difficulty: "easy",
        subject: "Mathematics",
        category: "Arithmetic"
    },
    {
        question: "Who wrote the novel 'To Kill a Mockingbird'?",
        options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"],
        correctAnswer: 0,
        difficulty: "medium",
        subject: "Literature",
        category: "American Literature"
    },
    {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: 1,
        difficulty: "hard",
        subject: "Computer Science",
        category: "Algorithms"
    },
    {
        question: "Which organ produces insulin in the human body?",
        options: ["Liver", "Kidney", "Pancreas", "Heart"],
        correctAnswer: 2,
        difficulty: "medium",
        subject: "Biology",
        category: "Human Anatomy"
    }
];

async function setupDatabase() {
    try {
        // Test MySQL connection
        await sequelize.authenticate();
        console.log('Connected to MySQL database');
        
        // Create database if it doesn't exist and sync tables
        await sequelize.sync({ force: true }); // Use force: false in production
        console.log('Database tables created/synchronized');
        
        // Create admin user
        console.log('Creating admin user...');
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@exam.com',
            password: 'admin123', // Will be hashed by the model hook
            role: 'admin'
        });
        console.log('Admin user created: admin@exam.com / admin123');
        
        // Create sample student
        console.log('Creating sample student...');
        const student = await User.create({
            name: 'John Doe',
            email: 'student@exam.com',
            password: 'student123', // Will be hashed by the model hook
            role: 'student'
        });
        console.log('Sample student created: student@exam.com / student123');
        
        // Create sample questions
        console.log('Creating sample questions...');
        for (const questionData of sampleQuestions) {
            await Question.create({
                ...questionData,
                createdBy: admin.id
            });
        }
        console.log(`Created ${sampleQuestions.length} sample questions`);
        
        console.log('\n✅ Database setup completed successfully!');
        console.log('\n📝 You can now:');
        console.log('1. Login as admin: admin@exam.com / admin123');
        console.log('2. Login as student: student@exam.com / student123');
        console.log('3. Or register a new student account');
        console.log('\n🚀 Start the server with: npm run dev');
        console.log('🌐 Visit: http://localhost:3000');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        
        if (error.name === 'SequelizeConnectionRefusedError') {
            console.log('\n💡 MySQL Connection Error Solutions:');
            console.log('1. Make sure MySQL server is running');
            console.log('2. Check your MySQL credentials in .env file');
            console.log('3. Default setup uses: host=localhost, user=root, password=""');
            console.log('4. You may need to create the database first or change DB_NAME in .env');
            console.log('\n🔧 MySQL Setup Commands:');
            console.log('mysql -u root -p');
            console.log('CREATE DATABASE onlineexam;');
        }
        
        if (error.name === 'SequelizeAccessDeniedError') {
            console.log('\n💡 MySQL Access Denied Solutions:');
            console.log('1. Check your MySQL username and password in .env file');
            console.log('2. Make sure the user has permissions to create databases');
            console.log('3. Update DB_USER and DB_PASSWORD in .env file');
        }
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

// Run the setup
setupDatabase();
