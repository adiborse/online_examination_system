const { sequelize } = require('./config/database');
const Question = require('./models/Question');
const User = require('./models/User');

async function addSampleData() {
    try {
        // Wait for database connection
        await sequelize.authenticate();
        console.log('Database connected successfully');
        
        // Check if questions exist
        const questionCount = await Question.count();
        console.log(`Found ${questionCount} questions in database`);
        
        if (questionCount === 0) {
            console.log('Adding sample questions...');
            
            const sampleQuestions = [
                {
                    question: 'What is the capital of France?',
                    options: ['London', 'Berlin', 'Paris', 'Madrid'],
                    correctAnswer: 2,
                    difficulty: 'easy',
                    subject: 'Geography',
                    category: 'World Capitals',
                    isActive: true,
                    createdBy: 1
                },
                {
                    question: 'Which programming language is primarily used for web development?',
                    options: ['Python', 'JavaScript', 'C++', 'Java'],
                    correctAnswer: 1,
                    difficulty: 'easy',
                    subject: 'Computer Science',
                    category: 'Programming',
                    isActive: true,
                    createdBy: 1
                },
                {
                    question: 'What is 2 + 2?',
                    options: ['3', '4', '5', '6'],
                    correctAnswer: 1,
                    difficulty: 'easy',
                    subject: 'Mathematics',
                    category: 'Basic Math',
                    isActive: true,
                    createdBy: 1
                },
                {
                    question: 'Which planet is closest to the Sun?',
                    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
                    correctAnswer: 1,
                    difficulty: 'easy',
                    subject: 'Science',
                    category: 'Astronomy',
                    isActive: true,
                    createdBy: 1
                },
                {
                    question: 'What does HTML stand for?',
                    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
                    correctAnswer: 0,
                    difficulty: 'medium',
                    subject: 'Computer Science',
                    category: 'Web Development',
                    isActive: true,
                    createdBy: 1
                }
            ];
            
            await Question.bulkCreate(sampleQuestions);
            console.log('Sample questions added successfully!');
            
            const newCount = await Question.count();
            console.log(`Total questions now: ${newCount}`);
        } else {
            console.log('Questions already exist in database');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error adding sample data:', error);
        process.exit(1);
    }
}

addSampleData();
