# Quick Start Guide 🚀

Get the Online Exam System running in minutes!

## 🔧 Prerequisites

Make sure you have Node.js installed:
- Download from: https://nodejs.org/ (Choose LTS version)

## 🏃‍♂️ Quick Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup MongoDB (Choose one option):**

   **Option A: Use MongoDB Atlas (Cloud - Easiest)**
   - Go to: https://www.mongodb.com/atlas
   - Create a free account
   - Create a free cluster
   - Get your connection string
   - Update `.env` file with your connection string

   **Option B: Install MongoDB locally**
   - Windows: Download from https://www.mongodb.com/try/download/community
   - macOS: `brew install mongodb-community` (requires Homebrew)
   - Linux: Follow instructions at https://docs.mongodb.com/manual/installation/

3. **Initialize the database**
   ```bash
   npm run setup
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit: http://localhost:3000

## 👥 Default Accounts

After running `npm run setup`, you can login with:

**Admin Account:**
- Email: admin@exam.com
- Password: admin123

**Student Account:**
- Email: student@exam.com  
- Password: student123

## 🎯 What's Included

- ✅ 10 sample questions across multiple subjects
- ✅ Admin dashboard for managing questions
- ✅ Student exam interface with timer
- ✅ Automatic grading and results
- ✅ Responsive design for mobile/desktop

## 🚨 Troubleshooting

**MongoDB Connection Error?**
```bash
# Make sure MongoDB is running (local installation)
# Windows:
net start MongoDB

# macOS:
brew services start mongodb-community

# Or use MongoDB Atlas (cloud) - see MONGODB_SETUP.md
```

**Port 3000 already in use?**
- Change the PORT in your `.env` file to another number (e.g., 3001)

**Need help?**
- Check `MONGODB_SETUP.md` for detailed MongoDB setup
- Check `README.md` for complete documentation

## 🎉 You're Ready!

Your exam system is now running! Students can register and take exams, while admins can manage questions and view results.

Happy examining! 📚✨
