'use strict';

const config = require('./config.json');
const EventEmitter = require('events');
const SerialPort = require('serialport');

class Board extends EventEmitter
{
    constructor() {
        super();
        this._inMotion = null;
        this._startMotionTime = null;
        this.serialport = new SerialPort(config['board-line'], {
            parser: SerialPort.parsers.readline('\n'),
            autoOpen: false
        });
        this.serialport.on('data', (msg) => {
            let time = Date.now();
            if (msg == 0 && this._inMotion === true) {
                this._inMotion = false;
                this.emit('end', time - this._startMotionTime);
            } else if (msg == 1 && this._inMotion === false) {
                this._inMotion = true;
                this._startMotionTime = time;
                this.emit('start');
            }
        });
    }

    open() {
        this.serialport.open((error) => {
            if (error) {
                console.log('failed to open SerialPort: ', error.message);
            } else {
                this._inMotion = false;
                this.emit('open');
            }
        });
    }

    get inMotion() {
        return this._inMotion;
    }
}

module.exports = Board;