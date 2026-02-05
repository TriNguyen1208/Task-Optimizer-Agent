import db from '#@/db/init.db.js'

class TaskServices{
    static getInstance(){
        if (!TaskServices.instance){
            TaskServices.instance = new TaskServices()
        }
        return TaskServices.instance
    }
    async getTask(req){
        const {user_id} = req.params
        return await this.getAllTasks(user_id)
    }   
    async getAllTasks(){
        const queryText = `
            SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC
        `
        const {rows} = await db.query(queryText, [user_id])
        return rows[0]
    }
    async getTaskByID(id){
        const queryText = `
            SELECT * FROM tasks WHERE id = $1
        `
        const {rows} = await db.query(queryText, [id])
        return rows[0]
    }
    async createTask(
        name,
        description,
        deadline,
        working_time,
        finished,
        user_id
    ){
        const queryText = `
            INSERT INTO tasks (name, description, deadline, working_time, finished, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `
        const {rows} = await db.query(queryText, [
            name, 
            description || "",
            deadline,
            working_time,
            finished,
            user_id
        ])
        return rows[0]
    }

    async updateTask(
        id,
        name,
        description,
        deadline,
        working_time,
        finished,
        user_id
    ){
        if (!id) {
            return res.status(400).json({ message: 'Task id is required' });
        }
        const queryText = `
            UPDATE tasks
            SET
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                deadline = COALESCE($3, deadline),
                working_time = COALESCE($4, working_time),
                finished = COALESCE($5, finished)
                user_id = COALESCE($6, user_id)
            WHERE id = $7
            RETURNING *
        `
        const {rows} = await db.query(queryText, [
            name,
            description,
            deadline,
            working_time,
            finished,
            user_id,
            id
        ])
        if(rows.length == 0){
            throw new Error("Can't find task by id")
        }
        return rows[0]
    }   
    async deleteTask(id){
        const queryText = `
            DELETE FROM tasks
            WHERE id = $1
            RETURNING *
        `

        const {rows} = await db.query(queryText, [id])
        if(rows.length == 0){
            throw new Error("Can't delete task")
        }
        return rows[0]
    }
}

const instance = TaskServices.getInstance()
export default instance