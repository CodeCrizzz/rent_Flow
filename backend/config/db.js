const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',            
    host: 'localhost',
    database: 'rentFlow_db',          
    password: 'codecrizzz',   
    port: 5432,
    options: '-c search_path="rentFlow_schema"' 
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL Database (Schema: rentFlow_schema)');
});

pool.on('error', (err) => {
    console.error('Unexpected error', err);
    process.exit(-1);
});

module.exports = db = {
    query: (text, params) => pool.query(text, params),
};