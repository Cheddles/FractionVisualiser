class ShapeSelector{
int xPos1;
int yPos1;
int xPos2;
int yPos2;
int size;

  ShapeSelector(){
  }
  
  void display(){
    xPos1 = int(width*0.6);
    yPos1 = int(width*0.05);
    xPos2 = int(width*0.9);
    yPos2 = int(width*0.05);
    size=int(height*0.1);

    rectMode(CENTER);
    stroke(0);
    strokeWeight(1);
    fill(255);
    fill(shadedFill);
    ellipse(xPos1, yPos1, size, size);
    rect(xPos2, yPos2, size, size);
  }
  
  void clicked(int mx, int my) {
    float d = 2*pow(pow(mx-xPos1,2)+pow(my-yPos1,2),0.5);
    if (d < size) shapeType=0;
    else if (mx>(xPos2-size/2)&&(mx<(xPos2+size/2))&&my>(yPos2-size/2)&&(my<(yPos2+size/2))) shapeType=1;
  }
}
