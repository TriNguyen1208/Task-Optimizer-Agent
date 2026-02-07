import StatisticsServices from '#@/services/statistics.services.js'
import { StatusCodes } from 'http-status-codes'
import getUserId from '#@/utils/get_userid.js'

class StatisticsController {
    static getInstance(){
        if(!StatisticsController.instance){
            StatisticsController.instance = new StatisticsController()
        }
        return StatisticsController.instance
    }
    async getStatistics(req, res) {
        try {
            const user_id = getUserId(req)

            if (!user_id || isNaN(user_id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Invalid id'
            })}
            const data = await StatisticsServices.getStatistics(user_id)

            return res.status(StatusCodes.OK).json(data)
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
}
const instance = StatisticsController.getInstance()
export default instance