import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import TaskServices from '@/src/services/task.services'
import { Task } from '../@types/task'
import {STALE_10_MIN} from '@/src/constant/constant'
import {toast} from 'react-toastify'

class TaskHook {
    static useAddTask(){
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (task: Task) => TaskServices.addTask(task),
            onSuccess: (success: any) => {
                toast.success(success.message);
                    queryClient.invalidateQueries({
                        queryKey: ["task-list"],
                });
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Error adding new task";
                toast.error(message);
            }
        });
    }

    static useGetTaskList(){
        return useQuery({
            queryKey: ['task-list'],
            queryFn: () => TaskServices.getTaskList(),
            staleTime: STALE_10_MIN
        });
    }

    static useGetTask() {
        return useQuery({
            queryKey: ['task'],
            queryFn: () => TaskServices
        })
    }
    static useUpdateTask(){
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: (task: Task) => TaskServices.updateTask(task),
            onSuccess: (success: any) => {
                toast.success(success.message);
                    queryClient.invalidateQueries({
                        queryKey: ["task-list"],
                });
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Error updating task";
                toast.error(message);
            }
        });
    }
}

export default TaskHook