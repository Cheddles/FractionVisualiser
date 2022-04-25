//SETUP

const SHAPES_MAX = 6;
const DENOMINATOR_MAX = 12;
const NUMERATOR_INITIAL = 3;
const DENOMINATOR_INITIAL = 7;
const SHAPES_INITIAL = 1;
const viewboxSize = 200; //the SVG size (in its own arbitrary dimensions)
const margin = 0;
const wheels = [];
const num_containers = SHAPES_MAX/2; //how many shape containers are needed?

let shapes_current = SHAPES_INITIAL;
let numerator_current = NUMERATOR_INITIAL;
let denominator_current = DENOMINATOR_INITIAL;
let shapeType = 'circle';

let dragging = false; //these are all associated with managing shape rotation by user
let pos_current = {x: 0, y: 0};
let pos_initial = {x: 0, y: 0};
let shape_centre = {x: 0, y: 0};
let ang_initial = 0;
let dragShape;

const numerals = document.getElementById('numerals');
const numerator = document.getElementById('numerator');
const denominator = document.getElementById('denominator');
const numeratorSelector = document.getElementById('numerator-selector');
const denominatorSelector = document.getElementById('denominator-selector');
const shapeAdd = document.getElementById('shape-add');
const shapeRemove = document.getElementById('shape-remove');
const shapeQuantity = document.getElementsByClassName('shape-quantity')[0];
const shapeSquare = document.getElementById('squareButton');
const shapeCircle = document.getElementById('circleButton');
const shapeSelector = document.getElementsByClassName('shape-selector')[0];
const shapeDisplay = document.getElementsByClassName('shape-display')[0];
const aboutButton = document.getElementById('aboutButton');
const modal = document.getElementsByClassName('modal')[0];
const restoreTT = document.getElementById('restore-tt');

window.addEventListener('touchstart', dragStart, false);
window.addEventListener('touchend', dragEnd, false);
window.addEventListener('touchmove', drag, false);

window.addEventListener('mousedown', dragStart, false);
window.addEventListener('mouseup', dragEnd, false);
window.addEventListener('mousemove', drag, false);

window.addEventListener('resize', function (event) {
  reassignWheels();
});

denominatorSelector.addEventListener('input', function (event) {
  fadeTooltip('denominatorSelector');
  let value = parseInt(event.target.value);
  denominator_current = value;
  setSliderMaximum(numeratorSelector, shapes_current*value);
  setBigNumber(denominator, value);
  //also update the visuals!
  for (let i = 0, l = wheels.length; i < l; i++) {
    let wheelie = wheels[i];
    wheelie.adjustDivisions(value);
    wheelie.draw();
  }
});

numeratorSelector.addEventListener('input', function (event) {
  fadeTooltip('numeratorSelector');
  let value = parseInt(event.target.value);
  setBigNumber(numerator, value);
  //also update the visuals!
  for (let i = 0, l = wheels.length; i < l; i++) {
    let wheelie = wheels[i];
    let fillValue = value - i*denominator_current;
    if(fillValue < 0) {fillValue = 0;}
    else if (fillValue >= denominator_current) {fillValue = denominator_current;}
    wheelie.fillSectors(fillValue);
    wheelie.draw();
  }
});

shapeQuantity.addEventListener('click', function (event) {
if(event.target == shapeAdd) {
    if (shapes_current < SHAPES_MAX) {
      fadeTooltip('shapeAdd');
      shapes_current++;
    }
  }
  if(event.target == shapeRemove) {
    if (shapes_current > 1) {
      fadeTooltip('shapeRemove');
      shapes_current--;
    }
  }

  if (shapes_current >= SHAPES_MAX) {
    shapeAdd.disabled = true;
  } else {
    shapeAdd.disabled = false;
  }

  if (shapes_current <= 1) {
    shapeRemove.disabled = true;
  } else {
    shapeRemove.disabled = false;
  }

  //shift wheels to different containers for best display
  reassignWheels();
  //change visibility state on new shape and shape-containers
  hideWheels();
  //set the numerator slider maximum
  setSliderMaximum(numeratorSelector, shapes_current*parseInt(denominatorSelector.value));
});

