int numerator=3;  // numerator for the fraction being visualised

Slider setNumerator;
Slider setDenominator;

void setup(){
  size(1024,768);
  background(255);
  if (frame != null) {
    frame.setResizable(true);
 }
 setDenominator=new Slider(1, 10, 6, int(height*0.9));
 setNumerator=new Slider(1, setDenominator.value, 2, int(height*0.1));
}

void draw(){
  int diameter=int(min(height*0.95, width*0.475));
  setDenominator.ypos=int(height*0.9);
  setNumerator.ypos=int(height*0.1);
  
  setDenominator.display();
  setNumerator.display();
  wheel.display();
  fraction.display();
  
  strokeWeight(5);
  stroke(0);
  ellipse(width*0.75, height*0.5, diameter, diameter);
  line(width*0.15, height*0.5, width*0.35, height*0.5);
  

}
