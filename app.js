// Libraries
const express = require('express')
const request = require('request-promise')
const config = require('dotenv').config({path: './bird.key'}); // For API key

// Globals
const BIRD_URL = 'https://api.bird.co/bird/nearby'
const SERVER_ADDRESS = '127.0.0.1'
const SERVER_PORT = 7301
const BIRD_KEY = process.env.BIRD_KEY
const BIRD_DEVICEID = process.env.BIRD_DEVICEID

// Format and options for the request
var request_options = {
  method: 'GET',
  uri: BIRD_URL,
  json: true,
  qs: {
    latitude: '43.05053314605316',
    longitude: '-87.8982449816419',
    radius: '1000'
  },
  headers: {
    'Cache-Control': 'no-cache',
    Location: "{\"latitude\": 43.05053314605316, \"longitude\":-87.8982449816419}", // BIRDs goofy JSON format for this
    'altitude':500,
    'accuracy':100,
    'speed':'-1',
    'heading':'-1',
    'App-Version': '3.3.0',
    'Device-id': BIRD_DEVICEID,
    'Authorization': 'Bird ' + BIRD_KEY
  } // headers
} // request_options

const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
  getBirds( function(bird_results) {
    res.send(JSON.stringify(bird_results))
  });
})

app.listen(SERVER_PORT, function() {
  console.log('BIRD server listening on http://127.0.0.1:' + SERVER_PORT)
});

function getBirds( callback ) {
  request( request_options )
    .then(function (response) {  // Request was successful
        var json_result = response['birds']
        callback( json_result )
    })
    .catch(function (err) {
      console.log( err ) // Something bad happened, handle the error
    })
} //getBirds()
