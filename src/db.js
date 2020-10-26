const { connect } = require('mongodb').MongoClient
const assert = require('assert')

export default (config, callback) => {
  console.log(config.mongoConnectionString)
  connect(config.mongoConnectionString, {
    useNewUrlParser: true,
    ignoreUndefined: true,
    poolSize: config.mongoPoolSize
  }, (err, client) => {
    assert.strictEqual(null, err)
    console.info('Connected successfully to example database')

    callback(client.db())
  })
}
