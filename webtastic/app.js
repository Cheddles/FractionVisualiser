const SHAPES_MAX = 6;
const DENOMINATOR_MAX = 12;
const NUMERATOR_INITIAL = 3;
const DENOMINATOR_INITIAL = 7;
const SHAPES_INITIAL = 1;
const viewboxSize = 200;
const wheels = [];
const num_containers = SHAPES_MAX/2;

let shapes_current = SHAPES_INITIAL;
let numerator_current = NUMERATOR_INITIAL;
let denominator_current = DENOMINATOR_INITIAL;
let shapeType = 'circle';

let dragging = false;
let pos_current = {x: 0, y: 0};
let pos_initial = {x: 0, y: 0};
let shape_centre = {x: 0, y: 0};
let ang_initial = 0;
let dragShape;

const numerator = document.getElementById('numerator');
const denominator = document.getElementById('denominator');
const numeratorSelector = document.getElementById('numerator-selector');
const denominatorSelector = document.getElementById('denominator-selector');
const shapeAdd = document.getElementById('shape-add');
const shapeRemove = document.getElementById('shape-remove');
const shapeQuantity = document.getElementsByClassName('shape-quantity')[0];



let shapeDisplay = document.getElementsByClassName('shape-display')[0];
for (i = 0; i < num_containers; i++) {
  let sc = document.createElement('div');
  sc.classList.add('shape-container');
  if (i > 0) {sc.classList.add('hide');}
  shapeDisplay.appendChild(sc);
}

for (let i = 0; i < SHAPES_MAX; i++) {
  //generate Wheels and append to alternating shape-containers
  let containerIndex = i%num_containers;
  let wheel = new Wheel;
  document.getElementsByClassName('shape-container')[containerIndex].appendChild(wheel.element);
  wheels.push(wheel);
}


const wideQuery = window.matchMedia('(orientation: landscape) and (min-aspect-ratio: 16/9), (orientation: portrait) and (min-aspect-ratio: 5/11)');
wideQuery.addListener(handleResize);
let wide = false;


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
      shapes_current++;
    }
  }
  if(event.target == shapeRemove) {
    if (shapes_current > 1) {
      shapes_current--;
    }
  }
  //shift wheels to different containers for best display
  reassignWheels();
  //change visibility state on new shape and shape-containers
  hideWheels();
  //set the numerator slider maximum
  setSliderMaximum(numeratorSelector, shapes_current*parseInt(denominatorSelector.value));
});



handleResize(wideQuery);
hideWheels();



updateSliderValue(denominatorSelector, DENOMINATOR_INITIAL);
updateSliderValue(numeratorSelector, NUMERATOR_INITIAL);

reassignWheels();



//FUNctions//

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
    }
    let sliderInput = new Event('input', {bubbles: true, cancelable: true});
    slider.dispatchEvent(sliderInput);
  }
}

function setBigNumber (position, value) {
  position.getElementsByTagName('span')[0].innerText = value;
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


  let bbox = document.getElementsByClassName('shape-display')[0].getBoundingClientRect();
  let displayWidth = bbox.width;
  let displayHeight = bbox.height;
  if(shapeType == 'square') {
    console.log('L7');

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
      widthTarget = displayWidth/(shapeContainersInUse);
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

function handleResize(event) {
  if (!wide && event.matches) {
    wide = true;
  } else if (wide && !event.matches) {
    wide = false;
  }
}

function findCoordsFromAngle(angle, radius = (viewboxSize/2 - 5), centre = {x: viewboxSize/2, y: viewboxSize/2}) {
  let angle_rad = (2*Math.PI/360)*angle;
  let x = centre.x + radius*Math.cos(angle_rad);
  let y = centre.y + radius*Math.sin(angle_rad);
  return {x, y}
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

function setRotation () {
  //work out current mouse angle relative to shape centre

  let ang_current = calculateAngle(pos_current, shape_centre);

  let ang_diff = ang_current - ang_initial;
  //if pointer is moved backwards across rotational origin, avoid a negative difference
  //by adding a full revolution to the difference.
  if(ang_diff < 0) {ang_diff += 2*Math.PI;}
  ang_initial = ang_current;
  //rotate shape to match this...
  let transformString = dragShape.style.transform;
  let rotation_angle = parseInt(transformString.match(/(\d+)/)[0]);
  rotation_angle += 360*ang_diff/(2*Math.PI);
  dragShape.style.transform = `rotateZ(${rotation_angle}deg)`;

}

function calculateAngle (positionVector, centreVector = {x: 0, y: 0}) {
  let ang = Math.atan2(positionVector.y - centreVector.y, positionVector.x - centreVector.x);
  return ang;
}
