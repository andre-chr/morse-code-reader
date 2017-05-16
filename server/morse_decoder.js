/**
 * @file morse_decoder.js
 * The decoder class, will decode morse code messages from a board.
 */
'use strict';

const config = require('./config.json');
const EventEmitter = require('events');
var logger = require('./logger.js');

// sets up the decoding table, which is inversed of the morse-table
var decodingTable = {};
for (var key in config['morse-table']) {
    decodingTable[config['morse-table'][key]] = key;
}

/**
 * The morse code decoder. Attach this to a board and it will issue events
 * that contain decoded letters. The event list is listed below:
 * short(time): a short motion was detected that ran for time milliseconds.
 * long(time): a long motion was detected that ran for time miliiseconds.
 * letter(char): a letter was determained from the motions, ranging from A-Z
 *               and including spaces.
 * bad-letter(code): an unidentified sequence was found that did not map any
 *                   letters, code is that 'S' and 'L' sequence.
 * bad-mark(time): a motion that was too short was detected.
 */
class MorseDecoder extends EventEmitter {
    /**
     * Initialises the MorseDecoder class, setup the base values in the variables.
     */
    constructor() {
        super();
        this.board = null;
        this.message = '';
        this.word = '';
        this.code = '';
        this.timeoutid = null;
        this.duration = {
            short: -1, // the short motion time, taken from the board
            long: -1, // the long motion time, taken from the board
            letter: config['letter-gap'] * config['time-unit'], // letter-gap
            word: config['word-gap'] * config['time-unit'] // word-gap
        };
    }

    /**
     * Will connect a board to the decoder, a decoder can only be connected to
     * one board, while a single board can be connected to the decoder.
     * @param board 
     */
    connect(board) {
        // checks if a previous connection has already been made
        if (this.board !== null) {
            console.trace('already connected to a board');
            return;
        }
        this.board = board;
        // updates the short and long motion timer to that of the board
        this.duration.short = board.shortMark * config['time-unit'];
        this.duration.long = board.longMark * config['time-unit'];
        // connects to the board start and end events
        board.on('start', time => this._signalStart(time));
        board.on('end', time => this._signalEnd(time));
    }

    /**
     * A motion has started.
     * @param time The time in milliseconds since the last motion ended.
     */
    _signalStart(time) {
        // a timer was set to auto-end a word, with a new motion detected, end
        // that timer before it is called
        if (this.timeoutid !== null) {
            clearTimeout(this.timeoutid);
            this.timeoutid = null;
        }
        // handle whether it is a letter or a word
        if (time < this.duration.letter) {} // next motion for current letter
        else if (time < this.duration.word) { // motion for new letter
            this._endLetter();
        } else { // motion for start of new word
            this._endWord();
        }
    }

    /**
     * A motion has ended.
     * @param time The time in milliseconds since the motion started.
     */
    _signalEnd(time) {
        // handle whether motion is short or long
        if (time < this.duration.short) { // too short
            this.emit('bad-mark', time);
        }
        else if (time < this.duration.long) { // short motionh
            this.code += 'S'; // append motion to current letter code
            this.emit('short', time);
			logger.debug('detected motion: S');
        } else { // long motion
            this.code += 'L'; // append motion to current letter code
            this.emit('long', time);
			logger.debug('detected motion: L');
        }
        this.timeoutid = setTimeout(() => { this._endWord(); }, this.duration.word + 2000);
    }

    /**
     * An end of letter has been detected. Will determain which letter it is (if
     * any) and emit an event. Will also detect if first letter of a new word
     * and emit a event with a space.
     */
    _endLetter() {
        if (this.code === '') {} // empty letter, do nothing
        else if (this.code in decodingTable) { // code found in table
            // check if start of new word and send a space (if not first word)
            if (this.word === '' && this.message !== '') { // start of a new word
                this.message += ' ';
                this.emit('letter', ' ');
            }
            let letter = decodingTable[this.code];
            this.word += letter; // append letter to current word
            this.message += letter; // append letter to current message
            this.emit('letter', letter);
        } else { // letter code not found
            this.emit('bad-letter', this.code);
        }
        this.code = ''; // reset the code for new letter
    }

    /**
     * Ends the current word, mainly ends the letter and reset the word to
     * being empty.
     */
    _endWord() {
        this._endLetter();
        this.word = '';
		logger.silly('word ended');
    }
}

module.exports = MorseDecoder;
