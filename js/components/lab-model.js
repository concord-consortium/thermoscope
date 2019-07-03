import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Lab from 'react-lab';
import CircularProgress from 'material-ui/CircularProgress';
import interactive from '../../models/interactive.json';

import '../../css/lab-model.less';

let api, lab;

export default class LabModel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.handleModelLoad = this.handleModelLoad.bind(this);
  }

  get labProps() {
    const { temperature, tempScale, timeStepScale, gravityScale, coulombForcesSettings } = this.props;
    const props = {
      targetTemperature: tempScale(temperature)
    };
    if (timeStepScale) {
      props.timeStep = timeStepScale(temperature);
    }
    if (gravityScale) {
      props.gravitationalField = gravityScale(temperature);
    }
    if (coulombForcesSettings) {
      props.coulombForces = coulombForcesSettings(temperature);
    }
    return props;
  }

  componentWillReceiveProps(prevProps) {
    if (this.props.model !== prevProps.model) {
      this.setState({ loading: true });
    }
  }

  handleModelLoad() {
    this.setState({ loading: false });
    const { mixing } = this.props;
    api = lab.scriptingAPI;
    if (!api) return null;
    api.start();

    // Only doing this for the mixing simulation
    if (mixing != null) {
      var particlesHot = [];
      var particlesCold = [];
      var hot = "B";
      if (mixing.aTemp > mixing.bTemp) {
        hot = "A";
      }
      var isReady = false;
      var tickCount = 0;
      var mixingTimeTicks = 200;
      api.onPropertyChange('time', function (t) {
        // this will fire every tick, necessary to find out particle properties
        // and, if necessary, adjust. Filter in here to lighten the processing load

        // Do this once
        if (!isReady && particlesHot.length == 0) {
          var textboxes = api.get('textBoxes');
          if (textboxes) {
            for (let i = 0; i < textboxes.length; i++) {
              var hostParticle = textboxes[i].hostIndex;
              if (textboxes[i].text == hot) {
                if (api.getAtomProperties(hostParticle) != null) {
                  particlesHot.push(hostParticle);
                }
              }
              else {
                if (api.getAtomProperties(hostParticle) != null) {
                  particlesCold.push(hostParticle);
                }
              }
            }
            isReady = true;
          }
        }

        // Once we figure out who's hot and who's not,
        if (isReady && particlesHot.length > 0) {
          if (tickCount < mixingTimeTicks) {
            // don't need to do adjustments every single tick
            if (tickCount % 5 == 0) {
              var energyA = tickCount / mixingTimeTicks;
              api.addKEToAtoms(energyA, particlesCold);
              api.addKEToAtoms(mixingTimeTicks - tickCount, particlesHot);

              // Sanity check particle properties to prevent model diverge errors
              // which cause lockups and crashes if particle acceleration is too high
                for (var i = 0, a; i < api.getNumberOfAtoms(); i++) {
                  a = api.getAtomProperties(i);
                  if (Math.abs(i.ax) > 0.1 || Math.abs(i.ay) > 0.1) {
                    i.ax = 0.0001;
                    i.ay = 0.0001;
                  }
                }
            }
            tickCount++;
          }
        }
      });
    }
  }

  render() {
    const { width, height, model, embeddableSrc } = this.props;
    const { loading } = this.state;
    return (
      <div className="lab-model">
        <div className="lab-container">
          {loading &&
            <CircularProgress size={width * 0.5} thickness={7} style={{position: 'absolute', top: width * 0.25, left: width * 0.25}}/>
          }
          <Lab ref={node => lab = node} interactive={interactive} model={model}
               props={this.labProps}
               width={width} height={height}
               onModelLoad={this.handleModelLoad}
               embeddableSrc={embeddableSrc}/>
          <div className="overlay"/>
        </div>
      </div>
    );
  }
}

LabModel.propTypes = {
  model: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  temperature: PropTypes.number,
  tempScale: PropTypes.func,
  mixing: PropTypes.object,
  // timeStep can be also scaled with temperature to amplify difference in particles speed.
  timeStepScale: PropTypes.func
};

LabModel.defaultProps = {
  width: 400,
  height: 400,
  temperature: 300,
  tempScale: function (temp) {
    return temp;
  }
};
