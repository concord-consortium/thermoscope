import React, { PureComponent, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import { getURLParam } from '../utils';

import '../../css/sensor-connect.less';

const DEBUG = getURLParam('debug') || 'false';

export default class Sensor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { connected: false, connecting: false, showDetails: false, debugMessages: "" };
    this.connectedSensor = this.props.sensor;
    this.handleIPAddressChange = this.handleIPAddressChange.bind(this);
    this.connect = this.connect.bind(this);
    this.enterkey = this.enterkey.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.screenConsole = this.screenConsole.bind(this);
  }

  handleIPAddressChange(event) {
    this.setState({ ipAddress: event.target.value });
  }

  enterkey(event, value) {
    if (event.keyCode == 13) {
      this.connectSensor();
    }
  }

  connect(event, value) {
    this.connectSensor();
  }

  connectSensor() {
    if (!this.state.connected) {
      this.setState({ connecting: true });
      this.connectedSensor.connect(this.state.ipAddress);
      this.connectedSensor.on('connected', this.connected.bind(this));
      this.connectedSensor.on('screenConsole', this.screenConsole.bind(this));
    }
  }

  connected(event) {
    this.setState({ connected: true, connecting: false });
  }

  toggleDisplay(event) {
    this.setState({ showDetails: this.state.showDetails ? false : true });
  }

  screenConsole(event) {
    const { debugMessages } = this.state;

    let newMessages = debugMessages + "\n" + event;
    this.setState({ debugMessages: newMessages });
  }

  render() {
    const { connected, connecting, showDetails, debugMessages } = this.state;
    let showDebug = DEBUG && DEBUG.toLowerCase() === "true";

    let connectStatus = connected ? "Connected." : "";
    return (
      <div className="sensorConnect">
        <div id="toggleSensorDisplay" onClick={this.toggleDisplay}><i className="material-icons">settings_input_antenna</i></div>
        {showDetails &&
          <div className="sensorDetails">
            <TextField hintText="IP Address" ref="ip" type="text" id="ipAddress" onChange={this.handleIPAddressChange} onKeyDown={this.enterkey}></TextField>
            <RaisedButton id="connect" onClick={this.connect}>Connect</RaisedButton>
            {connecting &&
              <LinearProgress />
            }
            {!connecting && <div id="sensorConnectionStatus">{connectStatus}</div>}
            {showDebug &&
              <div id="screenConsole">{debugMessages}</div>
            }
          </div>}
      </div>
    )
  }
}

Sensor.defaultProps = {
  debug: false
};
