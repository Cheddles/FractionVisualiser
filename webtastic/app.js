const SHAPES_MAX = 4;
const numerator = document.getElementById('numerator');
const denominator = document.getElementById('denominator');
const numeratorSelector = document.getElementById('numerator-selector');
const denominatorSelector = document.getElementById('denominator-selector');

const viewboxSize = 200;

denominatorSelector.addEventListener('input', function (event) {
  let value = parseInt(event.target.value);
  setSliderMaximum(numeratorSelector, shapes_current*value);
  setBigNumber(denominator, value);
  //also update the visuals!
});

numeratorSelector.addEventListener('input', function (event) {
  let value = parseInt(event.target.value);
  setBigNumber(numerator, value);
  //also update the visuals!
});

//Initial values
const NUMERATOR_INITIAL = 3;
const DENOMINATOR_INITIAL = 7;
const SHAPES_INITIAL = 1;

let shapes_current = SHAPES_INITIAL;
let numerator_current = NUMERATOR_INITIAL;
let denominator_current = DENOMINATOR_INITIAL;

updateSliderValue(denominatorSelector, DENOMINATOR_INITIAL);
updateSliderValue(numeratorSelector, NUMERATOR_INITIAL);



function updateSliderValue (slider, value) {
  slider.value = `${value}`;
  slider.setAttribute('value', `${value}`);
  let sliderInput = new Event('input', {bubbles: true, cancelable: true});
  slider.dispatchEvent(sliderInput);
}


function setSliderMaximum (slider, max) {
  let newMax = Math.round(max);
  if (newMax < 1) {newMax = 1;}

  let currentValue = parseInt(slider.value);
  let min = parseInt(slider.getAttribute('min'));
  let currentMax = parseInt(slider.getAttribute('max'));

  if (newMax != currentMax) {
    //1: set the new maximum value for the slider (if needed or valid!)
    slider.setAttribute('max', `${newMax}`);

    //2: update the current value of the slider as necessary
    //3: trigger any necessary events to make this manifest in other places.
    if (currentValue > newMax) {
      slider.value = `${newMax}`;
      slider.setAttribute('value', `${newMax}`);
      let sliderInput = new Event('input', {bubbles: true, cancelable: true});
      slider.dispatchEvent(sliderInput);
    }
  }
}

function setBigNumber (position, value) {
  position.getElementsByTagName('span')[0].innerText = value;
}

function changeMaxShapes (value) {
  //update shapes_current
  shapes_current = Math.round(value);
  if(shapes_current < 1) {shapes_current = 1;}

  //update maximum value of numerator
  let denominator_max = parseInt(denominatorSelector.value);
  setSliderMaximum(numeratorSelector, shapes_current*denominator_max);
}

//dynamically generate svg representations of the fractions

//work out the required coordinates for the endpoints of a sector
//basically do this once to generate a sector of the right shape,
//then use CSS rotation to send it to the right location.
function findCoordsFromAngle(angle, radius = (viewboxSize/2 - 5), centre = {x: viewboxSize/2, y: viewboxSize/2}) {
  let angle_rad = (2*Math.PI/360)*angle;
  let x = centre.x + radius*Math.cos(angle_rad);
  let y = centre.y + radius*Math.sin(angle_rad);
  return {x, y}
}


function generateSectorMarkup(angle) {
  let thisAngle = angle%360;
  let startCoords = findCoordsFromAngle(0);
  let endCoords = findCoordsFromAngle(angle);
  let largeArc = angle < 180 ? 0 : 1;

  let d = `
    M ${startCoords.x} ${startCoords.y}
    A ${(viewboxSize/2) - 5} ${(viewboxSize /2) - 5}, 0, ${largeArc}, 1, ${endCoords.x} ${endCoords.y}
    L ${viewboxSize/2} ${viewboxSize/2} Z
  `;

  return d;

}

let wheelie = new Wheel;
wheelie.sectors[3].filled = true;
wheelie.sectors[3].active = true;
wheelie.sectors[8].filled = true;
wheelie.sectors[8].active = true;

document.getElementsByClassName('shape-container')[0].appendChild(wheelie.element);

generateSectorMarkup(360/denominator_current);

//TODO: on creation of a SHAPE, generate enough sectors to cover the full gamut of denominators
//then, as this parameter is adjusted, recalculate the end coords for each sector, and hide
//any dormant sectors.

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
  this.spokes = [];
  for (let i = 0; i < num_sectors; i++) {
    let newSector = new Sector();
    this.sectors.push(newSector);
    if(i < num_sectors - 1) {
      this.spokes.push('spokane');
    }
  }

  this.divisions = num_sectors;
}

Wheel.prototype.adjustDivisions = function (divisions) {
  //change rotations for all active sectors, and adjust their sizes (circle mode)
  if (divisions != this.divisions) {
    for (let i = 0, l = this.sectors.length; i < l; i++) {
      let thisSector = this.sectors[i];
      thisSector.adjustSize(divisions);
      if(i >= divisions) {
        thisSector.active = false;
      } else {
        thisSector.active = true;
      }
    }
    this.divisions = divisions;
  }
  //change positions for all active sectors, and adjust their widths (square mode)
  //change rotations/positions, and visibilities for all sector dividers ('spokes')
}

Wheel.prototype.generateSpoke = function () {

}

Wheel.prototype.draw = function () {
  //draw all required sectors, setting css transforms as required
  let sectorCount = 0;
  for (let i = 0, l = this.sectors.length; i < l; i++) {
    let thisSector = this.sectors[i];
    thisSector.adjustSize(this.divisions);
    if (thisSector.active) {
      thisSector.path.style.transform = `rotateZ(${sectorCount*thisSector.angle}deg)`;
      this.svg.append(thisSector.path);
      sectorCount++;
    }
  }
}

function Sector (vbSize = 200) {
  //establish DOM presence
  this.path = document.createElementNS('http://www.w3.org/2000/svg','path');
  this.path.setAttribute('transform-origin',`${(vbSize /2)}px ${(vbSize /2)}px`);

  //track state
  this.active = false;
  this.filled = false;
}

Sector.prototype.adjustSize = function (divisions) {
  //change angular width of a sector (for circle mode) and generate markup
  this.angle = 360/divisions;
  let d = generateSectorMarkup(this.angle);
  this.path.setAttribute('d', d);
  //change width of sector (for square mode) and generate markup
}
