const db = require('../db');

const getAllTasks = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tasks ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getTask = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addTask = async (req, res) => {
    try {
        const {
            name,
            description,
            deadline,
            working_time,
            finished
        } = req.body;

        // if (!name) {
        //     return res.status(400).json({ message: "name is required" });
        // }

        const result = await db.query(
            `
            INSERT INTO tasks (name, description, deadline, working_time, finished)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                name,
                description || null,
                deadline || null,        // có thể là string hoặc Date
                working_time || null,
                finished ?? false        // nullish coalescing
            ]
        );

        res.status(201).json({
            message: "Task created successfully",
            task: result.rows[0]
        });

    } catch (error) {
        console.error("postTask error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateTask = async (req, res) => {
    try {
            const { id } = req.params;
            const {
                name,
                description,
                deadline,
                working_time,
                finished
            } = req.body;

        // check id
        if (!id) {
            return res.status(400).json({ message: 'Task id is required' });
        }

        const result = await db.query(
            `
            UPDATE tasks
            SET
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                deadline = COALESCE($3, deadline),
                working_time = COALESCE($4, working_time),
                finished = COALESCE($5, finished)
            WHERE id = $6
            RETURNING *
            `,
            [
                name ?? null,
                description ?? null,
                deadline ?? null,
                working_time ?? null,
                finished ?? null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error('updateTask error:', err);
        res.status(500).json({ error: err.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `
            DELETE FROM tasks
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({
            message: 'Task deleted successfully',
            task: result.rows[0]
        });

    } catch (err) {
        console.error('deleteTask error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllTasks,
    getTask,
    addTask,
    updateTask,
    deleteTask
};