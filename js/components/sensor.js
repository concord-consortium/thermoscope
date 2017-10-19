import React, { PureComponent } from 'react';
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
    if (!this.state.connected) {
      this.connectSensor();
    } else {
      this.connectedSensor.disconnect();
    }
  }

  connectSensor() {
    if (!this.state.connected) {
      this.setState({ connecting: true });
      this.connectedSensor.connect(this.state.ipAddress);
      this.connectedSensor.on('connected', this.connected.bind(this));
      this.connectedSensor.on('connectionLost', this.connectionLost.bind(this));
      this.connectedSensor.on('screenConsole', this.screenConsole.bind(this));
      this.connectedSensor.on('nameUpdate', this.nameUpdate.bind(this));
    }
  }

  connected(event) {
    this.setState({ connected: true, connecting: false });
  }
  connectionLost(event) {
    this.setState({ connected: false, connecting: false });
  }
  nameUpdate(event) {
    this.setState({ connectedSensorName: event });
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
    const { connected, connecting, connectedSensorName, showDetails, debugMessages } = this.state;
    const { showAddressBox } = this.props;
    let showDebug = DEBUG && DEBUG.toLowerCase() === "true";
    let sensorName = null;
    let prefix = "Thermoscope";
    if (connected && connectedSensorName) {
      sensorName = connectedSensorName.length > prefix.length ? connectedSensorName.substring(connectedSensorName.length - 2) : prefix;
    }
    let nameTag;

    if (sensorName != null) {
      console.log("connected to " + sensorName, connectedSensorName);
      nameTag = <div>Connected to <span id="sensor-tag-icon">{sensorName}</span></div>;
    }

    let connectButtonText = connected ? "Disconnect" : "Connect";

    return (
      <div className="sensorConnect">
        <div id="toggleSensorDisplay" onClick={this.toggleDisplay}><i className="material-icons">settings_input_antenna</i></div>
        {showDetails &&
          <div className="sensorDetails">
            {showAddressBox && <TextField hintText="IP Address" ref="ip" type="text" id="ipAddress" onChange={this.handleIPAddressChange} onKeyDown={this.enterkey}></TextField>}
            <RaisedButton id="connect" onClick={this.connect}>{connectButtonText}</RaisedButton>
            {connecting &&
              <LinearProgress />
            }
            {!connecting && <div id="sensorConnectionStatus">{nameTag}</div>}
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
