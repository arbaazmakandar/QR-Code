String msg = "How many blinks do you want: ";
int redPin = 13;
int numBlinks;
int delayTime = 1000;



void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:
  // To get data from serial port
  // 1. Ask
  // 2. Wait
  // 3. Read
  
  //Ask
  Serial.println(msg);

  while(Serial.available() == 0){
    // While the person has not entered anything, we should wait
  }
  //Read the number
  numBlinks = Serial.parseInt();
  // OR Serial.parseFloat();

  
  for(int i=0;i<numBlinks;i++){
    digitalWrite(redPin, HIGH);
    delay(delayTime);
    digitalWrite(redPin,LOW);
    delay(delayTime);
  }


}
