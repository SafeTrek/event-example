import dotenv from 'dotenv'
dotenv.config()

module.exports = {
  bodyLimit: '1mb',
  mongoPoolSize: (process.env.MONGO_POOL_SIZE && parseInt(process.env.MONGO_POOL_SIZE, 10)) || 10,
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
  port: process.env.PORT || 8081,
  noonlight: {
    dispatch: {
      api: process.env.NOONLIGHT_API_URL || 'https://api-sandbox.noonlight.com/dispatch',
      auth: {
        bearer: process.env.NOONLIGHT_SERVER_TOKEN
      }
    }
  }
}
