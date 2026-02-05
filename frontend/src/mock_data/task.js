import { Task } from "../@types/task";

const mock_task_list = [
    {
      id: "1",
      name: 'Design System',
      description: 'Create a comprehensive design system with components',
      working_time: 8,
      deadline: new Date(),
      finished: true
    },
    {
      id: "2",
      name: 'API Integration',
      description: 'Integrate third-party APIs for data synchronization',
      working_time: 6.5,
      deadline: new Date(),
      finished: false
    },
    {
      id: "3",
      name: 'Testing Phase',
      description: 'Run comprehensive testing suite and fix bugs',
      working_time: 5,
      deadline: new Date(),
      finished: false
    },
]

export {mock_task_list}