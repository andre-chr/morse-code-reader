/**
 * @file firebase.js
 * The firebase controller, contains the class that handles the connection to
 * firebase and the writing of data to the database for client communication.
 */
'use strict';

const admin = require('firebase-admin');
// Fetch the service account key JSON file contents
const serviceAccount = require('./serviceAccountKey.json');
var logger = require('./logger.js');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://morse-code-decoder-213b9.firebaseio.com/"
});

/**
 * Handles the connection to the server.
 */
class Firebase
{
	/**
	 * Constructs the firebase object.
     * @pre Firebase initialised
     * @post None
	 */
	constructor() {
		// As an admin, the app has access to read and write all data, regardless of Security Rules
		this.db = admin.database();
		this.ref = this.db.ref('morseCodeData'); // channel name
		this.resetDb();		//resets database
		this.motionCount = 0;
		this.message = '';
	}

	/**
	 * Reset the database, setting up for a new message to be sent.
	 * @pre this.ref is set
	 * @post None
	 */
	resetDb() {
		this.ref.set({
			motionCount: 0,
			message: ''
		});
	}

	/**
	 * Increase the motion detected counter, and sends to database.
	 * @pre None
	 * @post None
	 */
	incMotions() {
		this.motionCount += 1;
		this.ref.update({
			motionCount: this.motionCount
		});
		logger.silly('motion counter updated!')
	}

	/**
	 * Adds a leeter to the message, and updates the database with the new
	 * message.
	 * @pre None
	 * @post None
	 */
	addLetter(letter) {
		this.message += letter;
		this.ref.update({
			message: this.message
		}).then(() => {
			logger.silly('Message updated!');
		});
	}
}

module.exports = Firebase;
