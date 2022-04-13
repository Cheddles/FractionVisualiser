const SHAPES_MAX = 4;
const numerator = document.getElementById('numerator');
const denominator = document.getElementById('denominator');
const numeratorSelector = document.getElementById('numerator-selector');
const denominatorSelector = document.getElementById('denominator-selector');

//Initial values
const NUMERATOR_INITIAL = 3;
const DENOMINATOR_INITIAL = 7;
const SHAPES_INITIAL = 3;

let shapes_current = SHAPES_INITIAL;

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
