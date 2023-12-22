const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://127.0.0.1:27017')
  .then((client) => {
    db = client.db('proj2023MongoDB')
    coll = db.collection('managers')
  })
  .catch((error) => {
    console.log(error.message)
  })

// Find all the managers.
var getManagers = function () {
  return new Promise((resolve, reject) => {
    var cursor = coll.find()
    cursor.toArray()
      .then((documents) => {
        resolve(documents)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Add a new manager.
var addManager = function (newManager) {
  newManager.salary = parseInt(newManager.salary);
  return new Promise((resolve, reject) => {
    coll.insertOne(newManager)
      .then(() => {
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Check for an existing manager.
var existingManager = function (newManager) {
  return new Promise((resolve, reject) => {
    var cursor = coll.find({ "name": newManager.name })
    cursor.toArray()
      .then((documents) => {
        if (documents.length > 0) {
          resolve(true)
        } 
        else {
          resolve(false)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

module.exports = { getManagers, addManager, existingManager }