import axios from "axios";
import { Setting } from "../@types/setting";
import {url_manage} from "../constant/constant";

class SettingServices {
  static async updateSetting(setting){
    const res = await axios.patch(`${url_manage}/setting`, setting);
    return res.data;
  }

  static async getSetting(){
    const res = await axios.get(`${url_manage}/setting`);
    return res.data;
  }
}

export default SettingServices