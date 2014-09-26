import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class FractionVisualiser extends PApplet {

// This lightweight fraction visualiser was written by Chris Heddles in 2014 and is licenced under the GPL(v3)
// Please send any feedback and suggestions to chris.heddles@asms.sa.edu.au

// Full source repository is at https://github.com/Cheddles/FractionVisualiser

// These values are the ones that can be safely changed without breaking the program. Leave the variable names alone - just change the values
int shadedFill=color(128,128,255);  // the fill colour (RGB) for shape sections that are "selected" by the fraction
int backGround=color(250, 250, 250);  // the fill colour (RGB) for background and shape sections that are not "selected" by the fraction.
int shapeType=0;  // shape being shown (0=circle, 1=square) - starts with the value assigned
int numShapes=1;  // number of shapes to be displayed (1 or 2)
int maxDenominator=12;  // The maximum number of pieces that each shape can be divided up into. Very high values for this make it hard to
                        // set precise values with the sliders during runtime
int initialWindowWidth=1024;  // starting width of the display window (can be resized by the user)
int inititalWindowHeight=768;  // starting height of the display window (can be resized by the user)
// end of easily-changed code

// Global variables
Slider setNumerator;  // the slider used to set the value of the numerator
Slider setDenominator;  // the slider used to set the value of the denominator
ShapeSelector shapeSelector;  // the object containing the shape type and number selector buttons
Wheel wheel1;  // the wheel for single shape and the top wheel for two-shape mode
Wheel wheel2;  // lower wheel for two-shape mode (not displayed in single-shape mode
Rectangle rectangle1;  // the rectangle for single shape and the top rectangle for two-shape mode
Rectangle rectangle2;  // lower rectange for two-shape mode (not displayed in single-shape mode
int diameter;  //display diameter of the shape being drawn

public void setup(){
  size(initialWindowWidth,inititalWindowHeight);
  background(backGround);
  if (frame != null) {  // check for environment that allows window resizing
    frame.setResizable(true);
  }
  setDenominator=new Slider(1, maxDenominator, 7, PApplet.parseInt(height*0.9f));  // initialise denominator slider with suitable starting values
  setNumerator=new Slider(0, setDenominator.value, 3, PApplet.parseInt(height*0.1f));  // initialise denominator slider with suitable starting values
  wheel1=new Wheel();
  wheel2=new Wheel();
  rectangle1=new Rectangle();
  rectangle2=new Rectangle();
  shapeSelector=new ShapeSelector();
}

public void draw(){
  background(backGround);  // wipe the screen clear
  // detect for mouseover of the sliders (to indicate UI controls)
  setNumerator.hover(mouseX, mouseY);
  setDenominator.hover(mouseX, mouseY);
  
  // reset slider locations (in case of window resize)
  setDenominator.ypos=PApplet.parseInt(height*0.9f);
  setNumerator.ypos=PApplet.parseInt(height*0.1f);

  // check for user adjustment of fraction values
  if (setDenominator.dragging) setDenominator.drag();
  if (setNumerator.value>setDenominator.value*numShapes) setDenominator.value=setDenominator.value+1;  // to stop the fraction exceeding the available number of shapes on the screen
  if (setNumerator.dragging) setNumerator.drag();

  // set numerator slider to match the maximum available (set by denominator and number of shapes)
  setNumerator.max=setDenominator.value*numShapes;
  
  // display sliders and shape selector (as these are always displayed)
  setDenominator.display();
  setNumerator.display();
  shapeSelector.display();
  
  // display shapes according to the user-selected options of type and number
  switch (shapeType) {
    case 0:  // circle
      if (wheel1.dragging) wheel1.drag();
      if (wheel2.dragging) wheel2.drag();
      if (numShapes==1){
        diameter=PApplet.parseInt(min(height*0.7f, width*0.4f));
        wheel1.display(setNumerator.value, setDenominator.value, PApplet.parseInt(width*0.75f), PApplet.parseInt(height*0.5f));
      }
      else if (numShapes==2){
        diameter=PApplet.parseInt(min(height*0.4f, width*0.3f));
        wheel1.display(min(setNumerator.value, setDenominator.value), setDenominator.value, PApplet.parseInt(width*0.75f), PApplet.parseInt(height*0.3f));
        wheel2.display(max(setNumerator.value-setDenominator.value,0), setDenominator.value, PApplet.parseInt(width*0.75f), PApplet.parseInt(height*0.75f));
      }
    break;
      
    case 1:  // square
      if (rectangle1.dragging) rectangle1.drag();
      if (rectangle2.dragging) rectangle2.drag();
      if (numShapes==1){
        diameter=PApplet.parseInt(min(height*0.7f, width*0.4f));
        rectangle1.display(setNumerator.value, setDenominator.value, PApplet.parseInt(width*0.75f), PApplet.parseInt(height*0.5f));
      }
      else if (numShapes==2){
        diameter=PApplet.parseInt(min(height*0.4f, width*0.3f));
        rectangle1.display(min(setNumerator.value, setDenominator.value), setDenominator.value, PApplet.parseInt(width*0.75f), PApplet.parseInt(height*0.3f));
        rectangle2.display(max(setNumerator.value-setDenominator.value,0), setDenominator.value, PApplet.parseInt(width*0.75f), PApplet.parseInt(height*0.75f));
      }

    break;
  }
  
  // draw fraction
  fill(0);
  textSize(height*0.3f);
  strokeWeight(height/20);
  strokeCap(SQUARE);
  line(width*0.12f, height*0.5f, width*0.38f, height*0.5f);
  textAlign(CENTER, CENTER);
  text(str(setNumerator.value), width*0.25f, height*0.3f);
  text(str(setDenominator.value), width*0.25f, height*0.65f);

  // show feedback contact details
  pushMatrix();
    translate(width*0.02f,height*0.5f);
    rotate(PI*0.5f);
    textSize (height/30);
    textAlign(CENTER, CENTER);
    fill(0);
    text("Suggestions and feedback to Chris.Heddles@asms.sa.edu.au", 0, 0);
  popMatrix();
 }

public void mousePressed() {  // check to see if anything should be moved (depending on mouse location when clicked)
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

public void mouseReleased() {
  // stop any dragging (it's quicker to stop all than to check if any are currently being dragged)
  setNumerator.dragging = false;
  setDenominator.dragging = false;
  wheel1.dragging = false;
  wheel2.dragging = false;
  rectangle1.dragging = false;
  rectangle2.dragging = false;
}

class Rectangle{
  int sideLength;  //length of a single side
  int xpos;  // x-coordinate of the shape centre
  int ypos;  // y-coordinate of the shape centre
  float angle=0;  // the angle from which the drawing is started
  boolean dragging=false;  // whether or not the shae is being rotated
  boolean clickedOnce=false;  // if this control has been clicked once (to display control instructions)
  float dragOffset;  // the angle offset when the mouse is clicked to drag

  Rectangle(){
  }
  
  public void display(int numerator,int denominator, int xCentre, int yCentre){
    sideLength = PApplet.parseInt(pow(0.25f*PI*diameter*diameter,0.5f));  // calculate the side length of the square from the corner to corner diameter
    xpos=xCentre;
    ypos=yCentre;
    strokeWeight(max(1,PApplet.parseInt(((height+width)/200-denominator*(height+width)/6000)/2)));  // roughly scale line thickness with number of segments
    stroke(0);
    fill(shadedFill);  // start with filled segments
    pushMatrix();
        translate(xpos,ypos);
        rotate(angle);
      if (setDenominator.value==1){
        if (numerator==0) fill(backGround);
        rect(0, 0, sideLength, sideLength);
      }
      else{
        for(int i=0; i<setDenominator.value; i++){
          if(i==numerator) fill(backGround);  //switch to "empty" segments
          rect(0, (-0.5f*sideLength)+(i+0.5f)*(sideLength/denominator), sideLength, sideLength/denominator);          
        }
      } 
    popMatrix();
    
    // show drag-to-rotate instruction if not rotated yet
    if (!clickedOnce){
      pushMatrix();
        translate(xCentre-(diameter*0.6f),yCentre);
        rotate(PI*1.5f);
        textSize (diameter/12);
        textAlign(CENTER, CENTER);
        fill(127);
        text("drag shape to rotate", 0, 0);
      popMatrix();
    }
  }

  public void clicked(int mx, int my) {
    float dClick = 2*pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5f);  // accept any click within the nominal diameter as a "hit" for dragging
    int dDrawn = PApplet.parseInt(1.42f*diameter);

    if ((dClick < dDrawn)&&(dClick>20)) {
      clickedOnce=true;
      dragging = true;
      dragOffset = findAngle(mx-xpos, my-ypos)-angle;  // angle between current angle of rotation and the angle of click
      if (dragOffset<0) dragOffset=dragOffset+(2*PI);  //if angle goes below 0 then add a full circle to return to positive angle
      if (dragOffset>2*PI) dragOffset=dragOffset-(2*PI);  //if angle goes above a full circle then subtract a full circle
    }
  }
  
  public void drag() {
    angle = findAngle(mouseX-xpos, mouseY-ypos) - dragOffset;
    // reset angle if it goes outside the range 0 to 2*pi
    if (angle>(2*PI)) angle=angle-(2*PI);
    if (angle<0) angle=angle+(2*PI);
  }

  // inverse tangent function with correction for angles outside the first quadrant.
  public float findAngle(int x, int y){
    float clickAngle = atan(PApplet.parseFloat(y)/PApplet.parseFloat(x));
    if (x<0) clickAngle = clickAngle+PI;
    if (clickAngle>(2*PI)) clickAngle=clickAngle-(2*PI);
    if (clickAngle<0) clickAngle=clickAngle+(2*PI);
    return clickAngle;
  }  
}
class ShapeSelector{
int xPos1;
int yPos1;
int xPos2;
int yPos2;
int xPos3;
int yPos3;
int size;
boolean shapeSelected=false;  // if the shape has been changed (to display control instructions)
boolean numberSelected=false;  // if a second shape has been selected (to display control instructions)

  ShapeSelector(){
  }
  
  public void display(){
    xPos1 = PApplet.parseInt(width*0.6f);
    yPos1 = PApplet.parseInt(height*0.06f);
    xPos2 = PApplet.parseInt(width*0.94f);
    yPos2 = PApplet.parseInt(height*0.06f);
    xPos3 = PApplet.parseInt(width*0.95f);
    yPos3 = PApplet.parseInt(height*0.92f);
    size=min(PApplet.parseInt(height*0.1f),120);

    // display shape selection symbools
    rectMode(CENTER);
    stroke(0);
    strokeWeight(1);
    fill(255);
    fill(shadedFill);
    ellipse(xPos1, yPos1, size, size);
    rect(xPos2, yPos2, size, size);
    
    // display +1 or -1 option to select number of shapes to display
    fill(0);
    textSize(size);
    textAlign(CENTER, CENTER);
    if (numShapes==1) text("+", xPos3, yPos3);
    if (numShapes==2) text("-", xPos3, yPos3);
    
    // display instructions for unused controls
    if (!shapeSelected) {
      fill(127);
      textSize(size*0.4f);
      textAlign(CENTER);
      text("Click the shape", (xPos1+xPos2)/2, yPos1*0.9f);
      text("you want to use", (xPos1+xPos2)/2, yPos1*1.5f);
    }
    if (!numberSelected) {
      fill(127);
      textAlign(RIGHT);
      textSize(size*0.4f);
      text("Add another shape ->", xPos3*0.95f, yPos3*1.03f);
    }
  }
  
  public void clicked(int mx, int my) {
    float d = 2*pow(pow(mx-xPos1,2)+pow(my-yPos1,2),0.5f);
    if ((d < size)&&(shapeType!=0)){
      shapeType=0;
      shapeSelected=true;
    }
    else if (mx>(xPos2-size/2)&&(mx<(xPos2+size/2))&&my>(yPos2-size/2)&&(my<(yPos2+size/2))&&(shapeType!=1)){
      shapeType=1;
      shapeSelected=true;
    }
    else if (mx>(xPos3-size/2) && (my>(yPos3-size/2))) {
      if (numShapes==1) numShapes=2;
      else if (numShapes==2) numShapes=1;
      numberSelected=true;
    }
  }
}
class Slider{
 
 int max;  // maximum on the slider line
 int min;  // minimum value on the slider line
 int value;  // current value
 int xpos;  // x-coordinate of the selection ball
 int ypos;  // y-coordinate of the line and selection ball
 int ballDiameter;
 boolean dragging=false;
 boolean mouseOver=true;
 boolean clickedOnce=false;
 int dragOffset;  //horizontal offset of the mouse from the ball centre when dragging
 int xmin;  // left end of slider line
 int xmax;  // right end of slider line
    
 Slider(int minValue, int maxValue, int startValue, int verticalLocation){
   //to make available to methods
   max=maxValue;
   min=minValue;
   ypos=verticalLocation;
   value=startValue;
 }

  public void display(){
    stroke(0);
    // recalculate dimensions each time in case window has been resized
    strokeWeight(PApplet.parseInt(height/100));
    xmin=PApplet.parseInt(width*0.1f);
    xmax=PApplet.parseInt(width*0.5f);
    ballDiameter = PApplet.parseInt(min(height/12, width/20));
    xpos = max(PApplet.parseInt(PApplet.parseFloat(value-min)/PApplet.parseFloat(max-min)*(xmax-xmin)+xmin),xmin);
    line(xmin,ypos,xmax,ypos);
    
    // display slider
    fill(0);
    if (mouseOver) fill(255);
    ellipse(xpos,ypos,ballDiameter,ballDiameter);
    drawArrow();
    
    // display instructions if slider has not yet been used
    if (!clickedOnce) {
      textSize(height*0.028f);
      fill(127);
      text("drag to adjust value", (xmin+xmax)/2, ypos-height*0.065f);
    }
  }
  
  public void clicked(int mx, int my) {
    float d = pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5f);
    if (d < ballDiameter) {
      dragging = true;
      clickedOnce=true;
      dragOffset = xpos-mx;
    }
  }
  
  public void drag() {
      int newloc = mouseX + dragOffset;
      //stop out of range dragging
      if (newloc>xmax) newloc=xmax;
      if (newloc<xmin) newloc=xmin;
      
      //check to see if moved far enough for integer change
      if ((newloc-xpos)>(xmax-xmin)/(2*(max-min))) value++;
      if ((xpos-newloc)>(xmax-xmin)/(2*(max-min))) value--;

  }
  
  public void hover(int mx, int my) {
    float d = pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5f);
    if (d < ballDiameter) {
      mouseOver = true;
    }
    else {
      mouseOver = false;
    }
  }
  
  public void drawArrow(){
    // draw a red arrow indicating slider motion
    stroke(255,0,0);
    strokeWeight(10);
    strokeCap(ROUND);
    line(xpos-ballDiameter,ypos,xpos+ballDiameter,ypos);
    line(xpos+ballDiameter,ypos,xpos+ballDiameter*0.7f,(ypos-ballDiameter*0.5f));
    line(xpos-ballDiameter,ypos,xpos-ballDiameter*0.7f,(ypos-ballDiameter*0.5f));
    line(xpos+ballDiameter,ypos,xpos+ballDiameter*0.7f,(ypos+ballDiameter*0.5f));
    line(xpos-ballDiameter,ypos,xpos-ballDiameter*0.7f,(ypos+ballDiameter*0.5f));
    
    fill(0,0,0,100);
    strokeWeight(0);
    ellipse(xpos,ypos,ballDiameter,ballDiameter);
    strokeWeight(5);
  }
}
class Wheel{
  int xpos;  // x-coordinate of wheel centre
  int ypos;  // y-coordinate of wheel centre
  float startAngle=1.5f*PI;  // the angle from which the drawing is started
  boolean dragging=false;
  boolean clickedOnce=false;  // if this control has been clicked once (to display control instructions)
  float dragOffset;  // the angle offset when the mouse is clicked to drag
  
