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

  void display(){
    stroke(0);
    // recalculate dimensions each time in case window has been resized
    strokeWeight(int(height/100));
    xmin=int(width*0.1);
    xmax=int(width*0.5);
    ballDiameter = int(min(height/12, width/20));
    xpos = max(int(float(value-min)/float(max-min)*(xmax-xmin)+xmin),xmin);
    line(xmin,ypos,xmax,ypos);
    
    // display slider
    fill(0);
    if (mouseOver) fill(255);
    ellipse(xpos,ypos,ballDiameter,ballDiameter);
    drawArrow();
    
    // display instructions if slider has not yet been used
    if (!clickedOnce) {
      textSize(height*0.028);
      fill(127);
      text("drag to adjust value", (xmin+xmax)/2, ypos-height*0.065);
    }
  }
  
  void clicked(int mx, int my) {
    float d = pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5);
    if (d < ballDiameter) {
      dragging = true;
      clickedOnce=true;
      dragOffset = xpos-mx;
    }
  }
  
  void drag() {
      int newloc = mouseX + dragOffset;
      //stop out of range dragging
      if (newloc>xmax) newloc=xmax;
      if (newloc<xmin) newloc=xmin;
      
      //check to see if moved far enough for integer change
      if ((newloc-xpos)>(xmax-xmin)/(2*(max-min))) value++;
      if ((xpos-newloc)>(xmax-xmin)/(2*(max-min))) value--;

  }
  
  void hover(int mx, int my) {
    float d = pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5);
    if (d < ballDiameter) {
      mouseOver = true;
    }
    else {
      mouseOver = false;
    }
  }
  
  void drawArrow(){
    // draw a red arrow indicating slider motion
    stroke(255,0,0);
    strokeWeight(10);
    strokeCap(ROUND);
    line(xpos-ballDiameter,ypos,xpos+ballDiameter,ypos);
    line(xpos+ballDiameter,ypos,xpos+ballDiameter*0.7,(ypos-ballDiameter*0.5));
    line(xpos-ballDiameter,ypos,xpos-ballDiameter*0.7,(ypos-ballDiameter*0.5));
    line(xpos+ballDiameter,ypos,xpos+ballDiameter*0.7,(ypos+ballDiameter*0.5));
    line(xpos-ballDiameter,ypos,xpos-ballDiameter*0.7,(ypos+ballDiameter*0.5));
    
    fill(0,0,0,100);
    strokeWeight(0);
    ellipse(xpos,ypos,ballDiameter,ballDiameter);
    strokeWeight(5);
  }
}
