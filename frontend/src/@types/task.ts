export interface Task {
    id: string, 
    name: string,
    description: string | null, 
    working_time: number,
    deadline: Date,
    finished: boolean,
};