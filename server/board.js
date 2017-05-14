'use strict';

const config = require('./config.json');
const BasicBoard = require('./basic_board.js');
const SerialPort = require('serialport');

class Board extends BasicBoard
{
    constructor() {
        super();
        this.serialport = new SerialPort(config['board-line'], {
            parser: SerialPort.parsers.readline('\n'),
            autoOpen: false
        });
        this.serialport.on('data', (msg) => {
            this._setMotion(msg != 1);
        });
    }

    open() {
        this.serialport.open((error) => {
            if (error) {
                console.log('failed to open SerialPort: ', error.message);
            } else {
                super.open();
            }
        });
    }
}

module.exports = Board;
