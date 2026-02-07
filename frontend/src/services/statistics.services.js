import axios from "@/services/axios.instance"
import {API_ROUTES, url} from "@/constant/constant";

class StatisticsServices {
  static async getStatistic(){
    const res = await axios.get(API_ROUTES.statistics.base);
    return res.data;
  }
}

export default StatisticsServices