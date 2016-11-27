import React, {PureComponent} from 'react';
import Slider from 'material-ui/Slider';
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
      model: models['solid-1']
    };
    this.handleTempSliderChange = this.handleTempSliderChange.bind(this);
  }

  handleTempSliderChange(event, value) {
    this.setState({temperature: value});
  }

  render() {
    const { temperature, model } = this.state;
    return (
      <div className="thermoscope">
        <LabModel model={model.json} tempScale={model.tempScale} temperature={temperature}  width={MODEL_WIDTH} height={MODEL_HEIGHT}/>

        <div>
          Temperature {temperature}°C
          <div className="slider">
            <Slider min={MIN_TEMP} max={MAX_TEMP} step={1} value={temperature}
                    sliderStyle={{marginTop: 5, marginBottom: 5}}
                    onChange={this.handleTempSliderChange}/>
          </div>
        </div>
      </div>
    );
  }
}
