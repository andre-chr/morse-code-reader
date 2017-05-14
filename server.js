'use strict';

// load config file
const config = require('./config.json');
// load Board class
const Board = require('./board.js');

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
