const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://morse-code-decoder-213b9.firebaseio.com/"
});

function Firebase() {
	// As an admin, the app has access to read and write all data, regardless of Security Rules
	this.db = admin.database();
	this.ref = this.db.ref("motionSensorData"); // channel name
	this.resetDb();		//resets database
}

Firebase.prototype.resetDb = function() {
	this.ref.set({
		motionCount: 0,
		message: ''
	});
}

Firebase.prototype.updateCount = function(count) {
	this.ref.update({
		motionCount: count
	});
}

Firebase.prototype.updateMessage = function(msg) {
	this.ref.update({
		message: msg
	});
}

module.exports = Firebase;
