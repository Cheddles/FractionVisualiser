function Sector (vbSize = 200, divisions = 1) {
  //establish DOM presence
  this.path = document.createElementNS('http://www.w3.org/2000/svg','path');
  // this.path.setAttribute('transform-origin',`${(vbSize /2)} ${(vbSize /2)}`);
  this.path.style.transformOrigin = '50% 50%';

  //track state
  this.active = true;
  this.filled = false;
  this.viewboxSize = vbSize;

  this.adjustSize(12);
}

Sector.prototype.adjustSize = function (divisions) {
  //change angular width of a sector (for circle mode) and generate markup
  this.angle = 360/divisions;
  let d = this.generateSectorMarkup(this.angle);
  this.path.setAttribute('d', d);

  //change width of sector (for square mode) and generate markup
}

Sector.prototype.draw = function () {
  let classString = '';
  if (this.active) {
    classString += 'active';
  }
  if (this.filled) {
    classString += ' filled';
  }
  this.path.setAttribute('class', classString);
}

Sector.prototype.generateSectorMarkup = function (angle) {
  //generate markup to insert as 'd' attribute in this sector's SVG path
  let thisAngle = angle%360;
  let startCoords = this.findCoordsFromAngle(0);
  let endCoords = this.findCoordsFromAngle(angle);
  let largeArc = angle < 180 ? 0 : 1;

  let d = `
    M ${startCoords.x} ${startCoords.y}
    A ${(viewboxSize/2) - 5} ${(viewboxSize /2) - 5}, 0, ${largeArc}, 1, ${endCoords.x} ${endCoords.y}
    L ${viewboxSize/2} ${viewboxSize/2} Z
  `;

  if (thisAngle == 0) {
    let middleCoords = this.findCoordsFromAngle(180);
    d = `
      M ${startCoords.x} ${startCoords.y}
      A ${(viewboxSize/2) - 5} ${(viewboxSize /2) - 5}, 0, ${largeArc}, 1, ${middleCoords.x} ${middleCoords.y}
      A ${(viewboxSize/2) - 5} ${(viewboxSize /2) - 5}, 0, ${largeArc}, 1, ${endCoords.x} ${endCoords.y}
    `;
  }
  return d;
}


Sector.prototype.findCoordsFromAngle = function(angle, radius = (this.viewboxSize/2 - 5), centre = {x: this.viewboxSize/2, y: this.viewboxSize/2}) {
  let angle_rad = (2*Math.PI/360)*angle;
  let x = centre.x + radius*Math.cos(angle_rad);
  let y = centre.y + radius*Math.sin(angle_rad);
  return {x, y}
}
