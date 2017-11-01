import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import CircularProgress from 'material-ui/CircularProgress';

let slowSpeedTimeStep = 0.05;
let frozenTemps = {temperatureControl: true, targetTemperature: 0};

export default class SimulationControls extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { completed: 0, isFrozen: false, isSlowed: false };
    this.freeze = this.freeze.bind(this);
    this.slow = this.slow.bind(this);
    this.restart = this.restart.bind(this);
    this.toggleLid = this.toggleLid.bind(this);
  }

  restart() {
   console.log("restart");
   window.location.reload();
  }

  freeze() {
    const {onChange} = this.props;
    let normalTemps = {temperatureControl: this.props.temperatureControl.value, targetTemperature: this.props.targetTemperature.value}

    onChange(frozenTemps);

    this.setState({isFrozen: true});
    this.progress(5, 500, function() {
      onChange(normalTemps);
    });
  }

  slow() {
    const {onChange} = this.props;
    let oldTimeStep = this.props.timeStep.value;
    onChange({timeStep: slowSpeedTimeStep});
    this.setState({isSlowed: true});
    this.progress(5, 2500, function(){
      onChange({timeStep: oldTimeStep});
    });
  }

  progress(completed, totalTime, onComplete) {
    if (completed > 100) {
      this.setState({completed: 100});
      this.timer = setTimeout(() => {
        this.setState({completed: 0, isSlowed: false, isFrozen: false});
        onComplete();
      }, 100);
    } else {
      if (this.state.completed != completed){
        this.setState({completed});
      }
      const nextCompleted = completed + 25;
      this.timer = setTimeout(() => this.progress(nextCompleted, totalTime, onComplete), totalTime / 4);
    }
   }

   toggleLid() {
    const { onContainerLid } = this.props;
    onContainerLid();
  }

  render() {
    const {isSlowed, isFrozen, completed} = this.state;
    const { showFreezeButton, container, containerLid, authoring } = this.props;
    let containerVisible = container.value;
    let lidVisible = containerLid.value;
    let beakerIconStyle = "beaker";
    if (!authoring===true) beakerIconStyle += "light";
    if (!lidVisible) beakerIconStyle += " closed";

    return(
      <div className="speed-controls">
        <div className="button-layout">
          <IconButton id="restart" iconClassName="material-icons" tooltip="reload" onClick={this.restart}>refresh</IconButton>
        </div>
        {showFreezeButton.value === true &&
          <div className="button-layout">
            <IconButton  iconClassName="material-icons" className="speed-button" onClick={this.freeze} tooltip="freeze">ac_unit</IconButton>
              {isFrozen && <CircularProgress
                  mode="determinate"
                  value={completed}
                  className="progress"
                />}
            </div> }
        {showFreezeButton.value === true &&
          <div className="button-layout">
            <IconButton iconClassName="material-icons" className="speed-button" onClick={this.slow} tooltip="slow">directions_run</IconButton>
            {isSlowed && <CircularProgress
                mode="determinate"
                value={completed}
                className="progress"
              />}
          </div>}
        {containerVisible &&
          <div className="button-layout">
            <IconButton className="container-button" onClick={this.toggleLid} tooltip="container">
              <div className={beakerIconStyle} />
            </IconButton>
          </div>
        }
      </div>
    )
  }
}
