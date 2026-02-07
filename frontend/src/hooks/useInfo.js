import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import InfoServices from "@/services/info.services";
import {toast} from 'react-toastify'
import {STALE_10_MIN} from '@/constant/constant'


function useUpdateInfo(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (info) => InfoServices.updateInfo(info),
        onSuccess: (success) => {
            toast.success(success.message)
            queryClient.invalidateQueries({
                queryKey: ['info']
            })
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "Error updating info";
            toast.error(message);
        }
    })
}
function useGetInfo() {
    return useQuery({
        queryKey: ['info'],
        queryFn: InfoServices.getInfo,
        staleTime: STALE_10_MIN
    })
}

export default {
    updateInfo: useUpdateInfo,
    getInfo: useGetInfo
}