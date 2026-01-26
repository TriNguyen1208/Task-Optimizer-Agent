const taskController = require('../controllers/taskController');

module.exports = (router, adapt) => {
    const tasksApi = '/api/tasks'
    router.on('GET', tasksApi, adapt(taskController.getAllTasks));
    router.on('POST', tasksApi, adapt(taskController.addTask));
    router.on('GET', tasksApi + '/:id', adapt(taskController.getTask));   
    router.on('PATCH', tasksApi + '/:id', adapt(taskController.updateTask));
    router.on('DELETE', tasksApi + '/:id', adapt(taskController.deleteTask));
}
