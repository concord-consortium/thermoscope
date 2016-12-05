import React, {PureComponent} from 'react';
import Lab from 'react-lab';
import CircularProgress from 'material-ui/CircularProgress';
import interactive from '../../models/interactive.json';

import '../../css/lab-model.less';

export default class LabModel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.handleModelLoad = this.handleModelLoad.bind(this);
  }

  get labProps() {
    const { temperature, tempScale } = this.props;
    return { targetTemperature: tempScale(temperature) };
  }

  componentDidUpdate(prevProps) {
    this.setState({ loading: (this.props.model !== prevProps.model) });
  }

  handleModelLoad() {
    this.setState({loading: false});
  }

  render() {
    const { width, height, model } = this.props;
    const { loading } = this.state;
    return (
      <div className="lab-model">
        <div className="lab-container">
          {loading &&
            <CircularProgress size={width * 0.5} thickness={7} style={{position: 'absolute', top: width * 0.25, left: width * 0.25}}/>
          }
          <Lab interactive={interactive} model={model}
               props={this.labProps}
               width={width} height={height}
               onModelLoad={this.handleModelLoad}
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
