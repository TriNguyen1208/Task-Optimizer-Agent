import db from '#@/db/init.db.js'

class SettingServices{
    static getInstance(){
        if (!SettingServices.instance){
            SettingServices.instance = new SettingServices()
        }
        return SettingServices.instance
    }
    async getSetting(user_id){
        const queryText = `
            SELECT s.*
            FROM setting s
            WHERE s.user_id = $1
        `
        const { rows } = await db.query(queryText, [user_id])
        if(rows.length == 0){
            throw new Error("Not existed this id")
        }
        return rows[0]
    }
    async updateSetting(user_id, updateSetting)
    {
        const {
            dark_mode,
            activate,
            auto_schedule,
            notifications,
        } = updateSetting

        const queryText = `
            UPDATE setting
            SET
                dark_mode = COALESCE($1, dark_mode),
                activate = COALESCE($2, activate),
                auto_schedule = COALESCE($3, auto_schedule),
                notifications = COALESCE($4, notifications)
            WHERE user_id = $5
            RETURNING *
        `

        const { rows } = await db.query(queryText, [
            dark_mode, activate, auto_schedule, notifications, user_id
        ])

        if (rows.length == 0){
            throw new Error("Update setting fail")
        }

        return rows[0]
    }
}

const instance = SettingServices.getInstance()
export default instance