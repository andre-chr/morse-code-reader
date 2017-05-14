'use strict';

//import libraries
var admin = require("firebase-admin"),
	fs = require('fs'), 
	http = require('http'),
    socketio = require('socket.io');

// load config file
const config = require('./config.json');
// load Board class
const Board = require('./board.js');

// Fetch the service account key JSON file contents
var serviceAccount = require("./serviceAccountKey.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project1-9aa9d.firebaseio.com"  // IMPORTANT: repalce the url with yours 
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("motionSensorData"); // channel name

var server=http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-type': 'text/html'});
	res.end(fs.readFileSync(__dirname+'/index.html'));
	}).listen(8080, function() {
		console.log('Listening at: http://localhost:8080');
 });

 var board = new Board();
board.on('open', () => {
    console.log('board connected');
});
board.on('start', () => {
    console.log('motion start');
});
board.on('end', (time) => {
    console.log('motion end; duration: ' + time.toString() + ' ms');
});
board.open();

