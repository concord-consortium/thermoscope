import React, {PureComponent} from 'react';
import Lab from 'react-lab';
import interactive from '../../models/interactive.json';

import '../../css/lab-model.less';

export default class LabModel extends PureComponent {
  get labProps() {
    const { temperature, tempScale } = this.props;
    return { targetTemperature: tempScale(temperature) };
  }

  render() {
    const { width, height, model } = this.props;
    return (
      <div className="lab-model">
        <div className="lab-container">
          <Lab interactive={interactive} model={model}
               props={this.labProps}
               width={width} height={height}
               propsUpdateDelay={75}
               playing={true}/>
          <div className="overlay"/>
        </div>
      </div>
    );
  }
}

LabModel.PropTypes = {
  model: React.PropTypes.object.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  temperature: React.PropTypes.number,
  tempScale: React.PropTypes.func
};

LabModel.defaultProps = {
  width: 400,
  height: 400,
  temperature: 300,
  tempScale: function (temp) {
    return temp;
  }
};
