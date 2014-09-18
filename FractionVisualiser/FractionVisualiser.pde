Slider setNumerator;
Slider setDenominator;
ShapeSelector shapeSelector;
Wheel wheel1;
Wheel wheel2;
Rectangle rectangle1;
Rectangle rectangle2;
color shadedFill=color(255,0,0);
color emptyFill=color(255,255,170);
int shapeType=0;  // shape being shown (0=circle, 1=rectangle, 2=square)
int diameter;  //display diameter of the shape being drawn
int numShapes=1;  // number of shapes to be displayed (1 or 2)

void setup(){
  size(1024,768);
  background(255);
  if (frame != null) {
    frame.setResizable(true);
  }
  setDenominator=new Slider(1, 12, 7, int(height*0.9));
  setNumerator=new Slider(0, setDenominator.value, 3, int(height*0.1));
  wheel1=new Wheel();
  wheel2=new Wheel();
  rectangle1=new Rectangle();
  rectangle2=new Rectangle();
  shapeSelector=new ShapeSelector();
}

void draw(){
  background(emptyFill);
  setNumerator.hover(mouseX, mouseY);
  setDenominator.hover(mouseX, mouseY);
  setDenominator.ypos=int(height*0.9);
  setNumerator.ypos=int(height*0.1);

  // set numerator slider to match the number of shapes
  setNumerator.max=setDenominator.value*numShapes;
  if (setNumerator.value>setNumerator.max) setNumerator.value=setNumerator.max;    

  // check for user adjustment of fraction values
  if (setNumerator.dragging) setNumerator.drag();
  if (setDenominator.dragging) setDenominator.drag();
  
  setDenominator.display();
  setNumerator.display();
  shapeSelector.display();
  
  switch (shapeType) {
    case 0:  // circle
      if (wheel1.dragging) wheel1.drag();
      if (wheel2.dragging) wheel2.drag();
      if (numShapes==1){
        diameter=int(min(height*0.7, width*0.4));
        wheel1.display(setNumerator.value, setDenominator.value, int(width*0.75), int(height*0.55));
      }
      else if (numShapes==2){
        diameter=int(min(height*0.4, width*0.3));
        wheel1.display(min(setNumerator.value, setDenominator.value), setDenominator.value, int(width*0.75), int(height*0.3));
        wheel2.display(max(setNumerator.value-setDenominator.value,0), setDenominator.value, int(width*0.75), int(height*0.75));
      }
    break;
      
    case 1:  // rectangle
      if (rectangle1.dragging) rectangle1.drag();
      if (rectangle2.dragging) rectangle2.drag();
      if (numShapes==1){
        diameter=int(min(height*0.7, width*0.4));
        rectangle1.display(setNumerator.value, setDenominator.value, int(width*0.75), int(height*0.55));
      }
      else if (numShapes==2){
        diameter=int(min(height*0.4, width*0.3));
        rectangle1.display(min(setNumerator.value, setDenominator.value), setDenominator.value, int(width*0.75), int(height*0.3));
        rectangle2.display(max(setNumerator.value-setDenominator.value,0), setDenominator.value, int(width*0.75), int(height*0.75));
      }

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
      wheel1.clicked(mouseX, mouseY);
      if (numShapes==2) wheel2.clicked(mouseX, mouseY);
    break;
    
    case 1:  // square shape
      rectangle1.clicked(mouseX, mouseY);
      if (numShapes==2) rectangle2.clicked(mouseX, mouseY);
    break;
  }
  shapeSelector.clicked(mouseX, mouseY);  // do this after the shape-specific behaviour as it changes the selected shape
  
}

void mouseReleased() {
  setNumerator.dragging = false;
  setDenominator.dragging = false;
  wheel1.dragging = false;
  wheel2.dragging = false;
  rectangle1.dragging = false;
  rectangle2.dragging = false;
}

