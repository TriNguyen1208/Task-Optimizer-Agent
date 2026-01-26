import axios from "axios";
import { Task } from "../@types/task";
import {url_manage} from "@/src/constant/constant";

class TaskServices {
  static async addTask(task: Task): Promise<Task> {
    const res = await axios.post<Task>(`${url_manage}/task`, task);
    return res.data;
  }

  static async updateTask(task: Task): Promise<Task> {
    const res = await axios.patch<Task>(`${url_manage}/task/${task.id}`, task);
    return res.data;
  }

  static async getTaskList(): Promise<Task[]> {
    const res = await axios.get<Task[]>(`${url_manage}/tasks`);
    return res.data;
  }

  static async getTask(): Promise<Task>{
    const res = await axios.get<Task>(`${url_manage}/task`)
    return res.data;
  }
}

export default TaskServices