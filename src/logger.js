import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: 'info',
  exitOnError: true,
  format: format.combine(
    format.json()
  ),
  transports: [
    new transports.Console()
  ]
})

logger.stream = {
  write: (message, encoding) => {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    if (process.env.NODE_ENV === 'production') {
      console.info(message, { logger: 'morgan' })
    } else {
      message = message.substring(0, message.lastIndexOf('\n'))
      console.info(message)
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  console.log = (...args) => logger.info(...args)
  console.info = (...args) => logger.info(...args)
  console.warn = (...args) => logger.warn(...args)
  console.error = (...args) => logger.error(...args)
}

export default logger