shapeSelector.addEventListener('click', function (event) {
  let changed = false;
  if(event.target == shapeCircle && shapeType === 'square') {
    changed = true;
    shapeType = 'circle';
  } else if(event.target == shapeSquare && shapeType === 'circle') {
    changed = true;
    shapeType = 'square';
  }

  if (changed) {
    fadeTooltip('shapeSelector');
    for (let i = 0, l = wheels.length; i < l; i++) {
      wheels[i].changeShape(shapeType);
      wheels[i].draw();
    }
    reassignWheels();
  }
});

aboutButton.addEventListener('click', function(event) {
  //make 'about box' visible
  let modalCont = document.getElementsByClassName('modal-container')[0];
  modalCont.classList.remove('hide');
  document.getElementById('main').classList.toggle('invert');
});

modal.addEventListener('click', closeModal);
restoreTT.addEventListener('click', restoreTooltips);

//MAKING THINGS HAPPEN

for (i = 0; i < num_containers; i++) {
  let sc = document.createElement('div');
  sc.classList.add('shape-container');
  if (i > 0) {sc.classList.add('hide');}
  shapeDisplay.appendChild(sc);
}

for (let i = 0; i < SHAPES_MAX; i++) {
  //generate Wheels and append to alternating shape-containers
  let containerIndex = i%num_containers;
  let wheel = new Wheel(DENOMINATOR_MAX, '100%', viewboxSize, margin, shapeType);
  document.getElementsByClassName('shape-container')[containerIndex].appendChild(wheel.element);
  if (i == 0) {
    let tip = document.createElement('span');
    tip.classList.add('tooltip');
    tip.classList.add('rotate-me');
    tip.innerText = `Drag shape to rotate`;
    wheel.element.appendChild(tip);
  }

  wheels.push(wheel);
}

if (shapes_current <= 1) {
  shapeRemove.disabled = true;
} else {
  shapeRemove.disabled = false;
}

if (shapes_current >= SHAPES_MAX) {
  shapeAdd.disabled = true;
} else {
  shapeAdd.disabled = false;
}

let tooltips = {
  numeratorSelector: numerals.getElementsByClassName('tooltip')[0],
  denominatorSelector: numerals.getElementsByClassName('tooltip')[1],
  shapeSelector: shapeSelector.getElementsByClassName('tooltip')[0],
  shapeAdd: shapeQuantity.getElementsByClassName('tooltip')[1],
  shapeRemove: shapeQuantity.getElementsByClassName('tooltip')[0],
  shapeDisplay: shapeDisplay.getElementsByClassName('tooltip')[0]
}


const wideQuery = window.matchMedia('(orientation: landscape) and (min-aspect-ratio: 16/9), (orientation: portrait) and (min-aspect-ratio: 5/11)');
wideQuery.addListener(handleResize);
let wide = false;

handleResize(wideQuery);
hideWheels();

updateSliderValue(denominatorSelector, DENOMINATOR_INITIAL);
updateSliderValue(numeratorSelector, NUMERATOR_INITIAL);

reassignWheels();


//FUNctions//

function calculateAngle (positionVector, centreVector = {x: 0, y: 0}) {
  let ang = Math.atan2(positionVector.y - centreVector.y, positionVector.x - centreVector.x);
  return ang;
}

function closeModal (event) {
  if(event.target === modal || event.target == modal.getElementsByTagName('button')[0]) {
    document.getElementById('main').classList.toggle('invert');
    modal.parentNode.classList.add('hide');
  }
}

function dragStart (event) {
  if (event.type === 'touchstart') {
    pos_initial.x = event.touches[0].clientX;
    pos_initial.y = event.touches[0].clientY;
  } else {
    pos_initial.x = event.clientX;
    pos_initial.y = event.clientY;
  }
  if (event.target.tagName === 'svg' && event.target.parentNode.classList.contains('shape')) {
    fadeTooltip('shapeDisplay');
    dragging = true;
    dragShape = event.target;
    let bbox = dragShape.getBoundingClientRect();
    shape_centre = {x: (bbox.left + bbox.right)/2, y: (bbox.top + bbox.bottom)/2};
    ang_initial = calculateAngle (pos_initial, shape_centre);
  }
}

