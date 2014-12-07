// FractionVisualiser                                                                       //
// A lightweight way to explore the relationship between the algebraic form                 //
// and two different area representations for fractions between 0 and 2                     //
// Additionallly, the early parts of the code are structured and commented to encourage     //
// novice programmers to make modest changes with minimal risk of completely breaking the   //
// app. Of course, any such breakages are easily fixed by restoring to the downloaded       //
// version.                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////
// by Chris Heddles, 2014                                                                   //
// Please send any feedback and suggestions to Chris.Heddles@asms.sa.edu.au                 //
// Full source repository is at https://github.com/Cheddles/FractionVisualiser              //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
//This file is part of Fraction Visualiser.                                                 //
//                                                                                          //
//  FractionVisualiser is free software: you can redistribute it and/or modify              //
//  it under the terms of the GNU General Public License as published by                    //
//  the Free Software Foundation, either version 3 of the License, or                       //
//  (at your option) any later version.                                                     //
//                                                                                          //
//  FractionVisualiser is distributed in the hope that it will be useful,                   //
//  but WITHOUT ANY WARRANTY; without even the implied warranty of                          //
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                           //
//  GNU General Public License for more details.                                            //
//                                                                                          //
// You should have received a copy of the GNU General Public License                        //
//  along with FractionVisualiser.  If not, see <http://www.gnu.org/licenses/>.             //
//////////////////////////////////////////////////////////////////////////////////////////////


// These values are the ones that can be safely changed without breaking the program. Leave the variable names alone - just change the values
color shadedFill=color(128,128,255);  // the fill colour (RGB) for shape sections that are "selected" by the fraction
color backGround=color(255, 255, 255);  // the fill colour (RGB) for background and shape sections that are not "selected" by the fraction.
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

void setup(){
  size(initialWindowWidth,inititalWindowHeight);
  background(backGround);
  if (frame != null) {  // check for environment that allows window resizing
    frame.setResizable(true);
  }
  setDenominator=new Slider(1, maxDenominator, 7, int(height*0.9));  // initialise denominator slider with suitable starting values
  setNumerator=new Slider(0, setDenominator.value, 3, int(height*0.1));  // initialise denominator slider with suitable starting values
  wheel1=new Wheel();
  wheel2=new Wheel();
  rectangle1=new Rectangle();
  rectangle2=new Rectangle();
  shapeSelector=new ShapeSelector();
}

void draw(){
  background(backGround);  // wipe the screen clear
  // detect for mouseover of the sliders (to indicate UI controls)
  setNumerator.hover(mouseX, mouseY);
  setDenominator.hover(mouseX, mouseY);
  
  // reset slider locations (in case of window resize)
  setDenominator.ypos=int(height*0.9);
  setNumerator.ypos=int(height*0.1);

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
        diameter=int(min(height*0.7, width*0.4));
        wheel1.display(setNumerator.value, setDenominator.value, int(width*0.75), int(height*0.5));
      }
      else if (numShapes==2){
        diameter=int(min(height*0.4, width*0.3));
        wheel1.display(min(setNumerator.value, setDenominator.value), setDenominator.value, int(width*0.75), int(height*0.3));
        wheel2.display(max(setNumerator.value-setDenominator.value,0), setDenominator.value, int(width*0.75), int(height*0.75));
      }
    break;
      
    case 1:  // square
      if (rectangle1.dragging) rectangle1.drag();
      if (rectangle2.dragging) rectangle2.drag();
      if (numShapes==1){
        diameter=int(min(height*0.7, width*0.4));
        rectangle1.display(setNumerator.value, setDenominator.value, int(width*0.75), int(height*0.5));
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
    translate(width*0.02,height*0.5);
    rotate(PI*0.5);
    textSize (height/35);
    textAlign(CENTER, CENTER);
    fill(0);
    text("Designed an coded by Chris Heddles (Chris.Heddles@asms.sa.edu.au)", 0, 0);
  popMatrix();
 }

void mousePressed() {  // check to see if anything should be moved (depending on mouse location when clicked)
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
  // stop any dragging (it's quicker to stop all than to check if any are currently being dragged)
  setNumerator.dragging = false;
  setDenominator.dragging = false;
  wheel1.dragging = false;
  wheel2.dragging = false;
  rectangle1.dragging = false;
  rectangle2.dragging = false;
}

