const db = require('./backend/config/db');

async function updateSchema() {
    try {
        console.log('Adding address and monthly_rent columns to users table...');
        await db.query(`
            ALTER TABLE "rentFlow_schema".users 
            ADD COLUMN IF NOT EXISTS address TEXT,
            ADD COLUMN IF NOT EXISTS monthly_rent DECIMAL(10, 2);
        `);
        console.log('Schema updated successfully.');
    } catch (error) {
        console.error('Error updating schema:', error);
    } finally {
        process.exit();
    }
}

updateSchema();