function dragEnd (event) {
  dragging = false;
}

function drag (event) {
  if (dragging) {
    event.preventDefault();
    if (event.type === 'touchmove') {
      pos_current.x = event.touches[0].clientX;
      pos_current.y = event.touches[0].clientY;
    } else {
      pos_current.x = event.clientX;
      pos_current.y = event.clientY;
    }
    setRotation();
  }
}

function fadeTooltip(elementName) {
  if (!tooltips[elementName].classList.contains('tooltip-fade') && !event.automatic) {
    tooltips[elementName].classList.add('tooltip-fade');
  }
}

function findCoordsFromAngle(angle, radius = (viewboxSize/2 - margin), centre = {x: viewboxSize/2, y: viewboxSize/2}) {
  let angle_rad = (2*Math.PI/360)*angle;
  let x = centre.x + radius*Math.cos(angle_rad);
  let y = centre.y + radius*Math.sin(angle_rad);
  return {x, y}
}

function handleResize(event) {
  if (!wide && event.matches) {
    wide = true;
  } else if (wide && !event.matches) {
    wide = false;
  }
}

function hideWheels () {
  for (let i = 0; i < wheels.length; i++) {
    if (i < shapes_current) {
      wheels[i].element.classList.remove('hide');
    } else {
      wheels[i].element.classList.add('hide');
    }
  }
}

