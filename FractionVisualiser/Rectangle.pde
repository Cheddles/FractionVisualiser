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
  
  void display(int numerator,int denominator, int xCentre, int yCentre){
    sideLength = int(pow(0.25*PI*diameter*diameter,0.5));  // calculate the side length of the square from the corner to corner diameter
    xpos=xCentre;
    ypos=yCentre;
    strokeWeight(max(1,int(((height+width)/200-denominator*(height+width)/6000)/2)));  // roughly scale line thickness with number of segments
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
          rect(0, (-0.5*sideLength)+(i+0.5)*(sideLength/denominator), sideLength, sideLength/denominator);          
        }
      } 
    popMatrix();
    
    // show drag-to-rotate instruction if not rotated yet
    if (!clickedOnce){
      pushMatrix();
        translate(xCentre-(diameter*0.6),yCentre);
        rotate(PI*1.5);
        textSize (diameter/12);
        textAlign(CENTER, CENTER);
        fill(127);
        text("drag shape to rotate", 0, 0);
      popMatrix();
    }
  }

  void clicked(int mx, int my) {
    float dClick = 2*pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5);  // accept any click within the nominal diameter as a "hit" for dragging
    int dDrawn = int(1.42*diameter);

    if ((dClick < dDrawn)&&(dClick>20)) {
      clickedOnce=true;
      dragging = true;
      dragOffset = findAngle(mx-xpos, my-ypos)-angle;  // angle between current angle of rotation and the angle of click
      if (dragOffset<0) dragOffset=dragOffset+(2*PI);  //if angle goes below 0 then add a full circle to return to positive angle
      if (dragOffset>2*PI) dragOffset=dragOffset-(2*PI);  //if angle goes above a full circle then subtract a full circle
    }
  }
  
  void drag() {
    angle = findAngle(mouseX-xpos, mouseY-ypos) - dragOffset;
    // reset angle if it goes outside the range 0 to 2*pi
    if (angle>(2*PI)) angle=angle-(2*PI);
    if (angle<0) angle=angle+(2*PI);
  }

  // inverse tangent function with correction for angles outside the first quadrant.
  float findAngle(int x, int y){
    float clickAngle = atan(float(y)/float(x));
    if (x<0) clickAngle = clickAngle+PI;
    if (clickAngle>(2*PI)) clickAngle=clickAngle-(2*PI);
    if (clickAngle<0) clickAngle=clickAngle+(2*PI);
    return clickAngle;
  }  
}
