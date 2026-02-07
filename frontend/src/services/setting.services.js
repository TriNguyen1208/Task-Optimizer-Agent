import axios from "@/services/axios.instance"
import {API_ROUTES} from "@/constant/constant";

class SettingServices {
  static async updateSetting(setting){
    const res = await axios.patch(API_ROUTES.setting.base, setting);
    return res.data;
  }

  static async getSetting(){
    const res = await axios.get(API_ROUTES.setting.base);
    return res.data;
  }
}

export default SettingServices