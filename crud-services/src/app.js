import express, { Router } from 'express'
import morgan from 'morgan'
import compression from 'compression'
import registerRouter from '#@/routes/index.routes.js'

//init middleware
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(compression())

//init database

//init routes
registerRouter(app)

export default app