// Required for promise-mysql.
var pmysql = require('promise-mysql')
var pool

pmysql.createPool({
  connectionLimit: 3,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'proj2023'
})
  .then(p => {
    pool = p
  })
  .catch(e => {
    console.log("pool error: " + e)
  })

var getStores = function () {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM store')
      .then((stores) => {
        resolve(stores)
      })
      .catch(error => {
        reject(error)
      })
  })
}

var getProducts = function () {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM product')
      .then((products) => {
        resolve(products)
      })
      .catch(error => {
        reject(error)
      })
  })
}

module.exports = {getStores, getProducts}