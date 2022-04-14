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
//then use rotation to send it to the right location.
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

  console.log(largeArc);
  console.log(thisAngle);
  console.log(startCoords);
  console.log(endCoords);

  let d = `
    M ${startCoords.x} ${startCoords.y}
    A ${(viewboxSize/2) - 5} ${(viewboxSize /2) - 5}, 0, ${largeArc}, 1, ${endCoords.x} ${endCoords.y}
    L ${viewboxSize/2} ${viewboxSize/2} Z
  `;

  let newSector = document.createElementNS("http://www.w3.org/2000/svg",'path');
  newSector.setAttribute('transform-origin','100px 100px');
  newSector.setAttribute('d', d);

  document.getElementsByClassName('shape')[0].children[0].appendChild(newSector);
}

generateSectorMarkup(360/denominator_current);
//TODO: create sectors with no stroke. Instead, generate 'spokes' during this process
//otherwise strokes of each sector overlap messily.
//TODO: on creation of a SHAPE, generate enough sectors to cover the full gamut of denominators
//then, as this parameter is adjusted, recalculate the end coords for each sector, and hide
//any dormant sectors. Same deal with the 'spokes'


function adjustSize () { //this should be a 'method' of the sector itself
  //change angular width of a sector (for circle mode) and generate markup
  //change width of sector (for square mode) and generate markup
}

function adjustSectorSize () { //this should be a 'method' of the shape itself
  //change rotations for all active sectors, and adjust their sizes (circle mode)
  //change positions for all active sectors, and adjust their widths (square mode)
  //change rotations/positions, and visibilities for all sector dividers ('spokes')
}


//each segment should be addressable separately, having an existence
//separate from its visual representation
//the state of the segments will be tracked e.g. active/inactive (coloured-in in the current fraction)
//required/not-required (there is no need for this segment in this fraction)
