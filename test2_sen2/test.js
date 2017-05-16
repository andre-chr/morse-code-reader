console.log('Senario 2 - Test Case 2');

const Simulator = require('../server/simulator.js');		//import simulator
const MorseDecoder = require('../server/morse_decoder.js'); //import MorseDecoder class

var testMessage = 'ABC DEFGHI JKLMNOP QRST UVW X Y Z';
var newMessage = '';

var board = new Simulator(testMessage);
var decoder = new MorseDecoder();

// logs and adds a new letter to the message in firebase
decoder.on('letter', (letter) => {
    newMessage += letter;
    if (newMessage === testMessage)
        console.log('Test successful');
    else
        console.log('current message', newMessage);
});
// connects the board to the decoder, so that the decoder can recieve signals
decoder.connect(board);
// opens up a connection to the board, this is where the program will really start
board.open();
