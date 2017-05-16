'use strict';

const config = require('./config.json');
const BasicBoard = require('./basic_board.js');
const Logger = require('./logger.js');
const SerialPort = require('serialport');

var logger = new Logger('board');		//instantiate logger

class Board extends BasicBoard {
    constructor() {
        super();
        this.serialport = new SerialPort(config['board_line'], {
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
                logger.error('failed to open SerialPort: ' + error.message);
            } else {
                super.open();
            }
        });
    }

    get shortMark() {
        return 5; // board generally takes at least 5 seconds
    }

    get longMark() {
        return 8;
    }
}

module.exports = Board;