function reassignWheels () {
  //remove existing wheel elements from shape-containers
  let shapeContainers = document.getElementsByClassName('shape-container');

  for (let i = 0, l = shapeContainers.length; i < l; i++) {
    let sc = shapeContainers[i];
    while (sc.firstChild) {
      sc.removeChild(sc.firstChild);
    }
  }

  //hide/show shape-containers based on whether they have active wheels inside
  let num_wheels = wheels.length;
  if(!wide) {
    if (shapes_current < 3) {
      for (let i = 0; i < shapes_current; i++) {
        let wheel = wheels[i];
        let containerIndex = i%2;
        if(i < 3) {shapeContainers[containerIndex].appendChild(wheel.element)};
        if(shapes_current < 2) {
          shapeContainers[1].classList.add('hide');
        } else {
          shapeContainers[1].classList.remove('hide');
        }
        if(containerIndex > 1) {
          shapeContainers[containerIndex].classList.add('hide');
        } else {
          shapeContainers[containerIndex].classList.remove('hide');
        }
      }
    } else {
      for (let i = 0, sc = 0; i < num_wheels; i++) {
        let wheel = wheels[i];
        let idx = i%2;
        let containerIndex = sc;
        sc += idx;
        shapeContainers[containerIndex].appendChild(wheel.element);
        if(i >= shapes_current) {
          if(idx == 0) {shapeContainers[containerIndex].classList.add('hide');}
        } else {
          shapeContainers[containerIndex].classList.remove('hide');
        }
      }
    }
  } else {
    for (let i = 2, l = shapeContainers.length; i < l; i++) {
      shapeContainers[i].classList.add('hide');
    }
    let halfWheels = Math.ceil(num_wheels/2);
    for (let i = 0; i < num_wheels; i++) {
      let wheel = wheels[i];
      let containerIndex = i < halfWheels ? 0 : 1;
      shapeContainers[containerIndex].appendChild(wheel.element);

      if(i >= shapes_current) {
        if(containerIndex == 0) {shapeContainers[1].classList.add('hide');}
      } else {
        shapeContainers[containerIndex].classList.remove('hide');
      }
    }
  }

  let shapeContainersInUse = shapeContainers.length;
  for (let i = 0, l = shapeContainers.length; i < l; i++) {
    if (shapeContainers[i].classList.contains('hide')) {
      shapeContainersInUse--;
    }
  }

  //discover displayed size of shapeDisplay element in order to scale shapes correctly
  let bbox = document.getElementsByClassName('shape-display')[0].getBoundingClientRect();
  let displayWidth = bbox.width;
  let displayHeight = bbox.height;
  //scale the available space a little bit for squares
  if(shapeType == 'square') {
    displayWidth *= 0.9;
    displayHeight *= 0.9;
  }

  let  heightTarget = displayHeight;
  let  widthTarget = displayWidth;

  if (wide) {
    //in widescreen, the order of resizing of the svg is like this:
    //1 shape: use height 100%;
    if (shapes_current == 1) {
      if(widthTarget > heightTarget) {
        widthTarget = 'none';
      } else {
        heightTarget = 'none';
      }
    }
    //2 shapes (side-by-side): use width 50%;
    if (shapes_current > 1 && shapes_current <= Math.ceil(num_wheels/2)) {
      widthTarget = displayWidth/shapes_current;
      if(widthTarget > heightTarget) {
        widthTarget = 'none';
      } else {
        heightTarget = 'none';
      }
    }
    //3 shapes (side-by-side and over-under): depends on the aspect ratio.
    if (shapes_current > shapeContainers.length) {
      heightTarget = displayHeight/2;
      widthTarget = displayWidth/(Math.ceil(num_wheels/2));
      if(widthTarget > heightTarget) {
        widthTarget = 'none';
      } else {
        heightTarget = 'none';
      }
    }

  } else {
    //in not-widescreen, the order of resizing of the svg is like this:
    //1 shape: use width 100%;
    if (shapes_current == 1) {
      heightTarget = displayHeight;
      widthTarget = displayWidth;

      if(widthTarget > heightTarget) {
        widthTarget = 'none';
      } else {
        heightTarget = 'none';
      }
    }

    //2 shapes (over-under): use height 50%;
    if (shapes_current == 2) {
      heightTarget = displayHeight/2;
      widthTarget = displayWidth;

      if(widthTarget > heightTarget) {
        widthTarget = 'none';
      } else {
        heightTarget = 'none';
      }
    }

    //3 shapes (side-by-side and over-under): depends on the aspect ratio.
    if (shapes_current >  2) {
      widthTarget = displayWidth/2;
      heightTarget = displayHeight/(shapeContainersInUse);

      if(widthTarget >= heightTarget) {
        widthTarget = 'none';
      } else {
        heightTarget = 'none';
      }
    }
  }

  for (let i = 0, l = wheels.length; i < l; i++) {
    if(widthTarget === 'none') {
      wheels[i].svg.removeAttribute('width');
    } else {
      wheels[i].svg.setAttribute('width', widthTarget);
    }
    if(heightTarget === 'none') {
      wheels[i].svg.removeAttribute('height');
    } else {
      wheels[i].svg.setAttribute('height', heightTarget);
    }
  }
}

function restoreTooltips () {
  for (let tt in tooltips) {
    let tooltip = tooltips[tt];
    tooltip.classList.remove('tooltip-fade');
  }
}

function setBigNumber (position, value) {
  position.getElementsByTagName('span')[0].innerText = value;
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
    }
    let sliderInput = new Event('input', {bubbles: true, cancelable: true});
    sliderInput.automatic = true; //want to distinguish between automatic and human input for tooltip display
    slider.dispatchEvent(sliderInput);
  }
}

function setRotation () {
  //work out current mouse angle relative to shape centre
  let ang_current = calculateAngle(pos_current, shape_centre);
  let ang_diff = ang_current - ang_initial;
  //if angle goes below zero, add a full rotation to keep angle difference positive.
  if(ang_diff < 0) {ang_diff += 2*Math.PI;}
  ang_initial = ang_current;
  //rotate shape to match this...
  let transformString = dragShape.parentNode.style.transform;
  let rotation_angle = parseInt(transformString.match(/(\d+)/)[0]);
  rotation_angle += 360*ang_diff/(2*Math.PI);
  dragShape.parentNode.style.transform = `rotateZ(${rotation_angle}deg)`;
}


function updateSliderValue (slider, value) {
  slider.value = `${value}`;
  slider.setAttribute('value', `${value}`);
  let sliderInput = new Event('input', {bubbles: true, cancelable: true});
  sliderInput.automatic = true;
  slider.dispatchEvent(sliderInput);
}
