import 'dotenv/config'

const config_dev = {
  db: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
  app: {
    port: 3001,
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
    port: 3001,
  }
};

const config = {
    development: config_dev,
    production: config_pro
}
const env = process.env.NODE_ENV || 'production'
export default config[env]