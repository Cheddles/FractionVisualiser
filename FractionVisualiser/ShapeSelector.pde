class ShapeSelector{
int xPos1;
int yPos1;
int xPos2;
int yPos2;
int xPos3;
int yPos3;
int size;
boolean shapeSelected=false;  // if the shape has been changed (to display control instructions)
boolean plus1Selected=false;  // if a second shape has been selected (to display control instructions)
boolean minus1Selected=false;

  ShapeSelector(){
  }
  
  void display(){
    xPos1 = int(width*0.6);
    yPos1 = int(height*0.06);
    xPos2 = int(width*0.94);
    yPos2 = int(height*0.06);
    xPos3 = int(width*0.95);
    yPos3 = int(height*0.92);
    size=min(int(height*0.1),120);

    // display shape selection symbools
    rectMode(CENTER);
    stroke(0);
    strokeWeight(1);
    fill(255);
    fill(shadedFill);
    ellipse(xPos1, yPos1, size, size);
    rect(xPos2, yPos2, size, size);
    
    // display + or - option to select number of shapes to display
    fill(0);
    textSize(size);
    textAlign(CENTER, CENTER);
    if (numShapes==1) text("+", xPos3, yPos3);
    if (numShapes==2) text("-", xPos3, yPos3);
    
    // display instructions for unused controls
    if (!shapeSelected) {
      fill(127);
      textSize(size*0.4);
      textAlign(CENTER);
      text("Click the shape", (xPos1+xPos2)/2, yPos1*0.9);
      text("you want to use", (xPos1+xPos2)/2, yPos1*1.5);
    }
    if (!plus1Selected) {
      fill(127);
      textAlign(RIGHT);
      textSize(size*0.4);
        text("Add another shape ->", xPos3*0.95, yPos3*1.03);
    }
    else if (!minus1Selected) {
      fill(127);
      textAlign(RIGHT, CENTER);
      textSize(size*0.4);
      pushMatrix();
        translate(xPos3, yPos3*0.98);
        rotate(PI/2);
        text("Remove one shape ->", 0,0);
      popMatrix();
    }
  }
  
  void clicked(int mx, int my) {
    float d = 2*pow(pow(mx-xPos1,2)+pow(my-yPos1,2),0.5);
    if ((d < size)&&(shapeType!=0)){
      shapeType=0;
      shapeSelected=true;
    }
    else if (mx>(xPos2-size/2)&&(mx<(xPos2+size/2))&&my>(yPos2-size/2)&&(my<(yPos2+size/2))&&(shapeType!=1)){
      shapeType=1;
      shapeSelected=true;
    }
    else if (mx>(xPos3-size/2) && (my>(yPos3-size/2))) {
      if (numShapes==1){
        numShapes=2;
        plus1Selected=true;
      }    
      else if (numShapes==2){
        numShapes=1;
        minus1Selected=true;
      }
    }
  }
}
