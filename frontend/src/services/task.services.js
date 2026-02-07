import axios from "@/services/axios.instance"
import {API_ROUTES, url} from "@/constant/constant";

class TaskServices {
  static async addTask(task, isAutoSchedule) {
      // 1. Tạo task mới
      const res = await axios.post(API_ROUTES.task.base, task);
      const newTask = res.data; 

      if (isAutoSchedule){
        const schedules = await axios.get(API_ROUTES.ai.schedule(newTask.task.id));
        const scheduleList = schedules.data;
        await Promise.all(
            scheduleList.map(item => axios.post(API_ROUTES.schedule.base, item))
        );
      }
      
      return newTask; 
  }

  static async updateTask(task){
    const res = await axios.patch(API_ROUTES.task.base_id(task.id), task);
    return res.data;
  }

  static async getTask(){
    const res = await axios.get(API_ROUTES.task.base)
    return res.data;
  }

  static async getTaskHistory(){
    const res = await axios.get(API_ROUTES.task.task_history)
    return res.data;
  }

  static async getNameTask(){
    const res = await axios.get(API_ROUTES.task.task_name)
    return res.data;
  }
}

export default TaskServices