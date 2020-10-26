import { Router } from 'express'
import profiles from './profiles'
import events from './events'

export default ({ config, db }) => {
  const api = Router()

  api.use('/profiles', profiles({ config, db }))
  api.use('/events', events({ config, db }))

  return api
}
