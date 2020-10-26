import request from 'request-promise'
import { setLastAlarmId } from './profileService'

const addEventToAlarm = (config, db) => async (profile, alarmId, event) => {
  const { api: baseUrl, auth } = config.noonlight.dispatch
  const uri = `${baseUrl}/v1/alarms/${alarmId}/events`
  const device = profile.devices.find(d => d.device_id === event.device_id)
  const events = [
    {
      event_type: 'alarm.device.value_changed',
      event_time: new Date(),
      meta: {
        ...device,
        media: event.media
      }
    }
  ]
  const result = await request({
    method: 'POST',
    uri,
    auth,
    body: events,
    simple: false,
    resolveWithFullResponse: true,
    json: true
  })
  if (result.statusCode === 201) {
    return { success: true }
  }
  if (result.statusCode === 400 && result.body.key === 'alarm_canceled') {
    const returnValue = await createAlarm(config, db)(profile, event)
    return returnValue
  }
  const error = {
    statusCode: result.statusCode,
    body: result.body
  }
  return error
}

const createAlarm = (config, db) => async (profile, event) => {
  const { name, phone, pin, location } = profile
  const { api: baseUrl, auth } = config.noonlight.dispatch
  const uri = `${baseUrl}/v1/alarms`
  const result = await request({
    method: 'POST',
    uri,
    auth,
    body: {
      name,
      phone,
      pin,
      location
    },
    simple: false,
    resolveWithFullResponse: true,
    json: true
  })
  if (result.statusCode === 201) {
    await setLastAlarmId(db)(profile._id, result.body.id)
    const response = await addEventToAlarm(config, db)(profile, result.body.id, event)
    return response
  }
  const error = {
    statusCode: result.statusCode,
    body: result.body
  }
  return error
}

export const addEvent = (config, db) => async (profile, event) => {
  if (profile.alarm_id) {
    return addEventToAlarm(config, db)(profile, profile.alarm_id, event)
  }
  return createAlarm(config, db)(profile, event)
}
