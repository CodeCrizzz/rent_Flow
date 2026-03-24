const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres', host: 'localhost', database: 'rentFlow_db', password: 'codecrizzz', port: 5432,
    options: '-c search_path="rentFlow_schema"'
});

async function test() {
    try {
        const query = `
            SELECT 
                r.id,
                (
                    SELECT COALESCE(json_agg(
                        json_build_object(
                            'id', u.id,
                            'name', u.name
                        )
                    ), '[]')
                    FROM users u 
                    WHERE u.room_id = r.id AND u.role = 'tenant' AND u.status != 'Moved Out'
                ) as occupants
            FROM rooms r LIMIT 1
        `;
        const res = await pool.query(query);
        console.log("Type of occupants:", typeof res.rows[0].occupants);
        console.log("Value:", res.rows[0].occupants);
        console.log("Is array:", Array.isArray(res.rows[0].occupants));
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
test();
