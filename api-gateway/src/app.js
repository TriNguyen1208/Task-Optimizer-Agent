import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import 'dotenv/config'
import setupRoute from '#@/routes/index.js'
const app = express()


//Allow origin
const allowedOrigins = [
    // 'https://hoppscotch.io',
    'http://localhost:3000', //Này là frontend
    // 'http://localhost:3002',
    // 'http://127.0.0.1:3001',
    // 'http://127.0.0.1:3002',
    // 'http://171.244.139.18:3001',
    // 'http://171.244.139.18:3002',
    // // thêm domain khi deploy như:
    // 'https://thientruc.vn',
    // 'https://www.thientruc.vn',
    // 'https://admin.thientruc.vn',
    // 'https://api.thientruc.vn',
    // 'http://115.73.3.162:3001',
    // 'http://115.73.3.162:3002'
];
//init middleware
app.use(express())
app.use(helmet())
app.use(compression())
app.use(morgan())

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
//init routes
setupRoute(app)

export default app