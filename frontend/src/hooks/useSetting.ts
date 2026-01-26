import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Setting } from "../@types/setting";
import SettingsServices from "../services/setting.services";
import {toast} from 'react-toastify'
import {STALE_10_MIN} from '@/src/constant/constant'
import SettingServices from "../services/setting.services";

class SettingHook {
    static useUpdateSetting() {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (setting: Setting) => SettingsServices.updateSetting(setting),
            onSuccess: (success: any) => {
                toast.success(success.message)
                queryClient.invalidateQueries({
                    queryKey: ['setting']
                })
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Error updating setting";
                toast.error(message);
            }
        })
    }

    static useGetSetting() {
        return useQuery({
            queryKey: ['setting'],
            queryFn: () => SettingServices.getSetting(),
            staleTime: STALE_10_MIN
        })
    }
}

export default SettingHook