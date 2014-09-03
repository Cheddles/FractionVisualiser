int numerator=3;  // numerator for the fraction being visualised

Slider setNumerator;
Slider setDenominator;
Wheel wheel;

void setup(){
  size(1024,768);
  background(255);
  if (frame != null) {
    frame.setResizable(true);
 }
 setDenominator=new Slider(1, 10, 7, int(height*0.9));
 setNumerator=new Slider(1, setDenominator.value, 3, int(height*0.1));
 wheel=new Wheel();
}

void draw(){
  wheel.diameter=int(min(height*0.95, width*0.475));
  setDenominator.ypos=int(height*0.9);
  setNumerator.ypos=int(height*0.1);
  
  setDenominator.display();
  setNumerator.display();
  wheel.display(5,7);
//  fill(255,0,0);
//  arc(width*0.75, height*0.5, 360, 360, 0, 2, PIE);
//  wheel.display(setNumerator.value, setDenominator.value);
//  fraction.display();
  
}
