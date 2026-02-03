import db from '#@/db/init.db.js'

class ScheduleServices{
    static getInstance(){
        if(!ScheduleServices.instance){
            ScheduleServices.instance = new ScheduleServices()
        }
        return ScheduleServices.instance
    }
    async getSchedule(req){
        const {
            date,
            from_date,
            to_date,
            task_id,
        } = req.query

        if(date){
            return await this.getScheduleByDate(date)
        }
        else if(from_date && to_date){
            return await this.getScheduleBetweenDays(from_date, to_date)
        }
        else if(task_id){
            return await this.getScheduleByTask(task_id)
        }
        else{
            return await this.getAllSchedules()
        }
    }

    async getAllSchedules() {
        const queryText = `
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN tasks t ON s.task_id = t.id
            ORDER BY s.id ASC;
        `;
        
        const { rows } = await db.query(queryText);
        return rows[0]; 
    }
    async getScheduleByID(id){
        const queryText = `
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN tasks t ON s.task_id = t.id
            WHERE s.id = $1
        `
        const { rows } = await db.query(queryText, [id])
        if(rows.length == 0){
            throw new Error("Not existed this id")
        }
        return rows[0]
    }
    async getScheduleByDate(date){
        const queryText = `
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN tasks t ON s.task_id = t.id
            WHERE s.date = $1   
        `
        const {rows} = await db.query(queryText, [date])
        return rows[0]
    }
    async getScheduleBetweenDays(from_date, to_date){
        const queryText = `
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN tasks t ON s.task_id = t.id
            WHERE s.date >= $1 AND s.date < $2
        `
        const {rows} = await db.query(queryText, [from_date, to_date])
        return rows[0]
    }
    async getScheduleByTask(task_id){
        const queryText =  `
            SELECT * FROM schedule WHERE task_id = $1
        `
        const {rows} = await db.query(queryText, [task_id])
        return rows[0]
    }
    async createSchedule(
        date,
        start_time,
        end_time,
        task_id,
    ){  
        const queryText = `
            INSERT INTO schedule (date, start_time, end_time, task_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `
        const {rows} = await db.query(queryText, [
            date,
            start_time, 
            end_time, 
            task_id
        ])

        return rows[0]
    }
    async deleteSchedule(id){
        const queryText = `
            DELETE FROM schedule
            WHERE id = $1
            RETURNING *
        `
        const {rows} = await db.query(queryText, [id])
        
        if(rows.length == 0){
            throw new Error("Schedule not found")
        }
        return rows[0]
    }

    async updateSchedule(
        date,
        start_time,
        end_time,
        task_id,
        id
    ){
        if (!id) {
            throw new Error("Missing id")
        }
        const queryText = `
            UPDATE schedule
            SET
                date = COALESCE($1, date),
                start_time = COALESCE($2, start_time),
                end_time = COALESCE($3, end_time),
                task_id = COALESCE($4, task_id)
            WHERE id = $5
            RETURNING *
        `
        const {rows} = await db.query(queryText, [
            date, 
            start_time, 
            end_time, 
            task_id, 
            id
        ])
        if(rows.length == 0){
            throw new Error("Schedule not found")
        }
        return rows[0]
    }
}
const instance = ScheduleServices.getInstance()

export default instance