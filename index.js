// Required for express.
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// Required for EJS.
let ejs = require('ejs');
app.set('view engine', 'ejs')

// Import mySQL DAO.
const mySQL_DAO = require('./mySQL_DAO.js')

// Required for external scripts.
const path = require('path');
app.use('/public/scripts', express.static(path.join(__dirname, '/public/scripts')));

// Go to the default page.
app.get('/', (req, res) => {
  mySQL_DAO.getStores()
    .then((stores) => {
      res.send(stores)
    })
    .catch((error) => {
      res.send(error)
    })
})

// Go to the home page.
app.get('/home', (req, res) => {
  res.render('home.ejs')
})

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
        res.send("Error: Store with ID " + req.params.sid + " not found.");
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


// Go to the products page.
app.get('/products', (req, res) => {
  Promise.all([mySQL_DAO.getProducts(), mySQL_DAO.getProducts_Store()])
    .then(([products, products_stored]) => {
      res.render('./products/viewProducts.ejs', { "products": products, "products_stored": products_stored });
    })
    .catch((error) => {
      res.send(error);
    });
});

// Go to the managers page.
app.get('/managers', (req, res) => {
  res.render('./managers/viewManagers.ejs')
})

// Which port to listen to.
app.listen(3004, () => {
  console.log("Listening on port 3004. ")
})