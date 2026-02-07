import axios from "@/services/axios.instance"
import {API_ROUTES, url} from "@/constant/constant";

class ScheduleServices {
  static async addSchedule(schedule) {
    const res = await axios.post(API_ROUTES.schedule.base, schedule);
    return res.data;
  }

  static async updateSchedule(schedule){
    const res = await axios.patch(API_ROUTES.schedule.base_id(schedule.id), schedule);
    return res.data;
  }

  static async getAllSchedule(){
    const res = await axios.get(API_ROUTES.schedule.base)
    return res.data;
  }

  static async deleteSchedule(id){
    const res = await axios.delete(API_ROUTES.schedule.base_id(id))
    return res.data;
  }
}

export default ScheduleServices