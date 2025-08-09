const readline = require('readline');
const mysql = require('mysql2');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function testPassword(password) {
    return new Promise((resolve) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: password
        });

        connection.connect((err) => {
            if (err) {
                resolve(false);
            } else {
                connection.end();
                resolve(true);
            }
        });
    });
}

rl.question('Enter your MySQL root password: ', async (password) => {
    console.log('Testing password...');
    
    const works = await testPassword(password);
    
    if (works) {
        console.log('✅ Password works! Updating .env file...');
        
        const fs = require('fs');
        const path = require('path');
        
        const envPath = path.join(__dirname, '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Update the password line
        envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${password}`);
        
        fs.writeFileSync(envPath, envContent);
        
        console.log('✅ .env file updated!');
        console.log('🚀 Now run: npm run setup');
    } else {
        console.log('❌ Password doesn\'t work. Please try again.');
    }
    
    rl.close();
});
