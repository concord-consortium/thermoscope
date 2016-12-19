import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Slider from 'material-ui/Slider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Required by Material-UI library.
injectTapEventPlugin();

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

  let createSliderInput = function(prop, values) {
    let scale = (values.max - values.min > 1) ? 1 : 1/(values.max - values.min) ,
        handleChange = function(evt, val) {
          val /= scale;
          val = val < 1 && val > -1 && val != 0 ? val.toPrecision(3) : val;
          props.onChange(prop, val);
        }
    return (
      <div key={prop}>
        {values.label}: {values.value}
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

  let inputs = Object.keys(props).map(function(key) {
    if (!props[key].hasOwnProperty("label")) {
      return null;
    } else if (typeof props[key].value === "number") {
      return createSliderInput(key, props[key]);
    } else {
      return createCheckboxInput(key, props[key]);
    }
  });

  return (
    <MuiThemeProvider>
      <div className="authoring-form">
        <h3>Authoring</h3>
        { inputs }
      </div>
    </MuiThemeProvider>
  )
}

export default Authoring;
