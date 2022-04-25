function Wheel (num_sectors = 12, size = '100%', vbSize = 200, margin = 5, shape = 'circle') {

  //create DOM presence
  //First - the SVG
  this.svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  this.svg.setAttribute('width', `${size}`);
  this.svg.setAttribute('viewBox', `0 0 ${vbSize} ${vbSize}`);
  //Next- the associated 'shape' element in DOM
  this.shapeType = shape;
  this.element = document.createElement('div');
  this.element.classList.add('shape');
  if(this.shapeType === 'circle') {
    this.element.classList.add('circle');
  }
  if(this.shapeType === 'square') {
    this.element.classList.add('square');
  }

  this.element.style.transform = 'rotateZ(0deg)';
  this.element.appendChild(this.svg);


  //needs own collection of Sectors (up to max-denominator value)
  this.viewboxSize = vbSize;
  this.margin = margin;
  this.sectors = [];
  for (let i = 0; i < num_sectors; i++) {
    let newSector = new Sector(this.viewboxSize, this.margin);
    this.sectors.push(newSector);
    this.svg.append(newSector.path);
  }

  this.divisions = num_sectors;
  this.adjustDivisions(num_sectors);
}

Wheel.prototype.adjustDivisions = function (divisions) {
  //change rotations for all active sectors, and adjust their sizes (circle mode)
  for (let i = 0, l = this.sectors.length; i < l; i++) {
    let thisSector = this.sectors[i];
    thisSector.adjustSize(divisions, this.shapeType);
    if(i >= divisions) {
      thisSector.active = false;
      thisSector.filled = false;
    } else {
      thisSector.active = true;
    }
  }
  this.divisions = divisions;

  //change positions for all active sectors, and adjust their widths (square mode)
}

Wheel.prototype.fillSectors = function (num_sectors) {
  for (let i = 0, l = this.sectors.length; i < l; i++) {
    let thisSector = this.sectors[i];
    if(i < num_sectors) {
      thisSector.filled = true;
    } else {
      thisSector.filled = false;
    }
  }
}

Wheel.prototype.draw = function () {
  //draw all required sectors, setting css transforms as required
  let sectorCount = 0;
  for (let i = 0, l = this.sectors.length; i < l; i++) {
    let thisSector = this.sectors[i];
    if (thisSector.active) {
      if (this.shapeType == 'square') {
        thisSector.path.style.transform = `translateY(${this.viewboxSize - (2*this.margin) - (sectorCount+1)*thisSector.disp}px)`;
      } else {
        thisSector.path.style.transform = `rotateZ(${sectorCount*thisSector.angle}deg)`;
      }
      sectorCount++;
    }
    thisSector.draw();
  }
}

Wheel.prototype.changeShape = function (shape) {
  if(shape === 'circle' || shape === 'square') {
    this.shapeType = shape;
    this.element.classList.remove('circle');
    this.element.classList.remove('square');
    this.element.classList.add(shape);
    this.adjustDivisions(this.divisions);
  }
}
