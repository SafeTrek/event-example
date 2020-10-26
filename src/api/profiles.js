import uuid from 'uuid/v4'
import { Router } from 'express'
import { createProfile, createDevices } from '../lib/profileService'
import { CREATED, INTERNAL_SERVER_ERROR } from 'http-status-codes'

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
