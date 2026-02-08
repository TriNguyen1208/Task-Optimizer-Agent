import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import setupRoute from '#@/routes/index.js'
import errorHandler from '#@/middleware/errorhandler.middleware.js'
import rateLimit from '#@/middleware/ratelimit.middleware.js'
import {authenticateToken} from '#@/middleware/auth.middleware.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import 'dotenv/config'

const app = express()


//init middleware

// =====================
// Parse request
// =====================
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

//Allow origin
const allowedOrigins = [
    process.env.FRONTEND_DEV,
    process.env.FRONTEND_PRO
];

app.use(cors({
  origin: (origin, callback) => {
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

app.options(/.*/, cors())

// =====================
// API Gateway middlewares
// =====================
app.use(rateLimit) 
app.use(authenticateToken)      


//init routes
setupRoute(app)

//Error handler
app.use(errorHandler)

export default app