function Wheel (num_sectors = 12, size = '100%', vbSize = 200, shape = 'circle') {

  //create DOM presence
  this.svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  this.svg.setAttribute('width', `${size}`);
  // this.svg.setAttribute('height', `${size}`);
  this.svg.setAttribute('viewBox', `0 0 ${vbSize} ${vbSize}`);
  this.viewboxSize = vbSize;
  //associated 'shape' element in DOM
  this.shapeType = shape;
  this.element = document.createElement('div');
  this.element.classList.add('shape');
  if(this.shapeType === 'circle') {
    this.svg.classList.add('circle');
  }
  if(this.shapeType === 'square') {
    this.element.classList.add('square');
  }

  this.rotation_angle = 0;
  this.dragging = false;
  this.pos_current = {x: 0, y: 0};
  this.pos_initial = {x: 0, y: 0};
  this.shape_centre = {x: 0, y: 0};
  this.ang_initial = 0;
  this.element.appendChild(this.svg);

  //needs own collection of sectors (up to max-denominator value)
  this.sectors = [];
  for (let i = 0; i < num_sectors; i++) {
    let newSector = new Sector();
    this.sectors.push(newSector);
    this.svg.append(newSector.path);
  }

  this.divisions = num_sectors;
  this.adjustDivisions(num_sectors);


  this.element.addEventListener('touchstart', this.dragStart, false);
  this.element.addEventListener('touchend', this.dragEnd, false);
  this.element.addEventListener('touchmove', this.drag, false);

  this.element.addEventListener('mousedown', this.dragStart, false);
  this.element.addEventListener('mouseup', this.dragEnd, false);
  this.element.addEventListener('mousemove', this.drag, false);
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
        thisSector.path.style.transform = `translateY(${this.viewboxSize - 10 - (sectorCount+1)*thisSector.disp}px)`;
      } else {
        thisSector.path.style.transform = `rotateZ(${sectorCount*thisSector.angle}deg)`;
      }
      sectorCount++;
    }
    thisSector.draw();
  }
}





Wheel.prototype.dragStart = function (event) {
  if (event.type === 'touchstart') {
    this.pos_initial.x = event.touches[0].clientX;
    this.pos_initial.y = event.touches[0].clientY;
  } else {
    console.log(this);
    this.pos_initial.x = event.clientX;
    this.pos_initial.y = event.clientY;
  }

  if (event.target.classList.contains('shape')) {
    this.dragging = true;
    dragShape = this.element;
    console.log(dragShape);
    let bbox = dragShape.getBoundingClientRect();
    this.shape_centre = {x: (bbox.left + bbox.right)/2, y: (bbox.top + bbox.bottom)/2};
    this.ang_initial = Math.atan((shape_centre.y - pos_initial.y)/(shape_centre.x - pos_initial.x));
  }
}

Wheel.prototype.dragEnd = function (event) {
  console.log('bye');
  dragging = false;
}

Wheel.prototype.drag = function (event) {
  if (this.dragging) {
    console.log('draggin');
    event.preventDefault();
    if (event.type === 'touchmove') {
      this.pos_current.x = event.touches[0].clientX;
      this.pos_current.y = event.touches[0].clientY;
    } else {
      this.pos_current.x = event.clientX;
      this.pos_current.y = event.clientY;
    }
    this.setRotation();
  }
}

Wheel.prototype.setRotation = function () {
  //work out current mouse angle relative to shape centre
  let ang_current = Math.atan((this.shape_centre.y - this.pos_current.y)/(this.shape_centre.x - this.pos_current.x));
  let ang_diff = ang_current - this.ang_initial;

  //rotate shape to match this...
  this.rotation_angle += 360*ang_diff/(2*Math.PI);
  this.element.style.transform = `rotateZ(${this.rotation_angle})`;
}
