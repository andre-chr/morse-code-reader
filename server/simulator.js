'use strict';

const config = require('./config.json');
const BasicBoard = require('./basic_board.js');

class Simulator extends BasicBoard
{
    constructor(message) {
        super();

        this._message = [];
        this._at = 0;
        let words = message.split(' ');
        for (let word of words) {
            this._addWord(word);
        }
    }

    open() {
        this._at = 0;
        setTimeout(() => { this._nextEvent(false); }, 5000);
        super.open();
    }

    _addWord(word) {
        if (this._message.length !== 0) {
            this._addEvent(config['word-gap'], false);
        }
        this._at = 0;
        for (let letter of word) {
            letter = letter.toUpperCase();
            if (letter in config['morse-table']) {
                this._addLetter(config['morse-table'][letter]);
            }
        }
    }

    _addLetter(code) {
        if (this._at !== 0) {
            this._addEvent(config['letter-gap'], false);
        }
        for (let l of code) {
            this._addEvent(l == 'S' ? config['short-mark'] : config['long-mark'], true);
        }
        this._at += 1;
    }

    _addEvent(time, signal) {
        this._message.push({time: time * config['time-unit'] + 100, signal: signal});
    }

    _nextEvent(close) {
        // process event
        if (close === false) {
            if (this._at >= this._message.length)
                return;
            let msg = this._message[this._at];
            if (msg.signal === true) {
                this._setMotion(true);
            }
            this._at += 1;
            setTimeout((tclose) => { this._nextEvent(tclose); }, msg.time, msg.signal);
        } else {
            this._setMotion(false);
            setTimeout(() => { this._nextEvent(false) }, 100);
        }
    }
}

module.exports = Simulator;