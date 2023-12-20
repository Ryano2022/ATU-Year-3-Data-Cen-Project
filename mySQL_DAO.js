// Required for promise-mysql.
var pmysql = require("promise-mysql");
var pool;

pmysql.createPool({
  connectionLimit: 3,
  host: "localhost",
  user: "root",
  password: "root",
  database: "proj2023"
})
  .then(p => {
    pool = p;
  })
  .catch(e => {
    console.log("pool error: " + e);
  });

// Get all the stores.
var getStores = function () {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM store")
      .then((stores) => {
        resolve(stores);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Find the specific store by ID.
var getStoreById = function (storeId) {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM store WHERE sid = ?", [storeId])
      .then((store) => {
        resolve(store[0]);
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Update the store.
var updateStore = function (storeId, updatedStore) {
  return new Promise((resolve, reject) => {
    pool.query("UPDATE store SET location = ?, mgrid = ? WHERE sid = ?", [updatedStore.location, updatedStore.mgrid, storeId])
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Add a new store.
var addStore = function (newStore) {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO store (sid, location, mgrid) VALUES (?, ?, ?)", [newStore.sid, newStore.location, newStore.mgrid])
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
};

// Get all the products.
var getProducts = function () {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM product INNER JOIN product_store ON product.pid = product_store.pid")
      .then((products) => {
        resolve(products);
      })
      .catch(error => {
        reject(error);
      });
  });
};

var deleteProduct = function (productId) {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM product_store WHERE pid = ?", [productId])
      .then(results => {
        if (results.length > 0) {
          reject("<h1>Error</h1><p>The product with ID " + productId + " is being sold in a store.</p><a href='/products'>Back to Products</a>");
        } 
        else {
          return pool.query("DELETE FROM product_store WHERE pid = ?", [productId]);
        }
      })
      .then(() => {
        return pool.query("DELETE FROM product WHERE pid = ?", [productId]);
      })
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = { getStores, getStoreById, updateStore, addStore, getProducts, deleteProduct };