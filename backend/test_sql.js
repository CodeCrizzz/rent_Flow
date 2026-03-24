const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres', host: 'localhost', database: 'rentFlow_db', password: 'codecrizzz', port: 5432,
    options: '-c search_path="rentFlow_schema"'
});

async function test() {
    try {
        const query = `
            SELECT 
                r.*,
                (
                    SELECT COALESCE(json_agg(
                        json_build_object(
                            'id', u.id,
                            'name', u.name,
                            'phone', u.phone,
                            'date_moved_in', u.date_moved_in,
                            'balance', (SELECT COALESCE(SUM(amount), 0) FROM payments p WHERE p.tenant_id = u.id AND p.status = 'pending')
                        )
                    ), '[]')
                    FROM users u 
                    WHERE u.room_id = r.id AND u.role = 'tenant' AND u.status != 'Moved Out'
                ) as occupants,
                (SELECT COUNT(*) FROM users u WHERE u.room_id = r.id AND u.role = 'tenant' AND u.status != 'Moved Out') as current_occupants
            FROM rooms r
            ORDER BY r.room_number ASC
        `;
        const res = await pool.query(query);
        console.log("Success! Rooms length:", res.rows.length);
    } catch (e) {
        console.error("SQL Error:", e);
    } finally {
        pool.end();
    }
}
test();
