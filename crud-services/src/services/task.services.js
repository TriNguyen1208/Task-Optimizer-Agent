import db from '#@/db/init.db.js'

class TaskServices{
    static getInstance(){
        if (!TaskServices.instance){
            TaskServices.instance = new TaskServices()
        }
        return TaskServices.instance
    }
    async getTask(user_id){
        return await this.getAllTasks(user_id)
    }
    async getTaskHistory(user_id){
        const queryText = `
            SELECT * 
            FROM task
            WHERE user_id = $1 AND finished = TRUE
        `
        const {rows} = await db.query(queryText, [user_id])
        return rows
    }
    async getAllTasks(user_id){
        const queryText = `
            SELECT * 
            FROM task 
            WHERE user_id = $1 AND finished = FALSE
            ORDER BY id ASC
        `
        const {rows} = await db.query(queryText, [user_id])
        return rows
    }
    async getTaskName(user_id){
        const queryText = `
            SELECT DISTINCT name 
            FROM task 
            WHERE user_id = $1 AND finished = FALSE
        `
        const {rows} = await db.query(queryText, [user_id])
        return rows.map(row => row.name);
    }
    async getTaskByID(user_id, id){
        const queryText = `
            SELECT * 
            FROM task 
            WHERE id = $1 and user_id = $2
        `
        const {rows} = await db.query(queryText, [id, user_id])
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
            INSERT INTO task (name, description, deadline, working_time, finished, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `
        const {rows} = await db.query(queryText, [
            name, 
            description || "",
            deadline,
            working_time,
            finished || false,
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
            UPDATE task
            SET
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                deadline = COALESCE($3, deadline),
                working_time = COALESCE($4, working_time),
                finished = COALESCE($5, finished)
            WHERE user_id = $6 AND id = $7
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
    async deleteTask(user_id, id){
        const queryText = `
            DELETE FROM task
            WHERE id = $1 and user_id = $2
            RETURNING *
        `

        const {rows} = await db.query(queryText, [id, user_id])
        if(rows.length == 0){
            throw new Error("Can't delete task")
        }
        return rows[0]
    }
}

const instance = TaskServices.getInstance()
export default instance