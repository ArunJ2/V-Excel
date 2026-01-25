import pool from '../config/database.js';
export const saveRecordVersion = async (req, res) => {
    const { student_id, entity_type, data, change_reason } = req.body;
    const changed_by = req.user.id;
    try {
        // 1. Get current max version
        const versionRes = await pool.query('SELECT COALESCE(MAX(version_number), 0) as max_v FROM record_versions WHERE entity_type = $1 AND entity_id = $2', [entity_type, student_id]);
        const nextVersion = versionRes.rows[0].max_v + 1;
        // 2. Insert new version
        const result = await pool.query('INSERT INTO record_versions (entity_type, entity_id, version_number, data, changed_by, change_reason) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [entity_type, student_id, nextVersion, data, changed_by, change_reason]);
        // 3. Update the corresponding normalized table (clinical_history, milestones, etc.)
        // This part ensures the "current state" tables stay updated while keeping history
        const tableNameMap = {
            'clinical_history': 'clinical_history',
            'milestones': 'developmental_milestones',
            'adl': 'daily_living_skills',
            'observations': 'clinical_observations'
        };
        const tableName = tableNameMap[entity_type];
        if (tableName) {
            // Build dynamic update for the current state table
            const fields = Object.keys(data);
            const setClause = fields.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
            const values = Object.values(data);
            await pool.query(`INSERT INTO ${tableName} (student_id, ${fields.map(f => `"${f}"`).join(', ')}) 
             VALUES ($${values.length + 1}, ${fields.map((_, i) => `$${i + 1}`).join(', ')})
             ON CONFLICT (student_id) DO UPDATE SET ${setClause}, updated_at = CURRENT_TIMESTAMP`, [...values, student_id]);
        }
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getRecordVersions = async (req, res) => {
    const { entityType, entityId } = req.params;
    try {
        const result = await pool.query('SELECT rv.*, u.name as user_name FROM record_versions rv JOIN users u ON rv.changed_by = u.id WHERE rv.entity_type = $1 AND rv.entity_id = $2 ORDER BY rv.version_number DESC', [entityType, entityId]);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
