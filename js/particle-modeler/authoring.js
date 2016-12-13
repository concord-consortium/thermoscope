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
        <input type="checkbox" data-prop={property} checked={props[property]} onChange={handleCheckboxChange} />
      </div>
    );
  }

  let createSliderInput = function(property, label) {
    let handleChange = function(evt, val) {
      props.onChange(property, val);
    }
    return (
      <div>
        {label}:
        <Slider
          min={0}
          max={100}
          value={props[property]}
          onChange={handleChange}
          sliderStyle={{ marginTop: 5, marginBottom: 5 }}
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
