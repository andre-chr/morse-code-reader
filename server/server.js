'use strict';

//import libraries
var fs = require('fs'), 
	http = require('http');


const config = require('./config.json');			//import config file
const Board = require('./board.js');				//import board file
const Simulator = require('./simulator.js');		//import simulator
const Firebase = require('./firebase_admin.js');	//import firebase file

var server=http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-type': 'text/html'});
	res.end(fs.readFileSync('../client/index.html'));
	}).listen(8080, function() {
		console.log('Listening at: http://localhost:8080');
 });

var firebase = new Firebase();	//construct firebase database

var data = {
	motionCount: 0,
	message: ''
}
var code = '';

function flushLetter() {
	var c = config["morse-decoder"][code];	//lookup dictionary of morse codes
	if (c) {
		data.message += c;
		firebase.updateMessage(data.message);	//update message to database
	}
	code = '';		//reset code
}

function newWord() {
	data.message += ' ';
}

var letterInterval, wordInterval;

//var board = new Board(); // connect to the board
var board = new Simulator("Hello world!"); // connect to the simulator

board.on('open', () => {
    console.log('board connected');
});

//triggers when motion starts
board.on('start', (time) => {
    console.log('motion start; delay: ', + time.toString() + ' ms');
	data.motionCount++;
	firebase.updateCount(data.motionCount);		//update count to database
	
	//clear timers when motion is detected
	clearTimeout(letterInterval);
	clearTimeout(wordInterval);
});

//triggers when motion ends
board.on('end', (time) => {
    console.log('motion end; duration: ' + time.toString() + ' ms');
	
	code += time >= config['long-mark']*config['time-unit'] ? 'L' : 'S';	//categorize motion as long or short
	console.log(code);
	//start timers for letter and word
	letterInterval = setTimeout(flushLetter, config['letter-gap']*config['time-unit']);
	wordInterval = setTimeout(newWord, config['word-gap']*config['time-unit']);
});
board.open();

