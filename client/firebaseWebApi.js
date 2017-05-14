function Client() {
  this.checkSetup();
  this.initFirebase();
  this.loadMessages();
}

  Client.prototype.initFirebase = function () {
    this.database = firebase.database();
    this.storage = firebase.storage();
  };


  Client.prototype.loadMessages = function () {
    // Reference to the /messages/ database path.
    this.motionRef = this.database.ref('motionSensorData');
    // Make sure we remove all previous listeners.
    this.motionRef.off();

    // Loads the last 50 messages and listen for new ones.
    var setMessage = function (data) {
      var val = data.val();
      this.displayMessage(val.motionCount, val.charCount, val.message);
    }.bind(this);
    this.motionRef.on('value', setMessage);
  };

  Client.prototype.displayMessage = function (motionCount, charCount, message) {
    document.getElementById('no-of-motion').innerText = motionCount;
	document.getElementById('no-of-char').innerText = charCount;
	document.getElementById('message').innerText = message;
  };


  // Checks that the Firebase SDK has been correctly setup and configured.
  Client.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
      window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
    } else if (config.storageBucket === '') {
      window.alert('Your Firebase Storage bucket has not been enabled.');
    }
  };


window.onload = function () {
  window.Client = new Client();
};
