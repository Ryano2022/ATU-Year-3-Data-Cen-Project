// Required for express.
var express = require('express')
mySQL_DAO = require('./mySQL_DAO.js')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
// Required for EJS.
let ejs = require('ejs');
app.set('view engine', 'ejs')

// Go to the default page.
app.get('/', (req, res) => {
  mySQL_DAO.getStores()
    .then((data) => {
      res.send(data)
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
  res.render('./stores/viewStores.ejs')
})

// Go to the edit stores page.
app.get('/stores/edit', (req, res) => {
  res.render('./stores/updateStore.ejs')
})

// Go to the add store page.
app.get('/stores/new', (req, res) => {
  res.render('./stores/newStore.ejs')
})

// Go to the products page.
app.get('/products', (req, res) => {
  res.render('./products/viewProducts.ejs')
})

// Go to the managers page.
app.get('/managers', (req, res) => {
  res.render('./managers/viewManagers.ejs')
})

// Which port to listen to.
app.listen(3004, () => {
  console.log("Listening on port 3004. ")
})