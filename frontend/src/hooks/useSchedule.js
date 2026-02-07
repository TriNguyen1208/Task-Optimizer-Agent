import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import ScheduleServices from '@/services/schedule.services'
import {STALE_10_MIN} from '@/constant/constant'
import {toast} from 'react-toastify'


function useGetAllSchedule(){
    return useQuery({
        queryKey: ["schedules"],
        queryFn: ScheduleServices.getAllSchedule,
        staleTime: STALE_10_MIN
    })
}

function useDeleteSchedule(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id) => ScheduleServices.deleteSchedule(id),
        onSuccess: (success) => {
            toast.success(success.message);
            queryClient.invalidateQueries({queryKey: ["schedules"]});
            queryClient.invalidateQueries({queryKey: ["task"]});
            queryClient.invalidateQueries({queryKey: ["task-name"]});
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "Error adding new schedules";
            toast.error(message);
        }
    });
}

function useAddSchedule(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (schedule, isAutoSchedule) => ScheduleServices.addSchedule(schedule),
        onSuccess: (success) => {
            toast.success(success.message);
            queryClient.invalidateQueries({queryKey: ["schedules"]});
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "Error adding new schedules";
            toast.error(message);
        }
    });
}

function useUpdateSchedule(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (schedule) => ScheduleServices.updateSchedule(schedule),
        onSuccess: (success) => {
            toast.success(success.message);
            queryClient.invalidateQueries({queryKey: ["schedules"]});
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "Error adding new task";
            toast.error(message);
        }
    });
}

export default {
    getAllSchedule: useGetAllSchedule,
    deleteSchedule: useDeleteSchedule,
    addSchedule: useAddSchedule,
    updateSchedule: useUpdateSchedule
}