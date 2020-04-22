var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
// parse json
app.use(bodyParser.json())
// accept requests from the client
app.use(cors())

const UserController = require('./UserController');
const userController = new UserController();
const TripController = require('./TripController');
const tripController = new TripController();

// routes
app.get('/users', (req, res) => userController.getUsers(req, res))

app.get('/user', (req, res) => userController.getUser(req, res))

app.get('/trips', (req, res) => tripController.getTrips(req, res))

app.post('/trips', (req, res) => tripController.addTrip(req, res))

app.post('/trip', (req, res) => tripController.updateTrip(req, res))

app.post('/deleteTrip', (req, res) => tripController.deleteTrip(req, res))

app.post('/setTrips', (req, res) => tripController.setTrips(req, res))

// listen for requests
let port = 3001;
console.log("App listening on port: " + port);
app.listen(port)