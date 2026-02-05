import axios from "axios";
import { Statistics } from "../@types/statistics";
import {url_manage} from "@/src/constant/constant";

class StatisticsServices {
  static async getStatistic(){
    const res = await axios.get(`${url_manage}/statistics`);
    return res.data;
  }
}

export default StatisticsServices