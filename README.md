# Online Examination System

A complete web-based examination system built with Node.js, Express.js, MongoDB, and EJS templating engine.

## Features

### Admin Features
- Secure admin login
- Add, update, and delete questions (MCQs)
- Set exam time duration
- View and manage student results
- Dashboard with statistics

### Student Features
- Student registration and login
- Timer-based exam interface
- One question per page navigation
- Auto-submit when time expires
- View results immediately after submission
- Score and percentage calculation

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Template Engine**: EJS
- **Authentication**: JWT (JSON Web Tokens)
- **Session Management**: Express Sessions

## Project Structure

```
online-exam-system/
├── config/
│   └── database.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   └── examController.js
├── middleware/
│   ├── auth.js
│   └── adminAuth.js
├── models/
│   ├── User.js
│   ├── Question.js
│   └── Result.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── exam.js
│   │   └── admin.js
│   └── images/
├── routes/
│   ├── admin.js
│   ├── auth.js
│   └── exam.js
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   ├── questions.ejs
│   │   └── results.ejs
│   ├── student/
│   │   ├── dashboard.ejs
│   │   ├── exam.ejs
│   │   └── result.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── index.ejs
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Steps to Run Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-exam-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup MongoDB**
   
   **Option A: Local MongoDB (Recommended for development)**
   - Install MongoDB Community Server from: https://www.mongodb.com/try/download/community
   - Follow the installation guide for your operating system
   - Detailed instructions available in `MONGODB_SETUP.md`
   
   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at: https://www.mongodb.com/atlas
   - Create a cluster and get your connection string
   - Detailed instructions available in `MONGODB_SETUP.md`

4. **Environment Configuration**
   Create a `.env` file in the root directory and add:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/onlineexam
   JWT_SECRET=your_jwt_secret_key_here
   SESSION_SECRET=your_session_secret_here
   ```
   
   For MongoDB Atlas, update the MONGODB_URI:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/onlineexam?retryWrites=true&w=majority
   ```

5. **Setup Database with Sample Data**
   ```bash
   npm run setup
   ```
   This creates:
   - Admin user: admin@exam.com / admin123
   - Sample student: student@exam.com / student123
   - 10 sample questions

6. **Start the application**
   
   For development (with auto-restart):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

7. **Access the application**
   Open your browser and go to: `http://localhost:3000`

## Default Admin Credentials

When you first run the application, a default admin account will be created:

- **Email**: admin@exam.com
- **Password**: admin123

**Important**: Change these credentials after your first login!

## Usage

### Admin Workflow
1. Login with admin credentials
2. Go to Questions section to add/manage exam questions
3. Set exam duration in settings
4. Monitor student results in the Results section

### Student Workflow
1. Register for a new account
2. Login with student credentials
3. Click "Start Exam" from dashboard
4. Answer questions one by one
5. Submit exam or wait for auto-submit
6. View results immediately

## API Endpoints

### Authentication
- `POST /auth/register` - Student registration
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout

### Admin Routes
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/questions` - Manage questions
- `POST /admin/questions` - Add new question
- `PUT /admin/questions/:id` - Update question
- `DELETE /admin/questions/:id` - Delete question
- `GET /admin/results` - View all results

### Student/Exam Routes
- `GET /exam/start` - Start exam
- `GET /exam/question/:id` - Get specific question
- `POST /exam/submit` - Submit exam answers
- `GET /exam/result` - View exam result

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/student),
  createdAt: Date
}
```

### Question Model
```javascript
{
  question: String,
  options: [String],
  correctAnswer: Number,
  difficulty: String,
  subject: String,
  createdAt: Date
}
```

### Result Model
```javascript
{
  userId: ObjectId,
  answers: [Number],
  score: Number,
  percentage: Number,
  timeSpent: Number,
  submittedAt: Date
}
```

## Features in Detail

### Timer Functionality
- Configurable exam duration
- Real-time countdown display
- Auto-submit when time expires
- Warning alerts at 5 and 1 minute remaining

### Security Features
- Password hashing with bcrypt
- JWT authentication
- Session management
- Protected routes
- Input validation

### Responsive Design
- Mobile-friendly interface
- Clean and intuitive UI
- Bootstrap-based styling

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify network connectivity for Atlas

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes on port 3000

3. **Dependencies Issues**
   - Delete node_modules and package-lock.json
   - Run `npm install` again

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@examSystem.com or create an issue in the repository.
