# MongoDB Setup Guide

This guide will help you set up MongoDB for the Online Exam System.

## Option 1: Local MongoDB Installation (Recommended for Development)

### Windows:

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select "Windows" platform
   - Download and run the installer

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Follow the installation wizard
   - Choose "Complete" setup type
   - Install MongoDB as a Windows Service (recommended)

3. **Verify Installation**
   ```powershell
   # Open PowerShell as Administrator and run:
   mongod --version
   ```

4. **Start MongoDB Service**
   ```powershell
   # If not running as service, start manually:
   net start MongoDB
   ```

### macOS:

1. **Using Homebrew (Recommended)**
   ```bash
   # Install Homebrew if not already installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB
   brew services start mongodb/brew/mongodb-community
   ```

2. **Manual Installation**
   - Download from: https://www.mongodb.com/try/download/community
   - Follow the installation instructions

### Linux (Ubuntu/Debian):

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Option 2: MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**
   - Visit: https://www.mongodb.com/atlas
   - Sign up for a free account

2. **Create a Free Cluster**
   - Click "Create" to create a new cluster
   - Choose the free tier (M0)
   - Select a cloud provider and region

3. **Setup Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Grant "Read and write to any database" privileges

4. **Setup Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Add your current IP address or use 0.0.0.0/0 for development (not recommended for production)

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/onlineexam?retryWrites=true&w=majority
   ```

## Setup Project Database

After setting up MongoDB (local or cloud), run the setup script to populate the database with sample data:

```bash
# Navigate to project directory
cd OnlineExamSystem

# Run the setup script
npm run setup
```

This will create:
- Admin user: admin@exam.com / admin123
- Sample student: student@exam.com / student123
- 10 sample questions across different subjects

## Troubleshooting

### Common Issues:

1. **Connection Refused Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Make sure MongoDB is running
   ```powershell
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb/brew/mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Authentication Failed**
   ```
   Error: Authentication failed
   ```
   **Solution**: Check your MongoDB Atlas credentials in .env file

3. **Network Timeout**
   ```
   Error: Server selection timed out
   ```
   **Solution**: 
   - For Atlas: Check network access settings
   - For local: Check if MongoDB service is running

4. **Port Already in Use**
   ```
   Error: Port 27017 already in use
   ```
   **Solution**: 
   - Kill existing MongoDB processes
   - Or use a different port in your connection string

### Verification Commands:

```bash
# Check if MongoDB is running (local)
mongo --eval "db.runCommand({connectionStatus : 1})"

# Check database connection in your app
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/onlineexam').then(() => console.log('Connected!')).catch(console.error);"
```

## Next Steps

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000

3. Login with the created accounts or register a new student account

## Production Deployment

For production, consider:
- Using MongoDB Atlas or a managed MongoDB service
- Setting up proper authentication and authorization
- Configuring SSL/TLS encryption
- Setting up database backups
- Monitoring database performance
