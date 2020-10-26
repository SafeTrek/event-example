import uuid from 'uuid/v4'
import { Router } from 'express'
import { createProfile, createDevices, findProfile } from '../lib/profileService'
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR } from 'http-status-codes'
import { cancelAlarm } from '../lib/alarms'

export default ({ config, db }) => {
  const router = Router({ mergeParams: true })

  router.post('/', async (req, res) => {
    const requestId = req.header('x-request-id') || uuid()
    const profile = req.body
    try {
      const result = await createProfile(db)(profile)
      return res.status(CREATED).json(result)
    } catch (error) {
      console.error(`uuid=${requestId} error=${error}`)
      return res.status(INTERNAL_SERVER_ERROR).json({
        requestId
      })
    }
  })

  router.put('/:profileId/alarms', async (req, res) => {
    const requestId = req.header('x-request-id') || uuid()
    const { profileId } = req.params
    const { pin } = req.body
    try {
      const profile = await findProfile(db)(profileId)
      if (!profile) {
        return res.status(BAD_REQUEST).json({
          error: 'No profile found matching given profile id'
        })
      }
      const result = await cancelAlarm(config)(profile, pin)
      return res.status(result.statusCode || CREATED).json((result.statusCode && result.body) || { success: true })
    } catch (error) {
      console.error(`uuid=${requestId} error=${error}`)
      return res.status(INTERNAL_SERVER_ERROR).json({
        requestId
      })
    }
  })

  router.post('/:profileId/devices', async (req, res) => {
    const requestId = req.header('x-request-id') || uuid()
    const { profileId } = req.params
    const devices = req.body
    try {
      const result = await createDevices(db)(profileId, devices)
      return res.status(CREATED).json(result)
    } catch (error) {
      console.error(`uuid=${requestId} error=${error}`)
      return res.status(INTERNAL_SERVER_ERROR).json({
        requestId
      })
    }
  })

  return router
}
