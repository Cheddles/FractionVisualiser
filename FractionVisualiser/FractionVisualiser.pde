Slider setNumerator;
Slider setDenominator;
Wheel wheel;

void setup(){
  size(1024,768);
  background(255);
  if (frame != null) {
    frame.setResizable(true);
 }
 setDenominator=new Slider(1, 25, 7, int(height*0.9));
 setNumerator=new Slider(1, setDenominator.value, 3, int(height*0.1));
 wheel=new Wheel();
 textSize(height*0.3);
}

void draw(){
  background(255);
  wheel.diameter=int(min(height*0.95, width*0.475));
  setDenominator.ypos=int(height*0.9);
  setNumerator.ypos=int(height*0.1);
  
  if (setNumerator.dragging) setNumerator.drag();
  if (setDenominator.dragging){
    setDenominator.drag();
    setNumerator.max=setDenominator.value;
    if (setNumerator.value>setNumerator.max) setNumerator.value=setNumerator.max;
  }
  
  setDenominator.display();
  setNumerator.display();
  wheel.display(setNumerator.value, setDenominator.value);
  
  // draw fraction
  fill(0);
  strokeWeight(height/20);
  line(width*0.15, height*0.5, width*0.35, height*0.5);
  textAlign(CENTER, CENTER);
  text(str(setNumerator.value), width*0.25, height*0.3);
  text(str(setDenominator.value), width*0.25, height*0.65);
 }

void mousePressed() {
  setNumerator.clicked(mouseX,mouseY);
  setDenominator.clicked(mouseX,mouseY);
}

void mouseReleased() {
  setNumerator.dragging = false;
  setDenominator.dragging = false;
}

