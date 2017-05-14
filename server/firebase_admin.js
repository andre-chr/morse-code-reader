const admin = require('firebase-admin');

// Fetch the service account key JSON file contents
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project1-9aa9d.firebaseio.com"  // IMPORTANT: repalce the url with yours 
});

function Firebase() {
	// As an admin, the app has access to read and write all data, regardless of Security Rules
	this.db = admin.database();
	this.ref = db.ref("motionSensorData"); // channel name
	this.resetDb();		/resets database
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

Firebase.prototype.updateMessage = function(msg) {
	this.ref.update({
		message: msg
	}).then(
		console.log('Message updated!');
	);
}

module.exports = Firebase;
