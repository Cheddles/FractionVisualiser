class Wheel{
  int diameter;  //display diameter
//  int numSegments;  //number of segments
//  int numShaded;  //number of segments to be shaded
  color emptyFill=color(255);
  color shadedFill=color(128,128,255);  // colour for shaded segments
  
  Wheel(){
  }
  
  void display(int numerator,int denominator){
    float angle;  // rotation angle required to draw segments and dividing lines
    
    strokeWeight(int(height/100));
    stroke(0);
    
    angle=PI*1.5;  //start at the top of the circle
    fill(shadedFill);  // start with filled segments
    
    for(int i=0; i<denominator; i++){
      if (angle>(2*PI)) angle=angle-(2*PI);  //reset angle once over 2*PI
      if(i==numerator) fill(emptyFill);  //switch to "empty" segments
   
      arc(width*0.75, height*0.5, diameter, diameter, angle, angle+(2*PI/denominator), PIE);
      angle=angle+(2*PI)/denominator;
    }
  }
}
