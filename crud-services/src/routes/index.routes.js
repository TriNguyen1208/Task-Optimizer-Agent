import scheduleRoutes from '#@/routes/schedule.routes.js'
import taskRoutes from '#@/routes/task.routes.js'

const registerRouter = ((app) => {
    app.use('/api/schedule/', scheduleRoutes)
    app.use('/api/task/', taskRoutes)
})
export default registerRouter