import db from '#@/db/init.db.js'

class TaskServices{
    static getInstance(){
        if (!TaskServices.instance){
            TaskServices.instance = new TaskServices()
        }
        return TaskServices.instance
    }
    async getTask(req){
        return await this.getAllTasks()
    }   
    async getAllTasks(){
        const queryText = `
            SELECT * FROM tasks ORDER BY id ASC
        `
        const {rows} = await db.query(queryText)
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
        finished
    ){
        const queryText = `
            INSERT INTO tasks (name, description, deadline, working_time, finished)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `
        const {rows} = await db.query(queryText, [
            name, 
            description || "",
            deadline,
            working_time,
            finished
        ])
        return rows[0]
    }

    async updateTask(
        id,
        name,
        description,
        deadline,
        working_time,
        finished
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
            WHERE id = $6
            RETURNING *
        `
        const {rows} = await db.query(queryText, [
            name,
            description,
            deadline,
            working_time,
            finished,
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