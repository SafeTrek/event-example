import uuid from 'uuid/v4'
import { Router } from 'express'
import { findProfileByDeviceId } from '../lib/profileService'
import { addEvent } from '../lib/eventService'

export default ({ config, db }) => {
  const router = Router({ mergeParams: true })

  router.post('/', async (req, res) => {
    const requestId = req.header('x-request-id') || uuid()
    const event = req.body
    try {
      const profile = await findProfileByDeviceId(db)(event.device_id)
      if (!profile) {
        return res.status(400).json({
          error: 'No profile found matching given device id'
        })
      }
      const result = await addEvent(config, db)(profile, event)
      return res.status(result.statusCode || 201).json((result.statusCode && result.body) || { success: true })
    } catch (error) {
      console.error(`uuid=${requestId} error=${error}`)
      return res.status(500).json({
        requestId
      })
    }
  })

  return router
}
