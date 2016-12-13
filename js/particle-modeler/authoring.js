import React from 'react';

const Authoring = (props) => {
  let handleChange = function(evt) {
    props.onChange(evt.target.dataset.prop, evt.target.value);
  }

  let handleCheckboxChange = function (evt) {
    props.onChange(evt.target.dataset.prop, evt.target.checked);
  }

  let createCheckboxInput = function(property, label) {
    return (
      <p>
        <label>
          {label}:
          <input type="checkbox" data-prop={property} checked={props[property]} onChange={handleCheckboxChange} />
        </label>
      </p>
    );
  }

  let createTextInput = function(property, label) {
    return (
      <p>
        <label>
          {label}:
          <input type="text" data-prop={property} value={props[property]} onChange={handleChange} />
        </label>
      </p>
    );
  }

  return (
    <div className="authoring-form">
      <h3>Authoring</h3>
      { createCheckboxInput("temperatureControl", "Heatbath") }
      { createTextInput("targetTemperature", "Heatbath Temperature") }
      { createTextInput("gravitationalField", "Gravity") }
      { createTextInput("timeStep", "Time Step") }
      { createTextInput("viscosity", "Viscosity") }
    </div>
  )
}

export default Authoring;