  Wheel(){
  }
  
  public void display(int numerator,int denominator, int xCentre, int yCentre){
    
    float angle;  // rotation angle required to draw segments and dividing lines
    strokeWeight(max(1,PApplet.parseInt(((height+width)/200-denominator*(height+width)/6000)/2)));  // roughly scale line thickness with number of segments
    stroke(0);
    // transfer to class variables to make visible to other class methods
    xpos = xCentre;
    ypos = yCentre;
    angle=startAngle;
    fill(shadedFill);  // start with filled segments
    
    if (denominator==1){
      if (numerator==0) fill(backGround);
      ellipse(xpos, ypos, diameter, diameter);
    }
    else{
      for(int i=0; i<denominator; i++){
        if (angle>(2*PI)) angle=angle-(2*PI);  //reset angle once over 2*PI
        if(i==numerator) fill(backGround);  //switch to "empty" segments
     
        arc(xpos, ypos, diameter, diameter, angle, angle+(2*PI/denominator), PIE);
        angle=angle+(2*PI)/denominator;
      }
    }
  // show rotate instruction if not rotated yet
    if (!clickedOnce){
      pushMatrix();
        translate(xCentre-(diameter*0.6f),yCentre);
        rotate(PI*1.5f);
        textSize (diameter/12);
        textAlign(CENTER, CENTER);
        fill(127);
        text("drag shape to rotate", 0, 0);
      popMatrix();
    }
  }
  
  public void clicked(int mx, int my) {
    float r = pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5f);
    if (((2*r) < diameter)&&(r>10)) {
      dragging = true;
      clickedOnce=true;
      dragOffset = findAngle(mx-xpos, my-ypos)-startAngle;
      if (dragOffset<0) dragOffset=dragOffset+(2*PI);
    }
  }
  
  public void drag() {
    startAngle = findAngle(mouseX-xpos, mouseY-ypos) - dragOffset;
    if (startAngle>(2*PI)) startAngle=startAngle-(2*PI);
    if (startAngle<0) startAngle=startAngle+(2*PI);
  }
  
  // inverse tangent function with correction for angles outside the first quadrant.
  public float findAngle(int x, int y){
    float clickAngle = atan(PApplet.parseFloat(y)/PApplet.parseFloat(x));
    if (x<0) clickAngle = clickAngle+PI;
    if (clickAngle>(2*PI)) clickAngle=clickAngle-(2*PI);
    if (clickAngle<0) clickAngle=clickAngle+(2*PI);
    return clickAngle;
  }
  
}
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "FractionVisualiser" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
