import services from '#@/services/info.services.js'
import {StatusCodes} from 'http-status-codes'

class InfoController{
    static getInstance(){
        if(!InfoController.instance){
            InfoController.instance = new InfoController()
        }
        return InfoController.instance
    }
    async getInfo(req, res){
        const {id} = req.params
        const data = await services.getInfo(id)
        return res.status(StatusCodes.OK).json({
            "messages": "Get user's info by id successfully",
            data
        })
    }
    async editInfo(req, res){
        const info = await services.editInfo(req)
        return res.status(StatusCodes.OK).json({
            "messages": "Edit info successfully",
            info
        })
    }
    async deleteInfo(req, res){
        const {id} = req.params
        const info = await services.deleteInfo(id)
        return res.status(StatusCodes.OK).json({
            "messages": "Deleted info successfully",
            info
        })
    }
}

const instance = InfoController.getInstance()
export default instance