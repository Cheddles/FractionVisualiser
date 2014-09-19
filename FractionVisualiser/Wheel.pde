class Wheel{
  int xpos;  // x-coordinate of wheel centre
  int ypos;  // y-coordinate of wheel centre
  float startAngle=1.5*PI;  // the angle from which the drawing is started
  boolean dragging=false;
  boolean clickedOnce=false;  // if this control has been clicked once (to display control instructions)
  float dragOffset;  // the angle offset when the mouse is clicked to drag
  
  Wheel(){
  }
  
  void display(int numerator,int denominator, int xCentre, int yCentre){
    
    float angle;  // rotation angle required to draw segments and dividing lines
    strokeWeight(max(1,int(((height+width)/200-denominator*(height+width)/6000)/2)));  // roughly scale line thickness with number of segments
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
    float r = pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5);
    if (((2*r) < diameter)&&(r>10)) {
      dragging = true;
      clickedOnce=true;
      dragOffset = findAngle(mx-xpos, my-ypos)-startAngle;
      if (dragOffset<0) dragOffset=dragOffset+(2*PI);
    }
  }
  
  void drag() {
    startAngle = findAngle(mouseX-xpos, mouseY-ypos) - dragOffset;
    if (startAngle>(2*PI)) startAngle=startAngle-(2*PI);
    if (startAngle<0) startAngle=startAngle+(2*PI);
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
