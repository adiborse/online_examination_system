# MySQL Setup Guide for Online Exam System

## ✅ MySQL is Running!
Great! I can see that MySQL80 service is running on your system.

## 🔧 Quick Setup Steps:

### Step 1: Update Your MySQL Password
1. Open the `.env` file in your project root
2. Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password
3. If you don't have a password set for root, leave it empty: `DB_PASSWORD=`

### Step 2: Create the Database (Optional)
You can either:
1. **Let the app create it automatically** (recommended)
2. **Create it manually** using MySQL Workbench or command line

#### Option A: Automatic (Recommended)
Just run the setup script after updating your password - it will create the database for you.

#### Option B: Manual Database Creation
If you have MySQL Workbench or command line access:
```sql
CREATE DATABASE onlineexam;
```

### Step 3: Run the Setup
```bash
npm run setup
```

## 🆘 Common Issues & Solutions:

### Issue 1: "Access denied for user 'root'@'localhost'"
**Solution**: Update your MySQL password in `.env` file
```env
DB_PASSWORD=your_actual_mysql_password
```

### Issue 2: "Database 'onlineexam' doesn't exist"
**Solution**: The setup script will create it automatically, or create manually:
```sql
CREATE DATABASE onlineexam;
```

### Issue 3: "Unknown database 'onlineexam'"
**Solution**: Either let the script create it or use an existing database name in `.env`:
```env
DB_NAME=your_existing_database_name
```

### Issue 4: Different MySQL User
If you're not using 'root', update the user in `.env`:
```env
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
```

## 🎯 Alternative: Using MySQL Workbench

If you have MySQL Workbench installed:

1. **Open MySQL Workbench**
2. **Connect to your local MySQL server**
3. **Create a new database**: `CREATE DATABASE onlineexam;`
4. **Update .env** with your connection details
5. **Run**: `npm run setup`

## 🚀 After Setup:

Once the setup is successful, you'll see:
```
✅ Database setup completed successfully!
📝 You can now:
1. Login as admin: admin@exam.com / admin123
2. Login as student: student@exam.com / student123
3. Or register a new student account
```

Then start the server:
```bash
npm run dev
```

Visit: http://localhost:3000

## 💡 Need Help?

If you're still having issues:
1. Check if you can connect to MySQL using your regular tools
2. Make sure the MySQL80 service is running (it is!)
3. Try using a different database name if you have permission issues
4. Consider creating a new MySQL user specifically for this project

Let me know what your MySQL root password is (or if you don't have one set), and I can help you get this running!
