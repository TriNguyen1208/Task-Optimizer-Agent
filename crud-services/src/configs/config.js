import 'dotenv/config'

const config_dev = {
  db: {
    user: 'admin',
    host: 'localhost',
    database: 'task_optimizer',
    password: 'admin123',
    port: 5678,
  },
  app: {
    port: 3000,
  }
};
const config_pro = {
  db: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
  app: {
    port: 3000,
  }
};

const config = {
    dev: config_dev,
    pro: config_pro
}
const env = process.env.NODE_ENV
export default config[env]