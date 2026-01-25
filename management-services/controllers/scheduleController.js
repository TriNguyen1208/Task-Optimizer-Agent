const db = require('../db');

const getAllSchedule = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN tasks t ON s.task_id = t.id
            ORDER BY s.id ASC;    
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getScheduleById = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await db.query(`
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN tasks t ON s.task_id = t.id
            WHERE s.id = $1   
        `, [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getScheduleByDate = async (req, res) => {
    try {
        const {date} = req.params;
        const result = await db.query(`
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN tasks t ON s.task_id = t.id
            WHERE s.date = $1   
        `, [date]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getScheduleBetweenDays = async (req, res) => {
    try {
        const {from_date, to_date} = req.body;
        const result = await db.query(`
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN tasks t ON s.task_id = t.id
            WHERE s.date >= $1 AND s.date < $2   
        `, [from_date, to_date]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getScheduleByTask = async (req, res) => {
    try {
        const {task_id} = req.params;
        const result = await db.query('SELECT * FROM schedule WHERE task_id = $1', [task_id]);
        res.json(result.rows[0]);
    } catch {
        res.status(500).json({ error: err.message });
    }
}

const addSchedule = async (req, res) => {
    try {
        const {
            date,
            start_time,
            end_time,
            task_id,
        } = req.body;

        const result = await db.query(
            `
            INSERT INTO schedule (date, start_time, end_time, task_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                date,
                start_time,      
                end_time,
                task_id 
            ]
        );

        res.status(201).json({
            message: "Schedule created successfully",
            task: result.rows[0]
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteSchedule= async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `
            DELETE FROM schedule
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.json({
            message: 'Schdule deleted successfully',
            task: result.rows[0]
        });

    } catch (err) {
        console.error('Delete schedule error:', err);
        res.status(500).json({ error: err.message });
    }
};


const updateSchedule = async (req, res) => {
    try {
            const { id } = req.params;
            const {
                date,
                start_time,
                end_time,
                task_id,
            } = req.body;

        // check id
        if (!id) {
            return res.status(400).json({ message: 'Schdule id is required' });
        }

        const result = await db.query(
            `
            UPDATE schedule
            SET
                date = COALESCE($1, date),
                start_time = COALESCE($2, start_time),
                end_time = COALESCE($3, end_time),
                task_id = COALESCE($4, task_id)
            WHERE id = $5
            RETURNING *
            `,
            [date, start_time, end_time, task_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error('Update schedule error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllSchedule,
    getScheduleById,
    getScheduleByDate,
    getScheduleBetweenDays,
    getScheduleByTask,
    addSchedule,
    updateSchedule,
    deleteSchedule
}