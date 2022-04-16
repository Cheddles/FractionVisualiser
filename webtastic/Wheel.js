function Wheel (num_sectors = 12, size = 1000, vbSize = 200) {

  //create DOM presence
  this.svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  this.svg.setAttribute('width', `${size}`);
  this.svg.setAttribute('height', `${size}`);
  this.svg.setAttribute('viewBox', `0 0 ${vbSize} ${vbSize}`);

  //associated 'shape' element in DOM
  this.element = document.createElement('div');
  this.element.classList.add('shape');
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
}

Wheel.prototype.adjustDivisions = function (divisions) {
  //change rotations for all active sectors, and adjust their sizes (circle mode)
  for (let i = 0, l = this.sectors.length; i < l; i++) {
    let thisSector = this.sectors[i];
    thisSector.adjustSize(divisions);
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
      thisSector.path.style.transform = `rotateZ(${sectorCount*thisSector.angle}deg)`;
      sectorCount++;
    }
    thisSector.draw();
  }
}
