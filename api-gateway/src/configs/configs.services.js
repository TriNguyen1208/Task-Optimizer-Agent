import 'dotenv/config'

const services_dev = {
    ai: {
        url: process.env.AI_SERVICES_DEV || 'http://localhost:3002'
    },
    crud: {
        url: process.env.CRUD_SERVICES_DEV || 'http://localhost:3001'
    }
}

const services_pro = {
    ai: {
        url: process.env.AI_SERVICES_PRO || 'http://localhost:3002'
    },
    crud: {
        url: process.env.CRUD_SERVICES_PRO || 'http://localhost:3001'
    }
}

const services = {
    development: services_dev, 
    production: services_pro
}
const env = process.env.NODE_ENV || 'development'

export default services[env]