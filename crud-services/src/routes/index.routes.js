import scheduleRoutes from '#@/routes/schedule.routes.js'
import taskRoutes from '#@/routes/task.routes.js'
import infoRoutes from '#@/routes/info.routes.js'

const registerRouter = ((app) => {
    app.use('/api/schedule/', scheduleRoutes)
    app.use('/api/task/', taskRoutes)
    app.use('api/info/', infoRoutes)
})
export default registerRouter