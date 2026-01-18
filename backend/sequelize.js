// backend/sequelize.js
const { Sequelize } = require('sequelize');
const fs = require('fs');

// Read DB config from environment variables or secret file
const host = process.env.DB_HOST || 'db';
const database = process.env.DB_NAME || 'mybudget';
const username = process.env.DB_USER || 'postgres';
let password;

if (process.env.DB_PASS) {
    password = process.env.DB_PASS;
} else if (process.env.DB_PASS_FILE) {
    password = fs.readFileSync(process.env.DB_PASS_FILE, 'utf8').trim();
}

if (!password) {
    console.error('Database password is not set');
    process.exit(1);
}

const sequelize = new Sequelize(
        database,
        username,
        password, {
          host,
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize;