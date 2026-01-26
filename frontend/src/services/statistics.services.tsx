import axios from "axios";
import { Statistics } from "../@types/statistics";
import {url_manage} from "@/src/constant/constant";

class StatisticsServices {
  static async getStatistic(): Promise<Statistics> {
    const res = await axios.get<Statistics>(`${url_manage}/statistics`);
    return res.data;
  }
}

export default StatisticsServices