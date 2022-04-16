const wideQuery = window.matchMedia('(orientation: landscape) and (min-aspect-ratio: 16/9), (orientation: portrait) and (min-aspect-ratio: 5/11)');
wideQuery.addListener(handleResize);
let wide = false;

function handleResize(event) {
    if (!wide && event.matches) {
      wide = true;
      reassignWheels();
    } else if (wide && !event.matches) {
      wide = false;
      reassignWheels();
    }
}


const SHAPES_MAX = 4;
const DENOMINATOR_MAX = 12;
const numerator = document.getElementById('numerator');
const denominator = document.getElementById('denominator');
const numeratorSelector = document.getElementById('numerator-selector');
const denominatorSelector = document.getElementById('denominator-selector');
const addRemove = document.getElementById('addremove');
let increasing = true;

const viewboxSize = 200;
const wheels = [];
const num_containers = SHAPES_MAX/2;

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
  // numerator_current = value;
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


addRemove.addEventListener('click', function () {
  if (shapes_current < SHAPES_MAX && increasing) {
    shapes_current++;
    if (shapes_current >= SHAPES_MAX) {
      increasing = !increasing;
    }
  } else if (shapes_current > 1 && !increasing) {
    shapes_current--;
    if (shapes_current <= 1) {
      increasing = !increasing;
    }
  }
  //shift wheels to different containers for best display
  reassignWheels();
  //change visibility state on new shape and shape-containers
  hideWheels();
  //set the numerator slider maximum
  setSliderMaximum(numeratorSelector, shapes_current*parseInt(denominatorSelector.value));
});

//Initial values
const NUMERATOR_INITIAL = 3;
const DENOMINATOR_INITIAL = 7;
const SHAPES_INITIAL = 1;

let shapes_current = SHAPES_INITIAL;
let numerator_current = NUMERATOR_INITIAL;
let denominator_current = DENOMINATOR_INITIAL;
handleResize(wideQuery);
hideWheels();

updateSliderValue(denominatorSelector, DENOMINATOR_INITIAL);
updateSliderValue(numeratorSelector, NUMERATOR_INITIAL);

reassignWheels();

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

function changeMaxShapes (value) {
  //update shapes_current
  shapes_current = Math.round(value);
  if(shapes_current < 1) {shapes_current = 1;}

  //update maximum value of numerator
  let denominator_max = parseInt(denominatorSelector.value);
  setSliderMaximum(numeratorSelector, shapes_current*denominator_max);
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
    if(!wide) {
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
    } else {
      for (let i = 0, sc = 0; i < num_wheels; i++) {
        let wheel = wheels[i];
        let containerIndex = i%shapeContainers.length;
        shapeContainers[containerIndex].appendChild(wheel.element);
        if (shapes_current > shapeContainers.length) {
          shapeContainers[containerIndex].classList.add('shift-up');
        } else {
          shapeContainers[containerIndex].classList.remove('shift-up');
        }
        if(i >= shapes_current) {
          if(i < shapeContainers.length) {shapeContainers[containerIndex].classList.add('hide');}
        } else {
          shapeContainers[containerIndex].classList.remove('hide');
        }
      }
    }
  }
}


function findCoordsFromAngle(angle, radius = (viewboxSize/2 - 5), centre = {x: viewboxSize/2, y: viewboxSize/2}) {
  let angle_rad = (2*Math.PI/360)*angle;
  let x = centre.x + radius*Math.cos(angle_rad);
  let y = centre.y + radius*Math.sin(angle_rad);
  return {x, y}
}
