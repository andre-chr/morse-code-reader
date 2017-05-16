'use strict';

const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://morse-code-decoder-213b9.firebaseio.com/"
});

class Firebase
{
	constructor() {
		// As an admin, the app has access to read and write all data, regardless of Security Rules
		this.db = admin.database();
		this.ref = this.db.ref("motionSensorData"); // channel name
		this.resetDb();		//resets database
		this.motionCount = 0;
		this.message = '';
	}


	resetDb() {
		this.ref.set({
			motionCount: 0,
			message: ''
		});
	}

	incMotions() {
		this.motionCount += 1;
		this.ref.update({
			motionCount: this.motionCount
		});
	}

	addLetter(letter) {
		this.message += letter;
		this.ref.update({
			message: this.message
		}).then(() => {
			console.log('Message updated!');
		});
	}
}

module.exports = Firebase;
