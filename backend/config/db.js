const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:codecrizzz@localhost:5432/rentFlow_db',
    ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.on('connect', (client) => {
    client.query('SET search_path TO "rentFlow_schema", public;')
        .catch(err => console.error('Error setting search_path:', err));
    console.log('Connected to PostgreSQL Database (Schema: rentFlow_schema)');
});

pool.on('error', (err) => {
    console.error('Unexpected error', err);
    process.exit(-1);
});

module.exports = db = {
    query: (text, params) => pool.query(text, params),
};