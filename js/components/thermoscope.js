import React, {PureComponent} from 'react';
import Slider from 'material-ui/Slider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import LabModel from './lab-model';
import models, {MIN_TEMP, MAX_TEMP} from '../models';

import '../../css/thermoscope.less';

const MODEL_WIDTH = 400;
const MODEL_HEIGHT = 400;

export default class Thermoscope extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      temperature: 20,
      materialType: 'solid',
      materialIdx: 0
    };
    this.handleTempSliderChange = this.handleTempSliderChange.bind(this);
    this.handleMaterialTypeChange = this.handleMaterialTypeChange.bind(this);
    this.handleMaterialIdxChange = this.handleMaterialIdxChange.bind(this);
  }

  handleTempSliderChange(event, value) {
    this.setState({temperature: value});
  }

  handleMaterialTypeChange(event, value) {
    this.setState({materialType: value, materialIdx: 0});
  }

  handleMaterialIdxChange(event, value) {
    this.setState({materialIdx: value});
  }

  render() {
    const { temperature, materialType, materialIdx } = this.state;
    const model = models[materialType][materialIdx];
    return (
      <div className="thermoscope">
        <LabModel model={model.json} tempScale={model.tempScale} temperature={temperature}  width={MODEL_WIDTH} height={MODEL_HEIGHT}/>

        <div>
          <div className="controls-row">
            Temperature {temperature}°C
            <div className="slider">
              <Slider min={MIN_TEMP} max={MAX_TEMP} step={1} value={temperature}
                      sliderStyle={{marginTop: 5, marginBottom: 5}}
                      name="temperature"
                      onChange={this.handleTempSliderChange}/>
            </div>
          </div>
          <div className="controls-row">
            <div className="material-type-select">
              <RadioButtonGroup name="material-type" valueSelected={materialType} onChange={this.handleMaterialTypeChange}>
                <RadioButton value="solid" label="Solid"/>
                <RadioButton value="liquid" label="Liquid"/>
                <RadioButton value="gas" label="Gas"/>
              </RadioButtonGroup>
            </div>
            <div className="material-select">
              <SelectField floatingLabelText="Material" value={materialIdx} onChange={this.handleMaterialIdxChange}>
                {models[materialType].map((model, idx) =>
                  <MenuItem key={idx} value={idx} primaryText={model.name}/>
                )}
              </SelectField>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
