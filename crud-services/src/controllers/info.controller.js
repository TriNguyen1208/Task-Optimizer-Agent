import InfoServices from '#@/services/info.services.js'
import { StatusCodes } from 'http-status-codes'
import getUserId from '#@/utils/get_userid.js'

class InfoController {
    static getInstance(){
        if(!InfoController.instance){
            InfoController.instance = new InfoController()
        }
        return InfoController.instance
    }
    async getInfo(req, res) {
        try {
            const user_id = getUserId(req)

            if (!user_id || isNaN(user_id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Invalid id'
            })}
            const data = await InfoServices.getInfo(user_id)

            return res.status(StatusCodes.OK).json(data)
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }

    async updateInfo(req, res) {
        try {
            const user_id = getUserId(req)
            if (!user_id || isNaN(user_id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Invalid id'
            })}
            
            const data = await InfoServices.updateInfo(user_id, req.body)

            return res.status(StatusCodes.OK).json({
                message: "Edit info successfully",
                data
            })
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
}
const instance = InfoController.getInstance()
export default instance