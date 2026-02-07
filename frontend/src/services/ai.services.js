import axios from "@/services/axios.instance"
import {API_ROUTES} from "@/constant/constant";

async function getWorkingTime(){
    const res = await axios.get(API_ROUTES.ai.working_time);
    return res.data;
}
async function getSchedule(){
    const res = await axios.get(API_ROUTES.ai.schedule);
    return res.data;
}

export default {
    getWorkingTime,
    getSchedule,
};
