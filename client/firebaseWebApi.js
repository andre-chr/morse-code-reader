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
  this.morseCodeRef = this.database.ref('morseCodeData');		//get database reference
  this.morseCodeRef.off();		//remove listeners

  var setMessage = function (data) {
    var val = data.val();
    this.displayMessage(val.motionCount, val.message);
  }.bind(this);
  this.morseCodeRef.on('value', setMessage);
};

Client.prototype.displayMessage = function (motionCount, message) {
  document.getElementById('no-of-motion').innerText = motionCount;		//update count
  document.getElementById('message').innerText = '"' + message + '"';	//update message
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
