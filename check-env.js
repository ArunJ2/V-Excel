require('dotenv').config();
console.log('Result:');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL length:', process.env.DATABASE_URL.length);
    // Do not print the full URL for security, just protocol
    console.log('Protocol:', process.env.DATABASE_URL.split('://')[0]);
} else {
    console.log('DATABASE_URL is undefined');
}
