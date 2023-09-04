// Program 1:

// String myName;
// String msg = "What is your Name? ";
// String msg2 = "Hello ";
// String msg3 = ", Welcome to Arduino!";



// void setup() {
//   // put your setup code here, to run once:
//   Serial.begin(9600);

// }

// void loop() {
//   // put your main code here, to run repeatedly:
  
//   //Ask
//   Serial.println(msg);
  
//   while(Serial.available()==0){
//     //Wait
//   }

//   //Read
//   myName = Serial.readString();


//   //output
//   Serial.print(msg2);
//   Serial.print(myName);
//   Serial.println(msg3);
// }



// Program 2:

String msg = "What color LED would you like to blink ?";
String myColor;
int redPin = 8;
int bluePin = 12;
int greenPin = 13;




void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

}

void loop() {
  // put your main code here, to run repeatedly:

  //Ask
  Serial.println(msg);
  
  while(Serial.available()==0){
    //Wait
  }

  //Read
  myColor = Serial.readString();
  myColor.toLowerCase(); // Convert to lowercase for case insensitivity
  Serial.println(myColor);


  //output
  if(myColor=="red"){
      digitalWrite(redPin, HIGH);
      digitalWrite(greenPin, LOW);
      digitalWrite(bluePin, LOW);

    
  }

  if(myColor=="blue"){
      digitalWrite(redPin, LOW);
      digitalWrite(greenPin, LOW);
      digitalWrite(bluePin, HIGH);
  }

  if(myColor=="green"){
      digitalWrite(redPin, LOW);
      digitalWrite(greenPin, HIGH);
      digitalWrite(bluePin, LOW);
  }
}
