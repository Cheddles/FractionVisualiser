let MAX_SHAPES = 2;

const numerator = document.getElementById('numerator');
const denominator = document.getElementById('denominator');

let setSliderMaximum = (slider, max) => {
  let newMax = Math.round(max);
  if (newMax < 1) {newMax = 1;}

  let currentValue = parseInt(slider.value);
  let min = parseInt(slider.getAttribute('min'));
  let currentMax = parseInt(slider.getAttribute('max'));

  if (newMax != currentMax) {
    //1: set the new maximum value for the slider (if needed or valid!)
    slider.setAttribute('max', `${newMax}`);
    console.log('changing the max');

    //2: update the current value of the slider as necessary
    //3: trigger any necessary events to make this manifest in other places.
    if (currentValue > MAX_SHAPES*newMax) {
      console.log('should be changin');
      slider.value = `${MAX_SHAPES*newMax}`;
      slider.setAttribute('value', `${MAX_SHAPES*newMax}`);
      let sliderInput = new Event('input', {bubbles: true, cancelable: true});
      slider.dispatchEvent(sliderInput);
    }
  }
}

let setBigNumber = (position, value) => {
  position.getElementsByTagName('span')[0].innerText = value;
}

let numeratorSelector = document.getElementById('numerator-selector');
let denominatorSelector = document.getElementById('denominator-selector');

denominatorSelector.addEventListener('input', function (event) {
  let value = parseInt(event.target.value);
  setSliderMaximum(numeratorSelector, value);
  setBigNumber(denominator, value);
});

numeratorSelector.addEventListener('input', function (event) {
  let value = parseInt(event.target.value);
  setBigNumber(numerator, value);
});
