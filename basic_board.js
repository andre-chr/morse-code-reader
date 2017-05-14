'use strict';

const config = require('./config.json');
const EventEmitter = require('events');
const SerialPort = require('serialport');

class BasicBoard extends EventEmitter
{
    constructor() {
        super();
        this._inMotion = null;
        this._previousTime = null;
    }

    open() {
        this._inMotion = false;
        this._previousTime = Date.now();
        this.emit('open');
    }

    get inMotion() {
        return this._inMotion;
    }

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
