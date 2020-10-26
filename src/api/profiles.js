import uuid from 'uuid/v4'
import { Router } from 'express'
import { createProfile, createDevices } from '../lib/profileService'

export default ({ config, db }) => {
  const router = Router({ mergeParams: true })

  router.post('/', async (req, res) => {
    const requestId = req.header('x-request-id') || uuid()
    const profile = req.body
    try {
      const result = await createProfile(db)(profile)
      return res.status(201).json(result)
    } catch (error) {
      console.error(`uuid=${requestId} error=${error}`)
      return res.status(500).json({
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
      return res.status(201).json(result)
    } catch (error) {
      console.error(`uuid=${requestId} error=${error}`)
      return res.status(500).json({
        requestId
      })
    }
  })

  return router
}
