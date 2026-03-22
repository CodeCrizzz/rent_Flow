const { Pool } = require('pg');

const pool = new Pool({
    user: 'rentFlow_role',            // name of the log-in / Group role
    host: 'localhost',                // DB host
    database: 'rentFlow_db',          //DB name
    password: 'codecrizzz',            //DB password
    port: 5432,                       // DB port
    options: '-c search_path="rentFlow_db"'  // To use my own schema
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL Database as rentFlow_role');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};