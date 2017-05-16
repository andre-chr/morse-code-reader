/**
 * @file basic_board.js
 * Contains the BasicBoard class, which is the base funcionality for what the
 * board is meant to handle.
 */
'use strict';

// load config & libraries
const config = require('./config.json');
const EventEmitter = require('events');
const SerialPort = require('serialport');

/**
 * BasicBoard class enables the basic functionality for all morse code boards.
 * Communicates through events listed below:
 * open(): the board has finished opening, and will start to emit signals
 * start(time): a motion has been detected, time duration since last motion
 *              ended in milliseconds
 * end(time): a motion has just ended, time duration since the motion started
 */
class BasicBoard extends EventEmitter {
    /**
     * Will construct the board, but does not open it for reciving signals.
     */
    constructor() {
        super();
        this._inMotion = null;
        this._previousTime = null;
    }

    /**
     * Will open the board for reading. Should be called by child class once the
     * board is ready.
     */
    open() {
        this._inMotion = false;
        this._previousTime = Date.now();
        this.emit('open');
    }

    /**
     * Will return true when a motion has started but not ended, false otherwise
     */
    get inMotion() {
        return this._inMotion;
    }

    /**
     * Some boards have differing timing, so this will return how many
     * time-unit's is required to get a short motion.
     */
    get shortMark() {
        return config['short-mark']; // defaults to short-mark in config
    }

    /**
     * Some boards have differing timing, so this will return how many
     * time-unit's is required to get a long motion.
     */
    get longMark() {
        return config['long-mark']; // defaults to long-mark in config
    }

    /**
     * Internal function, will set the inMotion to true or false, and emit the
     * either start or end  events. Note: these events will not be triggered if
     * no change to inMotion is made.
     * @param value The value to set inMotion, true or false.
     */
    _setMotion(value) {
        let time = Date.now();
        if (value === false && this._inMotion === true) {
            this._inMotion = false;
            this.emit('end', time - this._previousTime);
            this._previousTime = time;
        } else if (value === true && this._inMotion === false) {
            this._inMotion = true;
            this.emit('start', time - this._previousTime);
            this._previousTime = time;
        }
    }
}

module.exports = BasicBoard;
