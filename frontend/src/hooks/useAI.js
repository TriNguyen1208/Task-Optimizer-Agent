import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AIServices from "@/services/ai.services";
import {toast} from 'react-toastify'
import {STALE_10_MIN} from '@/constant/constant'

function useGetWorkingTime() {
    return useQuery({
        queryKey: ['working-time'],
        queryFn: AIServices.getWorkingTime,
        staleTime: STALE_10_MIN
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
    getWorkingTime: useGetWorkingTime,
    getSchedule: useGetSchedule
}