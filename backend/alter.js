const db = require('./config/db');

async function alterTable() {
    try {
        await db.query(`ALTER TABLE "rentFlow_schema".requests ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMP`);
        await db.query(`ALTER TABLE "rentFlow_schema".requests ADD COLUMN IF NOT EXISTS date_resolved TIMESTAMP`);
        console.log('Successfully altered requests table');
        process.exit(0);
    } catch (error) {
        console.error('Error altering table:', error);
        process.exit(1);
    }
}

alterTable();
