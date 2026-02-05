import axios from "axios";
import { Task } from "../@types/task";
import {url_manage} from "@/src/constant/constant";

class TaskServices {
  static async addTask(task) {
    const res = await axios.post(`${url_manage}/task`, task);
    return res.data;
  }

  static async updateTask(task){
    const res = await axios.patch(`${url_manage}/task/${task.id}`, task);
    return res.data;
  }

  static async getTaskList(){
    const res = await axios.get(`${url_manage}/tasks`);
    return res.data;
  }

  static async getTask(){
    const res = await axios.get(`${url_manage}/task`)
    return res.data;
  }
}

export default TaskServices