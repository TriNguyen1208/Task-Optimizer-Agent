const scheduleController = require('../controllers/scheduleController');

module.exports = (router, adapt) => {
    const scheduleApi = '/api/schedule'
    router.on('GET', scheduleApi, adapt(scheduleController.getAllSchedule));
    router.on('GET', scheduleApi + '/by-id/:id', adapt(scheduleController.getScheduleById));
    router.on('GET', scheduleApi + '/by-date/:date', adapt(scheduleController.getScheduleByDate));
    router.on('GET', scheduleApi + '/between-dates/', adapt(scheduleController.getScheduleBetweenDays));
    router.on('GET', scheduleApi + '/by-task/:task_id', adapt(scheduleController.getScheduleByTask));

    router.on('POST', scheduleApi, adapt(scheduleController.addSchedule));
    router.on('PATCH', scheduleApi + '/:id', adapt(scheduleController.updateSchedule));
    router.on('DELETE', scheduleApi + '/:id', adapt(scheduleController.deleteSchedule));
}
