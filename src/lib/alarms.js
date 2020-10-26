import request from 'request-promise'
import { OK } from 'http-status-codes'

export const cancelAlarm = (config) => async (profile, pin) => {
  const { api: baseUrl, auth } = config.noonlight.dispatch
  const uri = `${baseUrl}/v1/alarms/${profile.alarm_id}/status`
  const result = await request({
    method: 'POST',
    uri,
    auth,
    body: {
      status: 'CANCELED',
      pin
    },
    simple: false,
    resolveWithFullResponse: true,
    json: true
  })
  if (result.statusCode === OK) {
    return { success: true }
  }
  const error = {
    statusCode: result.statusCode,
    body: result.body
  }
  return error
}
