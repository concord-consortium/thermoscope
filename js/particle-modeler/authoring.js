import React from 'react';

const Authoring = ({gravitationalField, onChange}) => {
  let handleChange = function(evt) {
    let prop = evt.target.dataset.prop;
    onChange(prop, evt.target.value);
  }

  return (
    <div className="authoring-form">
      <h3>Authoring</h3>
      <label>
        Gravity:
        <input type="text" data-prop="gravitationalField" value={gravitationalField} onChange={handleChange} />
      </label>
    </div>
  )
}

export default Authoring;
