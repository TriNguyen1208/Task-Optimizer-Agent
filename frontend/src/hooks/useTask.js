import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import TaskServices from '@/services/task.services'
import {STALE_10_MIN} from '@/constant/constant'
import {toast} from 'react-toastify'


function useGetTaskHistory(){
    return useQuery({
        queryKey: ["task-history"],
        queryFn: () => TaskServices.getTaskHistory(),
        staleTime: STALE_10_MIN
    })
}

function useGetTask(){
    return useQuery({
        queryKey: ["task"],
        queryFn: () => TaskServices.getTask(),
        staleTime: STALE_10_MIN
    })
}

function useAddTask(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({task, isAutoSchedule}) => TaskServices.addTask(task, isAutoSchedule),
        onSuccess: (success) => {
            toast.success(success.message);
            queryClient.invalidateQueries({queryKey: ["task"]});
            queryClient.invalidateQueries({queryKey: ["task-name"]});
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "Error adding new task";
            toast.error(message);
        }
    });
}
function useUpdateTask(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (task) => TaskServices.updateTask(task),
        onSuccess: (success) => {
            toast.success(success.message);
            queryClient.invalidateQueries({queryKey: ["task"]});
            queryClient.invalidateQueries({queryKey: ["task-name"]});
            queryClient.invalidateQueries({queryKey: ["task-history"]});
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "Error adding new task";
            toast.error(message);
        }
    });
}

function useGetNameTask(){
    return useQuery({
        queryKey: ["task-name"],
        queryFn: () => TaskServices.getNameTask(),
        staleTime: STALE_10_MIN
    })
}
export default {
    getTaskHistory: useGetTaskHistory,
    getTask: useGetTask,
    updateTask: useUpdateTask,
    addTask: useAddTask,
    getTaskName: useGetNameTask
}