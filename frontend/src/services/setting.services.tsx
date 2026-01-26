import axios from "axios";
import { Setting } from "../@types/setting";
import {url_manage} from "../constant/constant";

class SettingServices {
  static async updateSetting(setting: Setting): Promise<Setting> {
    const res = await axios.patch<Setting>(`${url_manage}/setting`, setting);
    return res.data;
  }

  static async getSetting(): Promise<Setting> {
    const res = await axios.get<Setting>(`${url_manage}/setting`);
    return res.data;
  }
}

export default SettingServices