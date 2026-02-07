import express, { Router } from 'express'
import morgan from 'morgan'
import compression from 'compression'
import registerRouter from '#@/routes/index.routes.js'
import helmet from 'helmet'
import cors from 'cors'
import {errorHandler} from '#@/middleware/error.middleware.js'
import cookieParser from 'cookie-parser'

//init middleware
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// =====================
// Security & optimization
// =====================
app.use(helmet())
app.use(compression())
app.use(cookieParser())
// =====================
// Logging
// =====================
app.use(morgan('dev'))

// =====================
// CORS
// =====================
const allowedOrigins = [
    'http://localhost:8080', //This is api-gateway calling
    'http://localhost:3002' //This is ai-services calling
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server / curl / same-origin
    if (!origin) {
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// RẤT QUAN TRỌNG
app.options(/.*/, cors())

//init routes
registerRouter(app)

//Error handler
app.use(errorHandler)

export default app