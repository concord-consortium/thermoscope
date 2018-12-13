import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import CircularProgress from 'material-ui/CircularProgress';

import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const slowSpeedTimeStep = 0.05;
const frozenTemps = { temperatureControl: true, targetTemperature: 0 };
const heatMultiplier = 1.1;
const coolMultiplier = 0.8;
const noHeat = 1.0;


export default class SimulationControls extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      heatValue: 0
    }
    this.state = { completed: 0, isFrozen: false, isSlowed: false };
    this.freeze = this.freeze.bind(this);
    this.setHeatStatus = this.setHeatStatus.bind(this);
    this.applyHeat = this.applyHeat.bind(this);
    this.slow = this.slow.bind(this);
    this.restart = this.restart.bind(this);
    this.toggleLid = this.toggleLid.bind(this);
    this.toggleRunState = this.toggleRunState.bind(this);
  }

  restart() {
   window.location.reload();
  }

  freeze() {
    const { onChange } = this.props;
    // turn off heater
    this.setHeatStatus(noHeat);

    let normalTemps = {temperatureControl: this.props.temperatureControl.value, targetTemperature: this.props.targetTemperature.value}

    onChange(frozenTemps);

    this.setState({isFrozen: true, heatValue: 0});
    this.progress(5, 500, function() {
      onChange(normalTemps);
    });
  }
  setHeatStatus(heat) {
    const { completed } = this.state;
    if (completed === 0) {
      // only allow change of heat when previous cycle completed
      this.setState({ heatValue: heat });
      this.applyHeat(heat);
    }
  }

  applyHeat(heat) {
    const { onToggleHeat } = this.props;
    onToggleHeat(heat);
    this.progress(5, 2000, function() {
      onToggleHeat(noHeat);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { heatValue } = this.state;
    const { onToggleHeat } = this.props;
    if (heatValue > 0) {
      onToggleHeat(heatValue);
    }
  }

  slow() {
    const { onChange } = this.props;

    let oldTimeStep = this.props.timeStep.value;
    onChange({timeStep: slowSpeedTimeStep});
    this.setState({isSlowed: true, heatValue: 0});
    this.progress(5, 2500, function(){
      onChange({timeStep: oldTimeStep});
    });
  }

  progress(completed, totalTime, onComplete) {
    if (completed > 100) {
      this.setState({completed: 100});
      this.timer = setTimeout(() => {
        this.setState({completed: 0, isSlowed: false, isFrozen: false, heatValue: 0});
        onComplete();
      }, 100);
    } else {
      if (this.state.completed != completed) {
        this.setState({completed});
      }
      const nextCompleted = completed + 10;
      this.timer = setTimeout(() => this.progress(nextCompleted, totalTime, onComplete), totalTime / 10);
    }
   }

  toggleLid() {
    const { onContainerLid } = this.props;
    onContainerLid();
  }
  toggleRunState() {
    const { onToggleRunState } = this.props;
    onToggleRunState();
  }

  render() {
    const { isSlowed, isFrozen, heatValue, completed } = this.state;
    const { showFreezeButton, container, containerLid, authoring, simulationRunning } = this.props;
    let containerVisible = container.value;
    let lidVisible = containerLid.value;
    let beakerIconStyle = "button beaker";
    const controlsClass = authoring ? "sim-controls" : "sim-controls";
    if (!lidVisible) beakerIconStyle += " closed";
    let simulationRunStateHint = simulationRunning ? "Pause Simulation" : "Run Simulation"
    let simulationControlIcon = simulationRunning ? 'pause_circle_outline' : 'play_circle_outline';
    let heatIconStyle = heatValue == heatMultiplier ? "button heat-button hot" : "button heat-button";
    let coolIconStyle = heatValue == coolMultiplier ? "button cool-button cold" : "button cool-button";

    let runButtonStyle = simulationRunning ? "button pause" : "button run";
    let runButtonText = simulationRunning ? "Pause" : "Run";
    let lidButtonText = lidVisible ? "Lid Off" : "Lid On";

    return(
      <div className={controlsClass}>
          <div className="button-layout-container">
            <div className="button-layout">
              <div className={runButtonStyle} onClick={this.toggleRunState}></div>
              <div className="nameplate run">{runButtonText}</div>
            </div>

            {showFreezeButton.value === true &&
              <div className="button-layout">
                <div className={coolIconStyle} onClick={() => this.setHeatStatus(coolMultiplier)}>
                  {heatValue == coolMultiplier && <CircularProgressbar
                    percentage={completed}
                    textForPercentage={null}
                    className="progress-new cool"
                    strokeWidth={15}
                  />}
                </div>
            <div className="nameplate cool">Cool</div>
              </div>
            }
            {showFreezeButton.value === true &&
              <div className="button-layout">
                <div className={heatIconStyle}
                  onClick={() => this.setHeatStatus(heatMultiplier)} >
                  {heatValue == heatMultiplier && <CircularProgressbar
                    percentage={completed}
                    textForPercentage={null}
                    strokeWidth={15}
                    className="progress-new heat"
                  />}
                </div>
            <div className="nameplate heat">Heat</div>
              </div>
            }
            {containerVisible &&
              <div className="button-layout">
                <div className={beakerIconStyle} onClick={this.toggleLid}>
              </div>
              <div className="nameplate lid">{lidButtonText}</div>
              </div>
            }

            <div className="button-layout">
              <div id="restart" className="button restart" onClick={this.restart}></div>
              <div className="nameplate restart">Restart</div>
            </div>
          </div>
      </div>
    )
  }
}
