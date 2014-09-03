class Wheel{
  int diameter;  //display diameter
//  int numSegments;  //number of segments
//  int numShaded;  //number of segments to be shaded
  color emptyFill=color(0,0,255);
  color shadedFill=color(128,255,128);  // colour for shaded segments
  
  Wheel(){
  }
  
  void display(int numerator,int denominator){
    float angle;  // rotation angle required to draw segments and dividing lines
    
    strokeWeight(5);
    stroke(0);

    //Draw background circle
    fill(emptyFill);
    ellipse(width*0.75, height*0.5, diameter, diameter);
    line(width*0.15, height*0.5, width*0.35, height*0.5);
    
    angle=PI*1.5;  //start at the top of the circle
    fill(shadedFill);  // start with filled segments
    
    for(int i=0; i<7; i++){
      angle=angle+(2*PI)/7.0;
//      if (angle>(2*PI)) angle=angle-(2*PI);  //reset angle once over 2*PI
      if(i==numerator) fill(emptyFill);  //switch to "empty" segments
   
      arc(width*0.75, height*0.5, diameter, diameter, angle, angle+((2*PI)*(1/denominator)), PIE);
    }
    
//     for(int i=0; i<denominator; i++){
//      angle=angle+(2*PI)/denominator;
//      if (angle>(2*PI)) angle=angle-(2*PI);  //reset angle once over 2*PI
//      
//      // set colour according to filled/not filled
//      if(i<numerator) fill(shadedFill);
//      else fill(emptyFill);
//      
//      arc(width*0.75, height*0.5, diameter, diameter, angle, angle+(2*PI)*(numerator/denominator), PIE);
  }
}
