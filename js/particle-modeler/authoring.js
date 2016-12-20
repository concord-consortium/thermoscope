import React from 'react';
import Slider from 'material-ui/Slider';

const Authoring = (props) => {
  let handleCheckboxChange = function (evt) {
    props.onChange(evt.target.dataset.prop, evt.target.checked);
  }

  let createCheckboxInput = function(prop, values) {
    return (
      <div key={prop}>
        {values.label}:
        <input type="checkbox" data-prop={prop} checked={values.value} onChange={handleCheckboxChange} />
      </div>
    );
  }

  let createSliderInput = function(prop, values, mini) {
    let scale = (values.max - values.min > 1) ? 1 : 1/(values.max - values.min),
        handleChange = function(evt, val) {
          val /= scale;
          val = val < 1 && val > -1 && val != 0 ? val.toPrecision(3) : val;
          props.onChange(prop, val);
        },
        wrapperClass = "authoring-slider";
    if (mini) {
      wrapperClass += " mini";
    }
    return (
      <div className={wrapperClass} key={prop}>
        <div>{values.label}: {values.value}</div>
        <Slider
          min={values.min * scale}
          max={values.max * scale}
          value={values.value * scale}
          step={((values.max - values.min) * scale) / 100}
          onChange={handleChange}
          sliderStyle={{ marginTop: 5, marginBottom: 5, width: "200px" }}
        />
      </div>
    );
  }

  function modelInputMap(key) {
    if (!props[key].hasOwnProperty("label") || props[key].hasOwnProperty("element")) {
      return null;
    } else if (typeof props[key].value === "number") {
      return createSliderInput(key, props[key]);
    } else {
      return createCheckboxInput(key, props[key]);
    }
  }

  function elementInputMap(element) {
    return function(key) {
      if (props[key].hasOwnProperty("element") && props[key].element == element) {
        return createSliderInput(key, props[key], true);
      }
    }
  }


  let inputs = Object.keys(props).map(modelInputMap),

      elem1 = Object.keys(props).map(elementInputMap(0)),
      elem2 = Object.keys(props).map(elementInputMap(1)),
      elem3 = Object.keys(props).map(elementInputMap(2));



  return (
    <div className="authoring-form">
      <h3>Authoring</h3>
      { inputs }
      <h4>Element 1</h4>
      { elem1 }
      <h4>Element 2</h4>
      { elem2 }
      <h4>Element 3</h4>
      { elem3 }
    </div>
  )
}

export default Authoring;
