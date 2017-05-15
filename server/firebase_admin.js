'use strict';

const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project1-9aa9d.firebaseio.com"  // IMPORTANT: repalce the url with yours 
});

class Firebase
{
	constructor() {
		// As an admin, the app has access to read and write all data, regardless of Security Rules
		this.db = admin.database();
		this.ref = this.db.ref("motionSensorData"); // channel name
		this.resetDb();		//resets database
	}

	resetDb() {
		this.ref.set({
			motionCount: 0,
			message: ''
		});
	}

	updateCount(count) {
		this.ref.update({
			motionCount: count
		});
	}

	updateMessage(msg) {
		this.ref.update({
			message: msg
		}).then(() => {
			console.log('Message updated!');
		});
	}
}

module.exports = Firebase;
