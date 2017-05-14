'use strict';

//import libraries
var fs = require('fs'), 
	http = require('http'),
    socketio = require('socket.io');

// load config file
const config = require('./config.json');
// load Board class
const Board = require('./board.js');
const Simulator = require('./simulator.js');
const Firebase = require('./firebase_admin.js');

var server=http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-type': 'text/html'});
	res.end(fs.readFileSync('../client/index.html'));
	}).listen(8080, function() {
		console.log('Listening at: http://localhost:8080');
 });

//var board = new Board(); // connect to the board
var board = new Simulator("Hello world!"); // connect to the simulator

board.on('open', () => {
    console.log('board connected');
});
board.on('start', (time) => {
    console.log('motion start; delay: ', + time.toString() + ' ms');
});
board.on('end', (time) => {
    console.log('motion end; duration: ' + time.toString() + ' ms');
});
board.open();

