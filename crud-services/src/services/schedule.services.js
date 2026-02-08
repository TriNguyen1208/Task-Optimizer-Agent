import db from '#@/db/init.db.js'

class ScheduleServices{
    static getInstance(){
        if(!ScheduleServices.instance){
            ScheduleServices.instance = new ScheduleServices()
        }
        return ScheduleServices.instance
    }
    async getSchedule(user_id, req){
        const {
            date,
            from_date,
            to_date,
            task_id,
        } = req.query
        if(date){
            return await this.getScheduleByDate(user_id, date)
        }
        else if(from_date && to_date){
            return await this.getScheduleBetweenDays(user_id, from_date, to_date)
        }
        else if(task_id){
            return await this.getScheduleByTask(user_id, task_id)
        }
        else{
            return await this.getAllSchedules(user_id)
        }
    }

    async getAllSchedules(user_id) {
        const queryText = `
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name,
                t.description,
                t.finished
            FROM schedule s
            JOIN task t ON s.task_id = t.id
            WHERE s.user_id = $1 
            AND t.finished = FALSE 
        `;
            
        const { rows } = await db.query(queryText, [user_id]);
        return rows; 
    }
    async getScheduleByID(user_id, id){
        const queryText = `
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN task t ON s.task_id = t.id
            WHERE s.user_id = $1 AND s.id = $2
        `
        const { rows } = await db.query(queryText, [user_id, id])
        if(rows.length == 0){
            throw new Error("Not existed this id")
        }
        return rows[0]
    }
    async getScheduleByDate(user_id, date){
        const queryText = `
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN task t ON s.task_id = t.id
            WHERE s.user_id = $1 AND s.date = $2
        `
        const {rows} = await db.query(queryText, [user_id, date])
        return rows
    }
    async getScheduleBetweenDays(user_id, from_date, to_date){
        const queryText = `
            SELECT
                s.id,
                s.date,
                s.start_time,
                s.end_time,
                t.name AS task_name
            FROM schedule s
            JOIN task t ON s.task_id = t.id
            WHERE s.user_id = $1 AND s.date >= $2 AND s.date < $3
        `
        const {rows} = await db.query(queryText, [user_id, from_date, to_date])
        return rows
    }
    async getScheduleByTask(user_id, task_id){
        const queryText =  `
            SELECT * 
            FROM schedule 
            WHERE user_id = $1 AND task_id = $2
        `
        const {rows} = await db.query(queryText, [user_id, task_id])
        return rows
    }
    
    async createSchedule(
        date, start_time, end_time, task_id, task_name, user_id 
    ) {
        let finalTaskId = task_id;

        if (!finalTaskId && task_name) {
            const queryTextGetID = `
                SELECT id
                FROM task
                WHERE name = $1 AND user_id = $2
                LIMIT 1
            `;
            const { rows: taskRows } = await db.query(queryTextGetID, [task_name, user_id]);

            if (taskRows.length === 0) {
                throw new Error(`Task với tên "${task_name}" không tồn tại.`);
            }
            finalTaskId = taskRows[0].id;
        }

        if (!finalTaskId) {
            throw new Error("Cần cung cấp ít nhất task_id hoặc task_name.");
        }

        const queryText = `
            INSERT INTO schedule (date, start_time, end_time, task_id, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const { rows } = await db.query(queryText, [
            date,
            start_time,
            end_time,
            finalTaskId,
            user_id
        ]);

        return rows[0];
    }
    async deleteSchedule(user_id, id){
        const queryText = `
            DELETE FROM schedule
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `
        const {rows} = await db.query(queryText, [id, user_id])
        
        if(rows.length == 0){
            throw new Error("Schedule not found")
        }
        return rows[0]
    }

    async updateSchedule(
        schedule_id, 
        date, 
        start_time, 
        end_time, 
        task_id, 
        task_name, 
        user_id 
    ) {
        if (!schedule_id) throw new Error("Missing schedule_id");

        let finalTaskId = task_id;

        if (!finalTaskId && task_name) {
            const queryTextGetID = `
                SELECT id FROM task
                WHERE name = $1 AND user_id = $2
                LIMIT 1
            `;
            const { rows: taskRows } = await db.query(queryTextGetID, [task_name, user_id]);

            if (taskRows.length > 0) {
                finalTaskId = taskRows[0].id;
            }
        }

        const queryText = `
            UPDATE schedule
            SET
                date = COALESCE($1, date),
                start_time = COALESCE($2, start_time),
                end_time = COALESCE($3, end_time),
                task_id = COALESCE($4, task_id)
            WHERE user_id = $5 AND id = $6
            RETURNING *
        `;
        
        const { rows } = await db.query(queryText, [
            date || null,     
            start_time || null,
            end_time || null,
            finalTaskId || null,
            user_id,
            schedule_id
        ]);

        if (rows.length === 0) {
            throw new Error("Không tìm thấy lịch trình hoặc bạn không có quyền sửa.");
        }

        return rows[0];
    }
}
const instance = ScheduleServices.getInstance()

export default instance