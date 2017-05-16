'use strict';
//import libraries
//var fs = require('fs'), 
//	http = require('http');


const config = require('./config.json');			//import config file
const Board = require('./board.js');				//import board file
const Simulator = require('./simulator.js');		//import simulator
const Firebase = require('./firebase_admin.js');	//import firebase file
const MorseDecoder = require('./morse_decoder.js'); //import MorseDecoder class
const Logger = require('./logger.js');				//import logger class

var logger = new Logger('server');		//instantiate logger

/*
var server=http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-type': 'text/html'});
	res.end(fs.readFileSync('../client/index.html'));
	}).listen(8080, function() {
		console.log('Listening at: http://localhost:8080');
 });
 */

var admin = new Firebase();
//var board = new Board(); // connect to the board
var board = new Simulator("Hello world!"); 	// connect to the simulator
var decoder = new MorseDecoder;

board.on('open', () => {
    logger.info('board connected');
});

//triggers when motion starts
board.on('start', (time) => {
    logger.silly('motion start; delay: ' + time + ' ms');
});
//triggers when motion ends
board.on('end', (time) => {
    logger.silly('motion end; duration: ' + time + ' ms');
});

decoder.on('letter', (letter) => {
	logger.info('detected letter: ' + letter);
	admin.addLetter(letter);
});
decoder.on('short', (time) => {
	logger.silly('detected short mark');
	admin.incMotions();
});
decoder.on('long', (time) => {
	logger.silly('detected long mark');
	admin.incMotions();
});
decoder.on('bad-letter', (code) => {
	logger.warn('unknown sequence: ', code);
});
decoder.on('bad-mark', (time) => {
	logger.warn('unknown mark; possibly too short');
});
decoder.connect(board);
board.open();
