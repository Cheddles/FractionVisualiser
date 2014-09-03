class Slider{
 
 int max;  // maximum value
 int min;  // minimum value
 int value;  // current value
 int xpos;
 int ypos;
 int ballDiameter = int(min(height/12, width/20));
 boolean dragging=false;
 int dragOffset;  //horizontal offset of the mouse from the ball centre when dragging
 
 Slider(int minValue, int maxValue, int startValue, int verticalLocation){
   max=maxValue;  //to make available to methods
   min=minValue;
   ypos=verticalLocation;
 }

  void display(){
    int xmin=int(width*0.1);
    int xmax=int(width*0.5);
    stroke(0);
    xpos = int(float((value-min)/(max-min)*(xmax-xmin))+xmin);
    line(xmin,ypos,xmax,ypos);
    fill(0);
    ellipse(xpos,ypos,ballDiameter,ballDiameter);
//    drawArrow();
  }
  
  void clicked(int mx, int my) {
    float d = pow(pow(mx-xpos,2)+pow(my-ypos,2),0.5);
    if (d < ballDiameter) {
      dragging = true;
      ///dragOffset.x = location.x-mx;
      dragOffset = xpos-mx;
    }
  }
  
//  float drag() {
//      int newloc = mouseY + dragOffset;
//      float newMass=((ymax-newloc)*(max-min)/(ymax-ymin)+min);
//      newMass=float(int(newMass*100))/100;
//      if (newMass>max) newMass=max;
//      if (newMass<min) newMass=min;
//      return newMass;
//  }
//  
  void stopDragging() {
    dragging = false;
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
