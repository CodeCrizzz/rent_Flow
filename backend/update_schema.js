const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'rentFlow_db',
    password: 'codecrizzz',
    port: 5432,
    options: '-c search_path="rentFlow_schema"'
});

async function updateSchema() {
    try {
        await pool.query(`
            ALTER TABLE rooms 
            ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'Single', 
            ADD COLUMN IF NOT EXISTS floor VARCHAR(50), 
            ADD COLUMN IF NOT EXISTS description TEXT;
        `);
        console.log("Schema updated successfully: added type, floor, and description to rooms table.");
    } catch (err) {
        console.error("Error updating schema:", err);
    } finally {
        pool.end();
    }
}

updateSchema();
