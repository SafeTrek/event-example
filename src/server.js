import logger from './logger'
import http from 'http'
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import uuid from 'uuid/v4'
import { getStatusText, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST } from 'http-status-codes'
import initializeDb from './db'
import config from './config'
import index from './index'

const app = express()
app.server = http.createServer(app)

// logger

app.use(morgan('method=:method url=:url status=:status latency=:response-time tls_version=:http-version user_agent=":user-agent"', {
  stream: logger.stream
}))

// 3rd party middleware

app.use(bodyParser.json({
  limit: config.bodyLimit
}))

initializeDb(config, (db) => {
  app.use('/example', index({ config, db }))

  app.server.listen(config.port, () => {
    console.info(`Started on port ${app.server.address().port}`)
  })

  app.use((req, res, next) =>
    res.status(NOT_FOUND).json({
      code: NOT_FOUND,
      message: getStatusText(NOT_FOUND),
      details: 'No endpoint found at this URL'
    })
  )

  app.use((error, req, res, next) => {
    if (error) {
      const requestId = req.header('x-request-id') || uuid()
      console.error(`uuid=${requestId} error=${error}`)
      if (error instanceof SyntaxError) {
        res.status(BAD_REQUEST).send({
          code: BAD_REQUEST,
          message: getStatusText(BAD_REQUEST),
          details: 'Malformed JSON body provided'
        })
      } else {
        res.status(INTERNAL_SERVER_ERROR).json({
          code: INTERNAL_SERVER_ERROR,
          message: getStatusText(INTERNAL_SERVER_ERROR),
          details: 'An unknown error has occurred.'
        })
      }
    }
  })
})

export default app
