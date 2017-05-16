var winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log'; // to create a log folder

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) { // if the folder is not exist
	fs.mkdirSync(logDir); // create one
}

const tsFormat = function () { // get the current time
		return (new Date()).toLocaleTimeString();
};
	
class Logger
{	
	constructor (filename) {
		this.logger = new (winston.Logger)({
			 transports: [
				 new (winston.transports.Console)({
					 timestamp: tsFormat(), // print out the time
					 colorize : true, // colorize the output
					 level : env === 'development' ? 'debug' : 'info' //dynamic level
				 }),
				 new (winston.transports.File)({
					 filename : logDir + '/logfile-' + filename + '.txt', // file name
					 timestamp: tsFormat(), // print out the time
					 level : env === 'development' ? 'debug' : 'info' //dynamic level
				})
			]
		});
	}
	
	error (msg) {
		this.logger.error(msg);
	}
	
	warn (msg) {
		this.logger.warn(msg);
	}
	
	info (msg) {
		this.logger.info(msg);
	}
	
	verbose(msg) {
		this.logger.verbose(msg);
	}
	
	debug (msg) {
		this.logger.debug(msg);
	}
	
	silly (msg) {
		this.logger.silly(msg);
	}
}

module.exports = Logger;	//export object