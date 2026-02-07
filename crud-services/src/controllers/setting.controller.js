import SettingServices from '#@/services/setting.services.js'
import { StatusCodes } from 'http-status-codes'
import getUserId from '#@/utils/get_userid.js'


class SettingController {
    static getInstance(){
        if(!SettingController.instance){
            SettingController.instance = new SettingController()
        }
        return SettingController.instance
    }
    async getSetting(req, res) {
        try {
            const user_id = getUserId(req)
            if (!user_id || isNaN(user_id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Invalid id'
            })}
            const data = await SettingServices.getSetting(user_id)

            return res.status(StatusCodes.OK).json(data)
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }

    async updateSetting(req, res) {
        try {
            const user_id = getUserId(req)
            if (!user_id || isNaN(user_id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Invalid id'
            })}

            const data = await SettingServices.updateSetting(user_id, req.body)

            return res.status(StatusCodes.OK).json({
                message: "Update setting successfully",
                data
            })
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
}
const instance = SettingController.getInstance()
export default instance