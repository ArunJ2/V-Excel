import pool from '../config/database.js';
export const getAllStudents = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students ORDER BY name ASC');
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
        if (student.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // Fetch related data in parallel
        const [history, milestones, adl, observations] = await Promise.all([
            pool.query('SELECT * FROM clinical_history WHERE student_id = $1', [id]),
            pool.query('SELECT * FROM developmental_milestones WHERE student_id = $1', [id]),
            pool.query('SELECT * FROM daily_living_skills WHERE student_id = $1', [id]),
            pool.query('SELECT * FROM clinical_observations WHERE student_id = $1', [id])
        ]);
        res.json({
            ...student.rows[0],
            clinical_history: history.rows[0] || null,
            developmental_milestones: milestones.rows[0] || null,
            daily_living_skills: adl.rows[0] || null,
            clinical_observations: observations.rows[0] || null
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const createStudent = async (req, res) => {
    const { ipp_number, name, dob, gender, address, parent_names, parent_contact, disability_type, referral_doctor } = req.body;
    try {
        const result = await pool.query('INSERT INTO students (ipp_number, name, dob, gender, address, parent_names, parent_contact, disability_type, referral_doctor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [ipp_number, name, dob, gender, address, parent_names, parent_contact, disability_type, referral_doctor]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    // Build dynamic update query
    const setClause = Object.keys(fields)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ');
    const values = Object.values(fields);
    try {
        const result = await pool.query(`UPDATE students SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`, [...values, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
