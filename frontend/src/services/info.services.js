import axios from "@/services/axios.instance"
import {url, API_ROUTES} from "@/constant/constant";

async function getInfo(){
    const res = await axios.get(API_ROUTES.info.base);
    return res.data;
}
async function updateInfo(info){
    const res = await axios.patch(API_ROUTES.info.base, info);
    return res.data;
}

export default {
    getInfo,
    updateInfo,
};
