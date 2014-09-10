Slider setNumerator;
Slider setDenominator;
ShapeSelector shapeSelector;
Wheel wheel;
Rectangle rectangle;
color shadedFill=color(128,128,255);
color emptyFill=color(255);
int shapeType=0;  // shape being shown (0=circle, 1=rectangle, 2=square)
int diameter;  //display diameter of the shape being drawn

void setup(){
  size(1024,768);
  background(255);
  if (frame != null) {
    frame.setResizable(true);
 }
 setDenominator=new Slider(1, 16, 7, int(height*0.9));
 setNumerator=new Slider(1, setDenominator.value, 3, int(height*0.1));
 wheel=new Wheel();
 rectangle=new Rectangle();
 shapeSelector=new ShapeSelector();
}

void draw(){
  background(255);
  setDenominator.ypos=int(height*0.9);
  setNumerator.ypos=int(height*0.1);
  diameter=int(min(height*0.7, width*0.4));

  // check for user adjustment of fraction values
  if (setNumerator.dragging) setNumerator.drag();
  if (setDenominator.dragging){
    setDenominator.drag();
    setNumerator.max=setDenominator.value;
    if (setNumerator.value>setNumerator.max) setNumerator.value=setNumerator.max;
  }

  setDenominator.display();
  setNumerator.display();
  shapeSelector.display();
  
  switch (shapeType) {
    case 0:  // circle
      if (wheel.dragging) wheel.drag();
      wheel.display(setNumerator.value, setDenominator.value);      
    break;
      
    case 1:  // rectangle
      if (rectangle.dragging) rectangle.drag();
      rectangle.display(setNumerator.value, setDenominator.value);
    break;
  }
  
  // draw fraction
  fill(0);
  textSize(height*0.3);
  strokeWeight(height/20);
  strokeCap(SQUARE);
  line(width*0.12, height*0.5, width*0.38, height*0.5);
  textAlign(CENTER, CENTER);
  text(str(setNumerator.value), width*0.25, height*0.3);
  text(str(setDenominator.value), width*0.25, height*0.65);

  // show feedback contact details
  pushMatrix();
    translate(0,0);
    rotate(PI*0.5);
    textSize (height/35);
    textAlign(BOTTOM, LEFT);
    fill(0);
    text("Suggestions and feedback to Chris.Heddles@asms.sa.edu.au", width/100,-height/80);
  popMatrix();
 }

void mousePressed() {
  setNumerator.clicked(mouseX,mouseY);
  setDenominator.clicked(mouseX,mouseY);
  switch (shapeType) {
    case 0:  // circle shape
      wheel.clicked(mouseX, mouseY);
    break;
    
    case 1:  // square shape
      rectangle.clicked(mouseX, mouseY);
    break;
  }
  shapeSelector.clicked(mouseX, mouseY);  // do this after the shape-specific behaviour as it changes the selected shape
  
}

void mouseReleased() {
  setNumerator.dragging = false;
  setDenominator.dragging = false;
  wheel.dragging = false;
  rectangle.dragging = false;
}

