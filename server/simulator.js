/**
 * The simulator class, will send start and end motions without the need of a
 * board, this is done in alignment with a morse code message.
 */
'use strict';

const config = require('./config.json');
const BasicBoard = require('./basic_board.js');

/**
 * The Simulator class sends out start and end events to play out a morse code
 * message given to it on construction.
 */
class Simulator extends BasicBoard
{
    /**
     * Will construct the Simulator, setting up the message in a schedule.
     * @param message A string that contains the message to simulate.
	 * @pre None
	 * @post None
     */
    constructor(message) {
        super();
        
        // sets up basic variables
        this._message = [];
        this._at = 0;
        // get a list of words
        let words = message.split(' ');
        for (let word of words) {
            this._addWord(word); // add each word to the schedule
        }
    }

    /**
     * Will start the simulator, setting the first event in the schedule to
     * start in 5 seconds.
     * @pre None
     * @post None
     */
    open() {
        this._at = 0;
        setTimeout(() => { this._nextEvent(false); }, 5000);
        super.open();
    }

    /**
     * Adds a word to the message. The word-gap will be handle automatically.
     * @param word A string containing one word, a string of characters.
     * @pre None
     * @post None
     */
    _addWord(word) {
        // if message is not the first word, add the word-gap
        if (this._message.length !== 0) {
            this._addEvent(config['word-gap'], false);
        }
        this._at = 0; // reset the number of letters added for each new word
        for (let letter of word) {
            letter = letter.toUpperCase(); // letter must be uppercase
            if (letter in config['morse-table']) {
                // adds the letter sequance of short and long to the schedule
                this._addLetter(config['morse-table'][letter]);
            }
        }
    }

    /**
     * Adds the code to the schedule as a single letter. Letter-gap will be
     * added automatically when needed.
     * @param code A string of 'S' or 'L' that make up a letter.
     * @pre None
     * @post None
     */
    _addLetter(code) {
        // if is not the first letter, add the letter-gap
        if (this._at !== 0) {
            this._addEvent(config['letter-gap'], false);
        }
        for (let l of code) {
            // add a short motion event for 'S', or a long motion event for 'L'
            this._addEvent(l == 'S' ? config['short-mark'] : config['long-mark'], true);
        }
        this._at += 1;
    }

    /**
     * Will add an event to the schedule. There are two types of events, one
     * that will simulate a motion, while the other will wait for a period of
     * time doing nothing. The duration will add a random amount of time.
     * @param time An integer with the duration the event runs for in time-unit.
     * @param signal Type of event, true for a motion, false for a delay (wait)
     * @pre None
     * @post None
     */
    _addEvent(time, signal) {
        // random time from 20-800 ms
        let rnd = Math.floor(Math.random() * 780) + 20;
        this._message.push({time: time * config['time-unit'] + rnd, signal: signal});
    }

    /**
     * Will start the next event. Calling this once will have it automaticall
     * go through the schedule, one by one with the correct amount of time
     * delay. Works like an iterator that just gets called once.
     * @param close A boolean, true when a motion is running and needs to end,
     *              will re-run with a random delay on this case. False when
     *              to run the next iteration.
     * @pre Is opened
     * @post None
     */
    _nextEvent(close) {
        // process event
        if (close === false) { // start next item of schedule
            if (this._at >= this._message.length)
                return; // last event, do not continue
            let msg = this._message[this._at]; // the current event to start
            if (msg.signal === true) { // is a motion so start it
                this._setMotion(true);
            }
            this._at += 1;
            // set the next event start, msg.signal will handle the end of motion
            setTimeout((tclose) => { this._nextEvent(tclose); }, msg.time, msg.signal);
        } else {
            this._setMotion(false);
            let rnd = Math.floor(Math.random() * 150) + 50;
            // sets the next event to start
            setTimeout(() => { this._nextEvent(false) }, 100);
        }
    }
}

module.exports = Simulator;
