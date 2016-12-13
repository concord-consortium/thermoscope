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

  let createCheckboxInput = function(property, label) {
    return (
      <div>
        {label}:
        <input type="checkbox" data-prop={property} checked={props[property].value} onChange={handleCheckboxChange} />
      </div>
    );
  }

  let createSliderInput = function(property, label) {
    let prop = props[property],
        scale = (prop.max - prop.min > 1) ? 1 : 1/(prop.max - prop.min) ,
        handleChange = function(evt, val) {
          val /= scale;
          val = val < 1 && val > 0 ? val.toPrecision(2) : val;
          props.onChange(property, val);
        }
    return (
      <div>
        {label}: {prop.value}
        <Slider
          min={prop.min * scale}
          max={prop.max * scale}
          value={prop.value * scale}
          step={((prop.max - prop.min) * scale) / 100}
          onChange={handleChange}
          sliderStyle={{ marginTop: 5, marginBottom: 5, width: "200px" }}
        />
      </div>
    );
  }

  return (
    <MuiThemeProvider>
      <div className="authoring-form">
        <h3>Authoring</h3>
        { createCheckboxInput("temperatureControl", "Heatbath") }
        { createSliderInput("targetTemperature", "Heatbath Temperature") }
        { createSliderInput("gravitationalField", "Gravity") }
        { createSliderInput("timeStep", "Time Step") }
        { createSliderInput("viscosity", "Viscosity") }
      </div>
    </MuiThemeProvider>
  )
}

export default Authoring;
