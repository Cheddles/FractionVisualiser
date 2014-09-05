class Slider{
 
 int max;  // maximum value
 int min;  // minimum value
 int value;  // current value
 int xpos;
 int ypos;
 int ballDiameter;
 boolean dragging=false;
 boolean clickedOnce=false;  // if this control has been clicked once (to display control instructions)
 int dragOffset;  //horizontal offset of the mouse from the ball centre when dragging
 int xmin;
 int xmax;
    
 Slider(int minValue, int maxValue, int startValue, int verticalLocation){
   max=maxValue;  //to make available to methods
   min=minValue;
   ypos=verticalLocation;
   value=startValue;
 }

  void display(){
    stroke(0);
    strokeWeight(int(height/100));
    xmin=int(width*0.1);
    xmax=int(width*0.5);
    ballDiameter = int(min(height/12, width/20));
    xpos = max(int(float(value-min)/float(max-min)*(xmax-xmin)+xmin),xmin);
    line(xmin,ypos,xmax,ypos);
    fill(0);
    if (dragging) fill(128);
    ellipse(xpos,ypos,ballDiameter,ballDiameter);
//    drawArrow();
  }
  
  void clicked(int mx, int my) {
    float d = pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5);
    if (d < ballDiameter) {
      dragging = true;
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

  
//   void drawArrow(){
//   // draw a red arrow indicating slider motion
//   stroke(255,0,0);
//   strokeWeight(10);
//   line(xpos,(ypos-ballDiameter),xpos,(ypos+ballDiameter));
//   line(xpos,(ypos-ballDiameter),xpos+ballDiameter/2,(ypos-ballDiameter*0.7));
//   line(xpos,(ypos-ballDiameter),xpos-ballDiameter/2,(ypos-ballDiameter*0.7));
//   line(xpos,(ypos+ballDiameter),xpos+ballDiameter/2,(ypos+ballDiameter*0.7));
//   line(xpos,(ypos+ballDiameter),xpos-ballDiameter/2,(ypos+ballDiameter*0.7));
//   fill(0,0,0,128);
//   strokeWeight(0);
//   ellipse(xpos,ypos,ballDiameter,ballDiameter);
//   strokeWeight(5);
// }
  
}
