/**
 * @file board.js
 * The Board class, will connect to an Arduino Uno board through serialport.
 */
'use strict';

const config = require('./config.json');
const BasicBoard = require('./basic_board.js');
const SerialPort = require('serialport');
var logger = require('./logger.js');

/**
 * The Board class handles a connection to an Arduino Uno board. Expected behavior
 * models that of BasicBoard.
 */

class Board extends BasicBoard {
    /**
     * Constructs the board, will setup the serialport class but will not open.
     * @pre None
     * @post None
     */
    constructor() {
        super();
        this.serialport = new SerialPort(config['board-line'], {
            parser: SerialPort.parsers.readline('\n'),
            autoOpen: false
        });
        // when data is recived, update inMotion
        this.serialport.on('data', (msg) => {
            this._setMotion(msg != 0);
        });
    }

    /**
     * Opens the file in asynchronous, on error a message is logged to console.
     * Once board is connected, will issue an open event.
     * @pre None
     * @post None
     */
    open() {
        this.serialport.open((error) => {
            if (error) {
                logger.error('failed to open SerialPort: ' + error.message);
            } else {
                super.open();
            }
        });
    }

    /**
     * The board generally takes at least 5 seconds to handle a short motion.
     * @returns The short mark in time-unit's.
     * @pre None
     * @post None
     */
    get shortMark() {
        return 4; // board generally takes at least 5 seconds
    }

    /**
     * With a longer short motion, a longer long motion is needed as well.
     * @returns The long mark in time-unit's.
     * @pre None
     * @post None
     */
    get longMark() {
        return 8;
    }
}

module.exports = Board;