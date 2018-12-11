import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import CircularProgress from 'material-ui/CircularProgress';

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
   console.log("restart");
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
    const { heatValue } = this.state;
    this.setState({ heatValue: heat });
    this.applyHeat(heat);
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
    let beakerIconStyle = "beaker";
    if (!authoring === true) beakerIconStyle += "light";
    const controlsClass = authoring ? "speed-controls" : "sim-controls";
    if (!lidVisible) beakerIconStyle += " closed";
    let simulationRunStateHint = simulationRunning ? "Pause Simulation" : "Run Simulation"
    let simulationControlIcon = simulationRunning ? 'pause_circle_outline' : 'play_circle_outline';
    let heatIconStyle = heatValue == heatMultiplier ? "button heat-button hot" : "button heat-button";
    let coolIconStyle = heatValue == coolMultiplier ? "button cool-button cold" : "button cool-button";

    return(
      <div className={controlsClass}>
        {authoring &&
          <div className="button-layout-container">
            <div className="button-layout">
              <IconButton iconClassName="material-icons" className="simulation-state-button" onClick={this.toggleRunState} tooltip={simulationRunStateHint}>{simulationControlIcon}</IconButton>
            </div>

            {showFreezeButton.value === true &&
              <div className="button-layout">
                <IconButton iconClassName="material-icons" className={coolIconStyle} onClick={() => this.setHeatStatus(coolMultiplier)} tooltip="Cool">ac_unit</IconButton>
                {heatValue == coolMultiplier && <CircularProgress
                  mode="determinate"
                  value={completed}
                  className="progress"
                />}
              </div>
            }
            {showFreezeButton.value === true &&
              <div className="button-layout">
                <IconButton iconClassName="material-icons" className={heatIconStyle}
                  onClick={() => this.setHeatStatus(heatMultiplier)} tooltip="Heat">wb_sunny</IconButton>
                {heatValue == heatMultiplier && <CircularProgress
                  mode="determinate"
                  value={completed}
                  className="progress"
                />}
              </div>
            }
            {containerVisible &&
              <div className="button-layout">
                <IconButton className="container-button" onClick={this.toggleLid} tooltip="Container Lid">
                  <div className={beakerIconStyle} />
                </IconButton>
              </div>
            }

            <div className="button-layout">
              <IconButton id="restart" iconClassName="material-icons" tooltip="Reload" onClick={this.restart}>refresh</IconButton>
            </div>
          </div>
        }
        {!authoring &&
          <div className="button-layout-container">
            <div className="button-layout">
              <div className="button run" onClick={this.toggleRunState}>run</div>
            </div>

            {showFreezeButton.value === true &&
              <div className="button-layout">
                <div className={coolIconStyle} onClick={() => this.setHeatStatus(coolMultiplier)}>cool</div>
                {heatValue == coolMultiplier && <CircularProgress
                  mode="determinate"
                  value={completed}
                  className="progress"
                />}
              </div>
            }
            {showFreezeButton.value === true &&
              <div className="button-layout">
                <div className={heatIconStyle}
                  onClick={() => this.setHeatStatus(heatMultiplier)} >heat</div>
                {heatValue == heatMultiplier && <CircularProgress
                  mode="determinate"
                  value={completed}
                  className="progress"
                />}
              </div>
            }
            {containerVisible &&
              <div className="button-layout">
                <div className="button container" onClick={this.toggleLid}>lid
                </div>
              </div>
            }

            <div className="button-layout">
              <div id="restart" className="button restart" onClick={this.restart}>restart</div>
            </div>
          </div>
        }
      </div>
    )
  }
}
