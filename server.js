'use strict';

// load config file
const config = require('./config.json');
// load Board class
const Board = require('./board.js');
const Simulator = require('./simulator.js');

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
