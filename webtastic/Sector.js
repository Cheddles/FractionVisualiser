function Sector (vbSize = 200, divisions = 1) {
  //establish DOM presence
  this.path = document.createElementNS('http://www.w3.org/2000/svg','path');
  this.path.setAttribute('transform-origin',`${(vbSize /2)}px ${(vbSize /2)}px`);

  //track state
  this.active = true;
  this.filled = false;

  this.adjustSize(12);

}

Sector.prototype.adjustSize = function (divisions) {
  //change angular width of a sector (for circle mode) and generate markup
  this.angle = 360/divisions;
  let d = generateSectorMarkup(this.angle);
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
