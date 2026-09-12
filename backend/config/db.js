const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://postgres:CodeCrizzz@localhost:5432/rentTrack_db`,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    options: '-c search_path="rentTrack_schema",public',
});

pool.on('connect', (client) => {
    client.query('SET search_path TO "rentTrack_schema", public;')
        .catch(err => console.error('Error setting search_path:', err));
    console.log('Connected to PostgreSQL Database (Schema: rentTrack_schema)');
});

pool.on('error', (err) => {
    console.error('Unexpected error', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};