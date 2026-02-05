import db from '#@/db/init.db.js'

class InfoServices{
    static getInstance(){
        if (!InfoServices.instance){
            InfoServices.instance = new InfoServices()
        }
        return InfoServices.instance
    }
    async getInfo(id){
        const queryText = `
            SELECT i.*
            FROM user_info i
            WHERE i.id = $1    
        `

        const { rows } = await db.query(queryText, [id])
        if(rows.length == 0){
            throw new Error("Not existed this id")
        }
        return rows[0]
    }
    async editInfo(req)
    {
        const { id } = req.params
        const {
            name,
            age,
            domain,
            role,
            level,
            habits,
            busy_time,
            working_hours_per_day,
            peak_working_hours,
            more_info
        } = req.query

        const queryText = `
            UPDATE user_info
            SET
                name = COALESCE($1, name),
                age = COALESCE($2, age),
                domain = COALESCE($3, domain),
                role = COALESCE($4, role),
                level = COALESCE($5, level),
                habits = COALESCE($6, habits),
                busy_time = COALESCE($7, busy_time),
                working_hours_per_day = COALESCE($8, working_hours_per_day),
                peak_working_hours = COALESCE($9, peak_working_hours),
                more_info = COALESCE($10, more_info)
            WHERE id = $11
            RETURNING *
        `

        const { rows } = await db.query(queryText, [
            name, age, domain, role, level, habits, busy_time, working_hours_per_day,
            peak_working_hours, more_info, id
        ])

        if (rows.length == 0){
            throw new Error("User's information not found")
        }

        return rows[0]
    }
    async deleteInfo(id)
    {
        const queryText = `
            DELETE FROM user_info
            WHERE id = $1
            RETURNING *
        `

        const { rows } = await db.query(queryText, [id])
        
        if (rows.length == 0){
            throw new Error("User's information not found")
        }
        return rows[0]
    }
}

const instance = InfoServices.getInstance()
export default instance