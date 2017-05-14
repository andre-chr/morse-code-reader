int motionPin = 7;       // the pin the motion data is read from
int motionState = LOW;   // the current/last state of the motion
int tmp = 0;             // a temperary value

void setup() {
  pinMode(motionPin, INPUT);     // declare sensor as input
  Serial.begin(9600);
}

void loop(){
  tmp = digitalRead(motionPin);  // read input value
  if ((tmp == LOW) != (motionState == LOW)) { // checks if the read value is different to the last recorded pinstate
    if (tmp == LOW) {
      // motion off
      Serial.println("0");
    } else {
      // motion on
      Serial.println("1");
    }
    motionState = tmp;
  }
}

