/**
 * @file logger.js
 * This module holds the static logger class. It will log to both console
 * and file at differing logging levels. The module holds the logger instance
 * itself.
 */
'use strict';

const config = require('./config.json');
const  winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';

// Create the log directory if it does not exist
if (!fs.existsSync(config['logger-dir'])) { // if the folder is not exist
	fs.mkdirSync(config['logger-dir']); // create one
}

// const tsFormat = function () { // get the current time
//	return (new Date()).toLocaleTimeString();
// };

/**
 * This class sets up the logger to log to both file and console.
 */
class Logger
{
	/**
	 * Constructs the logger class. Sets to log to console and a file and folder
	 * specified in the config.json file. config['logger-dir'] is the directory
	 * and config['logger-file'] is the base filename, this function appends a
	 * '.log' to the end.
	 * @pre None
	 * @post None
	 */
	constructor () {
		this.logger = new (winston.Logger)({
			 transports: [
				 new (winston.transports.Console)({
				     timestamp: true,
					 colorize : true, // colorize the output
					 level : env === 'development' ? 'debug' : 'info' //dynamic level
				 }),
				 new (winston.transports.File)({
					 filename : `${config['logger-dir']}/${config['logger-file']}.log`, // file name
					 timestamp: true, // print out the time
					 level : env === 'development' ? 'debug' : 'info' //dynamic level
				})
			]
		});
	}
	
	/**
	 * Writes an error message to log.
	 * @param msg The message to log.
	 * @pre None
	 * @post None
	 */
	error (msg) {
		this.logger.error(msg);
	}
	
	/**
	 * Writes a warning message to log.
	 * @param msg The message to log.
	 * @pre None
	 * @post None
	 */
	warn (msg) {
		this.logger.warn(msg);
	}
	
	/**
	 * Writes an information message to log.
	 * @param msg The message to log.
	 * @pre None
	 * @post None
	 */
	info (msg) {
		this.logger.info(msg);
	}
	
	/**
	 * Writes a verbose message to log.
	 * @param msg The message to log.
	 * @pre None
	 * @post None
	 */
	verbose(msg) {
		this.logger.verbose(msg);
	}
	
	/**
	 * Writes a debug message to log.
	 * @param msg The message to log.
	 * @pre None
	 * @post None
	 */
	debug (msg) {
		this.logger.debug(msg);
	}
	
	/**
	 * Writes a silly message to log.
	 * @param msg The message to log.
	 * @pre None
	 * @post None
	 */
	silly (msg) {
		this.logger.silly(msg);
	}
}

// the static logger variable
var logger = new Logger()

module.exports = logger;	//export object
