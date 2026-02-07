import axios from "@/services/axios.instance"
import {API_ROUTES} from "@/constant/constant";

async function postWorkingTime(data)
{
    //Data ở đây có name và description
    const res = await axios.post(API_ROUTES.ai.working_time, data);
    return res.data;
}
async function getSchedule(){
    const res = await axios.get(API_ROUTES.ai.schedule);
    return res.data;
}

export default {
    postWorkingTime,
    getSchedule,
};
