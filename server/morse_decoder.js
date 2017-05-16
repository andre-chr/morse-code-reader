'use strict';

const config = require('./config.json');
const EventEmitter = require('events');
const Logger = require('./logger.js');

var logger = new Logger('morse_decoder');	//instantiate logger

var decodingTable = {};
for (var key in config['morse-table']) {
    decodingTable[config['morse-table'][key]] = key;
}

class MorseDecoder extends EventEmitter {
    constructor() {
        super();
        this.board = null;
        this.message = '';
        this.word = '';
        this.code = '';
        this.timeoutid = null;
        this.duration = {
            short: -1,
            long: -1,
            letter: config['letter-gap'] * config['time-unit'],
            word: config['word-gap'] * config['time-unit']
        };
    }

    connect(board) {
        if (this.board !== null) {
            console.trace('already connected to a board');
            return;
        }
        this.board = board;
        this.duration.short = board.shortMark * config['time-unit'];
        this.duration.long = board.longMark * config['time-unit'];
        board.on('start', time => this._signalStart(time));
        board.on('end', time => this._signalEnd(time));
    }

    _signalStart(time) {
        if (this.timeoutid !== null) {
            clearTimeout(this.timeoutid);
            this.timeoutid = null;
        }
        if (time < this.duration.letter) {}
        else if (time < this.duration.word) {
            this._endLetter();
        } else {
            this._endWord();
        }
    }

    _signalEnd(time) {
        if (time < this.duration.short) {
            this.emit('bad-mark', time);
        }
        else if (time < this.duration.long) {
            this.code += 'S';
            this.emit('short', time);
			logger.debug('detected motion: S');
        } else {
            this.code += 'L';
            this.emit('long', time);
			logger.debug('detected motion: L');
        }
        this.timeoutid = setTimeout(() => { this._endWord(); }, this.duration.word + 2000);
    }

    _endLetter() {
        if (this.code === '') {}
        else if (this.code in decodingTable) {
            // check if start of new word and send a space (if not first word)
            if (this.word === '' && this.message !== '') { // start of a new word
                this.message += ' ';
                this.emit('letter', ' ');
            }
            let letter = decodingTable[this.code];
            this.word += letter;
            this.message += letter;
            this.emit('letter', letter);
        } else {
            this.emit('bad-letter', this.code);
        }
        this.code = '';
    }

    _endWord() {
        this._endLetter();
        this.word = '';
		logger.silly('word ended');
    }
}

module.exports = MorseDecoder;
