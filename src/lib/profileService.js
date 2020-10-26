import { ObjectId } from 'mongodb'

export const createProfile = db => async (profile) => {
  const coll = db.collection('profiles')
  const result = await coll.insertOne(profile)
  return result && result.ops && result.ops[0]
}

export const createDevices = db => async (profileId, devices) => {
  const coll = db.collection('profiles')
  return coll.findOneAndUpdate({ _id: ObjectId(profileId) }, {
    $push: {
      devices
    }
  })
}

export const findProfileByDeviceId = db => async (deviceId) => {
  const coll = db.collection('profiles')
  return coll.findOne({ 'devices.device_id': deviceId })
}

export const setLastAlarmId = db => async (profileId, alarmId) => {
  const coll = db.collection('profiles')
  const result = await coll.findOneAndUpdate({ _id: ObjectId(profileId) }, {
    $set: { alarm_id: alarmId }
  })
  return result && result.value
}
