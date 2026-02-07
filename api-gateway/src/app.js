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

const app = express()

//Allow origin
const allowedOrigins = [
    'http://localhost:3000', //This is frontend calling
];
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

// =====================
// API Gateway middlewares
// =====================
// app.use(rateLimit) 
app.use(authenticateToken)      


//init routes
setupRoute(app)

//Error handler
app.use(errorHandler)

export default app