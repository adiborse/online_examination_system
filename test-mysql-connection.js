require('dotenv').config();
const mysql = require('mysql2');

const testConnections = [
    { user: 'root', password: '' },
    { user: 'root', password: 'root' },
    { user: 'root', password: 'admin' },
    { user: 'root', password: 'password' },
    { user: 'root', password: '123456' },
    { user: 'root', password: 'mysql' },
    { user: 'mysql', password: '' },
    { user: 'mysql', password: 'mysql' }
];

async function testConnection(config) {
    return new Promise((resolve) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: config.user,
            password: config.password
        });

        connection.connect((err) => {
            if (err) {
                resolve({ success: false, error: err.message });
            } else {
                connection.end();
                resolve({ success: true });
            }
        });
    });
}

async function findWorkingConnection() {
    console.log('🔍 Testing common MySQL connection configurations...\n');
    
    for (let i = 0; i < testConnections.length; i++) {
        const config = testConnections[i];
        console.log(`Testing: user='${config.user}', password='${config.password || '(empty)'}'`);
        
        const result = await testConnection(config);
        if (result.success) {
            console.log(`✅ SUCCESS! Working connection found:`);
            console.log(`   User: ${config.user}`);
            console.log(`   Password: ${config.password || '(empty)'}`);
            console.log(`\n📝 Update your .env file with:`);
            console.log(`   DB_USER=${config.user}`);
            console.log(`   DB_PASSWORD=${config.password}`);
            return;
        } else {
            console.log(`❌ Failed: ${result.error}`);
        }
        console.log('');
    }
    
    console.log('❌ None of the common configurations worked.');
    console.log('💡 You may need to:');
    console.log('   1. Reset your MySQL root password');
    console.log('   2. Create a new MySQL user');
    console.log('   3. Check MySQL Workbench for saved connections');
}

findWorkingConnection().catch(console.error);
