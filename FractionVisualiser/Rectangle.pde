class Rectangle{
  int sideLength;  //length of a single side
  int xpos;
  int ypos;
  float angle=0;  // the angle from which the drawing is started
  boolean dragging=false;
  boolean clickedOnce=false;  // if this control has been clicked once (to display control instructions)
  float dragOffset;  // the angle offset when the mouse is clicked to drag

  Rectangle(){
  }
  
  void display(int numerator,int denominator, int xCentre, int yCentre){
    sideLength = int(pow(0.25*PI*diameter*diameter,0.5));
    xpos=xCentre;
    ypos=yCentre;
    strokeWeight(max(1,int((height+width)/200-denominator*(height+width)/6000)));
    stroke(0);

    fill(shadedFill);  // start with filled segments
    
    pushMatrix();
        translate(xpos,ypos);
        rotate(angle);
      if (setDenominator.value==1){
        if (numerator==0) fill(emptyFill);
        rect(0, 0, sideLength, sideLength);
      }
      else{
        for(int i=0; i<setDenominator.value; i++){
          if(i==numerator) fill(emptyFill);  //switch to "empty" segments
          rect(0, (-0.5*sideLength)+(i+0.5)*(sideLength/denominator), sideLength, sideLength/denominator);          
        }
      } 
    popMatrix();
  }

  void clicked(int mx, int my) {
    float dClick = 2*pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5);
    int dDrawn = int(1.42*diameter);

    if ((dClick < dDrawn)&&(dClick>20)) {
      dragging = true;
      dragOffset = findAngle(mx-xpos, my-ypos)-angle;
      if (dragOffset<0) dragOffset=dragOffset+(2*PI);
    }
  }
  
  void drag() {
    angle = findAngle(mouseX-xpos, mouseY-ypos) - dragOffset;
    if (angle>(2*PI)) angle=angle-(2*PI);
    if (angle<0) angle=angle+(2*PI);
  }

  float findAngle(int x, int y){
    float clickAngle = atan(float(y)/float(x));
    if (x<0) clickAngle = clickAngle+PI;
    if (clickAngle>(2*PI)) clickAngle=clickAngle-(2*PI);
    if (clickAngle<0) clickAngle=clickAngle+(2*PI);
    return clickAngle;
  }  
}
