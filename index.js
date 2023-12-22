//////////////////////////////////////////// IMPORTS //////////////////////////////////////////
// Required for express.
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// Required for EJS.
let ejs = require('ejs');
app.set('view engine', 'ejs')

// Import DAO.
const mySQL_DAO = require('./mySQL_DAO.js')
const mongoDB_DAO = require('./mongoDB_DAO.js')

// Required for external scripts.
const path = require('path');
app.use('/public/scripts', express.static(path.join(__dirname, '/public/scripts')));

//////////////////////////////////////////// HOME ////////////////////////////////////////////

// Go to the default page.
app.get('/', (req, res) => {
  mySQL_DAO.getProducts()
    .then((products) => {
      res.send(products);
    })
    .catch((error) => {
      res.send(error);
    });
})

// Go to the home page.
app.get('/home', (req, res) => {
  res.render('home.ejs')
})

//////////////////////////////////////////// STORES //////////////////////////////////////////

// Go to the stores page.
app.get('/stores', (req, res) => {
  mySQL_DAO.getStores()
    .then((stores) => {
      res.render('./stores/viewStores.ejs', { "stores": stores })
    })
    .catch((error) => {
      res.send(error)
    })
})

// Edit a specific store.
app.get('/stores/edit/:sid', (req, res) => {
  var store = mySQL_DAO.getStoreById(req.params.sid)
    .then((store) => {
      if (store) {
        res.render('./stores/updateStore.ejs', { "store": store });
      }
      else {
        res.send("<h1>Error</h1><p>The store with ID " + req.params.sid + " is not found. </p><a href='/stores'>Back to Stores</a>");
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

app.post('/stores/edit/:sid', (req, res) => {
  var storeId = req.params.sid;
  var updatedStore = req.body;

  mySQL_DAO.updateStore(storeId, updatedStore)
    .then(() => {
      res.redirect('/stores');
    })
    .catch((error) => {
      res.send(error);
    });
});

// Add a new store.
app.get('/stores/new', (req, res) => {
  res.render('./stores/newStore.ejs', { newStore: {} });
});

app.post('/stores/new', (req, res) => {
  var newStore = req.body;

  mySQL_DAO.addStore(newStore)
    .then(() => {
      res.redirect('/stores');
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

//////////////////////////////////////////// PRODUCTS ////////////////////////////////////////

// Go to the products page.
app.get('/products', (req, res) => {
  mySQL_DAO.getProducts()
    .then((products) => {
      res.render('./products/viewProducts.ejs', { "products": products });
    })
    .catch((error) => {
      res.send(error);
    });
});

// Delete a product.
app.get('/products/delete/:pid', (req, res) => {
  var productId = req.params.pid;

  mySQL_DAO.deleteProduct(productId)
    .then(() => {
      res.redirect('/products');
    })
    .catch((error) => {
      res.send(error);
    });
});


//////////////////////////////////////////// MANAGERS ////////////////////////////////////////

// Go to the managers page.
app.get('/managers', (req, res) => {
  mongoDB_DAO.getManagers()
    .then((documents) => {
      // Process documents
      res.render('./managers/viewManagers.ejs', { "documents": documents })
    })
    .catch((error) => {
      // Handle error
      res.send(error)
    })
})

// Add a new manager.
app.get('/managers/new', (req, res) => {
  res.render('./managers/newManager.ejs', { newManager: {} });
});

app.post('/managers/new', (req, res) => {
  var newManager = req.body;

  // Check if the manager already exists.
  mongoDB_DAO.existingManager(newManager)
    .then((exists) => {
      if (exists) {
        res.send("<h1>Error</h1><p>The manager named " + newManager.name + " already exists.</p><a href='/managers'>Back to Managers</a>");
      } else {
        mongoDB_DAO.addManager(newManager)
          .then(() => {
            res.redirect('/managers');
          })
          .catch((error) => {
            console.log(error);
            res.send(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

//////////////////////////////////////////// OTHER ///////////////////////////////////////////

// Which port to listen to.
app.listen(3004, () => {
  console.log("Listening on port 3004. ")
})