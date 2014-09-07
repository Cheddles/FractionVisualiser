class Wheel{
  int diameter;  //display diameter
  color emptyFill=color(255);
  color shadedFill=color(128,128,255);  // colour for shaded segments
  int xpos;
  int ypos;
  float startAngle=1.5*PI;  // the angle from which the drawing is started
  boolean dragging=false;
  boolean clickedOnce=false;  // if this control has been clicked once (to display control instructions)
  float dragOffset;  // the angle offset when the mouse is clicked to drag

  float temp;
  int tempx;
  int tempy;
  
  Wheel(){
  }
  
  void display(int numerator,int denominator){
    float angle;  // rotation angle required to draw segments and dividing lines
    
    xpos=int(width*0.75);
    ypos=int(height*0.55);
    strokeWeight(max(1,int(height/(15*setDenominator.value))));
    stroke(0);
    
    angle=startAngle;  //start at the top of the circle
    fill(shadedFill);  // start with filled segments
    
    if (setDenominator.value==1){
      strokeWeight(int(height/30));
      ellipse(xpos, ypos, diameter, diameter);
    }
    else{
      for(int i=0; i<denominator; i++){
        if (angle>(2*PI)) angle=angle-(2*PI);  //reset angle once over 2*PI
        if(i==numerator) fill(emptyFill);  //switch to "empty" segments
     
        arc(xpos, ypos, diameter, diameter, angle, angle+(2*PI/denominator), PIE);
        angle=angle+(2*PI)/denominator;
      }
    }
  }
  
  void clicked(int mx, int my) {
    float r = pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5);
    if (((2*r) < diameter)&&(r>10)) {
      dragging = true;
      dragOffset = findAngle(mx-xpos, my-ypos)-startAngle;
      temp=findAngle(mx-xpos, my-ypos);
      tempx=mouseX;
      tempy=mouseY;
      if (dragOffset<0) dragOffset=dragOffset+(2*PI);
    }
  }
  
  void drag() {
    startAngle = findAngle(mouseX-xpos, mouseY-ypos) - dragOffset;
    if (startAngle>(2*PI)) startAngle=startAngle-(2*PI);
    if (startAngle<0) startAngle=startAngle+(2*PI);
  }
  
  float findAngle(int x, int y){
    float clickAngle = atan(float(y)/float(x));
    if (x<0) clickAngle = clickAngle+PI;
    if (clickAngle>(2*PI)) clickAngle=clickAngle-(2*PI);
    if (clickAngle<0) clickAngle=clickAngle+(2*PI);
    return clickAngle;
  }
  
}
