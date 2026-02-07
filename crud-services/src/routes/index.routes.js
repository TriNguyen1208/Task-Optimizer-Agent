import scheduleRoutes from '#@/routes/schedule.routes.js'
import taskRoutes from '#@/routes/task.routes.js'
import infoRoutes from '#@/routes/info.routes.js'
import authRoutes from '#@/routes/auth.routes.js'
import settingRoute from '#@/routes/setting.routes.js'
import statisticsRoute from '#@/routes/statistics.routes.js'
const registerRouter = ((app) => {
    app.use('/schedule/', scheduleRoutes)
    app.use('/task/', taskRoutes)
    app.use('/info/', infoRoutes)
    app.use('/auth/', authRoutes)
    app.use('/setting/', settingRoute)
    app.use('/statistics/', statisticsRoute)
})
export default registerRouter