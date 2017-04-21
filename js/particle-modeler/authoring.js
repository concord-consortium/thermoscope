import React from 'react';
import Slider from 'material-ui/Slider';

const Authoring = (props) => {
  let handleCheckboxChange = function (evt) {
    props.onChange(evt.target.dataset.prop, evt.target.checked);
  }

  let createCheckboxInput = function(prop, values) {
    let label = values.label ? <span>{values.label}: </span> : null;
    return (
      <div key={prop}>
        { label }
        <input type="checkbox" data-prop={prop} checked={values.value} onChange={handleCheckboxChange} />
      </div>
    );
  }

  let createSliderInput = function(prop, values, mini, table) {
    let scale = (values.max - values.min > 1) ? 1 : 1/(values.max - values.min),
        handleChange = function(evt, val) {
          val /= scale;
          val = val < 1 && val > -1 && val != 0 ? val.toPrecision(3) : val;
          props.onChange(prop, val);
        },
        wrapperClass = "authoring-slider",
        label = values.label ? <span>{values.label}: </span> : null;
    if (mini) {
      wrapperClass += " mini";
    }
    return (
      <div className={wrapperClass} key={prop}>
        <div>{ label }{ values.value }</div>
        <Slider
          min={values.min * scale}
          max={values.max * scale}
          value={values.value * scale}
          step={((values.max - values.min) * scale) / 100}
          onChange={handleChange}
          sliderStyle={{ marginTop: 5, marginBottom: 5, width: table ? "160px" : "200px" }}
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

  function createPairwiseTable() {
    let pairwiseUI = {use: [[],[],[]], epsilon: [[],[],[]], sigma: [[],[],[]]}
    for (let key in props) {
      let prop = props[key];
      if (prop.hasOwnProperty("element1")) {
        let ui;
        if (prop.property == "use") {
          ui = createCheckboxInput(key, prop);
        } else {
          ui = createSliderInput(key, prop, false, true);
        }
        pairwiseUI[prop.property][prop.element1][prop.element2] = ui;
      }
    }
    let rows = [];
    for (let i = 0, ii = pairwiseUI.use.length; i < ii; i++) {
      for (let j = i, jj=pairwiseUI.use[i].length; j < jj; j++) {
        if (pairwiseUI.use[i][j]) {
          let pair = (i+1) + "-" + (j+1);

          rows.push(
            <tr key={pair}>
              <td key={"id" + pair}>{pair}</td>
              <td key={"use" + pair}>{pairwiseUI.use[i][j]}</td>
              <td key={"epsilon" + pair}>{pairwiseUI.epsilon[i][j]}</td>
              <td key={"sigma" + pair}>{pairwiseUI.sigma[i][j]}</td>
            </tr>
          );
        }
      }
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th>Use?</th>
            <th>Epsilon</th>
            <th>Sigma</th>
          </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    )
  }


  let inputs = Object.keys(props).map(modelInputMap),

      elem1 = Object.keys(props).map(elementInputMap(0)),
      elem2 = Object.keys(props).map(elementInputMap(1)),
      elem3 = Object.keys(props).map(elementInputMap(2)),

      pairwiseTable = createPairwiseTable();



  return (
    <div className="authoring-form">
      <h3 className="authoring-header">Authoring</h3>
      <h3>Inputs</h3>
      <div className="value-block">{inputs}</div>

      <h3>Element 1</h3>
      <div className="value-block">{elem1}</div>

      <h3>Element 2</h3>
      <div className="value-block">{elem2}</div>

      <h3>Element 3</h3>
      <div className="value-block">{elem3}</div>

      <h3>Pairwise Forces</h3>
      <div className="value-block">{ pairwiseTable }</div>
    </div>
  )
}

export default Authoring;
