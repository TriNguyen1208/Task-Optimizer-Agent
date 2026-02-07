import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AIServices from "@/services/ai.services";
import {toast} from 'react-toastify'
import {STALE_10_MIN} from '@/constant/constant'

function usePostWorkingTime(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data) => AIServices.postWorkingTime(data),
    })
}

function useGetSchedule() {
    return useQuery({
        queryKey: ['ai-schedules'],
        queryFn: AIServices.getSchedule,
        staleTime: STALE_10_MIN
    })
}

export default {
    postWorkingTime: usePostWorkingTime,
    getSchedule: useGetSchedule
}