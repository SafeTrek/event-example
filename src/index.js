import { Router } from 'express'
import api from './api'

export default ({ config, db }) => {
  const app = Router()

  app.use('/v1', api({ config, db }))

  return app
}
