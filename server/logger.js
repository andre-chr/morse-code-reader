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

class Logger
{	
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

var logger = new Logger()

module.exports = logger;	//export object