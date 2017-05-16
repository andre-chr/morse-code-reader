/**
 * @file server.js
 * The file that start the server. To run this file use the following commands:
 * node server.js  # will run the server using the Arduino Uno Board
 * node server.js message  # will run a simulator sending that message
 * Note: the simulator message can be in a single parameter or many, e.g.
 * node server.js "Hello world!"
 * node server.js Hello world!
 * Those two commands are excatly the same.
 */
'use strict';

// load the classes the manage aspects of the program
const config = require('./config.json');			// import config file
const Board = require('./board.js');				// import Board class
const Simulator = require('./simulator.js');		// import Simulator class
const Firebase = require('./firebase_admin.js');	// import Firebase class
const MorseDecoder = require('./morse_decoder.js'); // import MorseDecoder class

// the firebase admin class, mainly used to communicate with the database
var admin = new Firebase();

// setup the correct board type
if (process.argv.length > 2) { // parameters means pass to simulator
	var board = new Simulator(process.argv.slice(2).join(' '));
} else { // attach to the board
	var board = new Board();
}

// handles the signals recived from the board and decodes the morse code message
var decoder = new MorseDecoder;

// logs when the board has established connection
board.on('open', () => {
    console.log('board connected');
});
// logs when a motion has started
board.on('start', (time) => {
    console.log('motion start; delay:', time, 'ms');
});
// logs when a motion has ended
board.on('end', (time) => {
    console.log('motion end; duration:', time, 'ms');
});
// logs and adds a new letter to the message in firebase
decoder.on('letter', (letter) => {
	console.log('detected letter: ', letter);
	admin.addLetter(letter);
});
// logs a short motion and handles motion count
decoder.on('short', (time) => {
	console.log('detected short mark');
	admin.incMotions();
});
// logs a long motion and handles motion count
decoder.on('long', (time) => {
	console.log('detected long mark');
	admin.incMotions();
});
// when the user imputs a non-existant letter, logs
decoder.on('bad-letter', (code) => {
	console.log('unknown sequence: ', code);
});
// when the user signal is too short, logs
decoder.on('bad-mark', (time) => {
	console.log('unknown mark; possibly too short');
});

// connects the board to the decoder, so that the decoder can recieve signals
decoder.connect(board);
// opens up a connection to the board, this is where the program will really start
board.open();
