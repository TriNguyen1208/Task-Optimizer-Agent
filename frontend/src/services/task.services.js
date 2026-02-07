import axios from "@/services/axios.instance"
import {API_ROUTES, url} from "@/constant/constant";

class TaskServices {
  static async addTask(task) {
    const res = await axios.post(API_ROUTES.task.base, task);
    return res.data;
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