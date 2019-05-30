import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import { getURLParam } from '../utils';

import '../../css/app.less';
import '../../css/sensor-connect.less';

const DEBUG = getURLParam('debug') || 'false';

export default class Sensor extends PureComponent {
  constructor(props) {
    super(props);
    
    this.state = { connected: false, connecting: false, disconnecting: false, lostConnection: false, showDetails: false, debugMessages: "", showWinLink: false};
    this.connectedSensor = this.props.sensor;
    this.handleIPAddressChange = this.handleIPAddressChange.bind(this);
    this.connect = this.connect.bind(this);
    this.enterkey = this.enterkey.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
    this.screenConsole = this.screenConsole.bind(this);
    this.closeWinLink = this.closeWinLink.bind(this);
    this.hideLostConDlg = this.hideLostConDlg.bind(this);
    this.getSensorConnectButton = this.getSensorConnectButton.bind(this);
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
      // using callback so connectionLost isn't called before disconnecting state is set
      this.setState(
        { disconnecting: true },
        this.connectedSensor.disconnect
      );
    }
  }

  connectSensor() {
    if (!this.state.connected) {

      if (navigator.appVersion.indexOf("Win")!=-1 && navigator.bluetooth == undefined) {
        this.setState({ showWinLink: true });
        return;
      } 
      this.setState({ connecting: true, disconnecting: false, lostConnection: false });
      
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
    this.setState({ connected: false, connecting: false, lostConnection: !this.state.disconnecting });
  }
  nameUpdate(event) {
    this.setState({ connectedSensorName: event });
  }
  toggleDisplay(event) {
    this.setState({ showDetails: this.state.showDetails ? false : true });
    this.connect();
  }

  closeWinLink(event) {
    this.setState({ showWinLink: false });
  }
  
  openWinBLE(event) {
    window.location = "../windows-ble/";
  }

  hideLostConDlg(event) {
    this.setState({ lostConnection: false });
  }

  screenConsole(event) {
    const { debugMessages } = this.state;

    let newMessages = debugMessages + "\n" + event;
    this.setState({ debugMessages: newMessages });
  }

  getSensorConnectButton() {
    const { connecting, connected } = this.state;
    const state = connecting
      ? "connecting"
      : connected
        ? "connected"
        : "disconnected";
    return <div id="toggleSensorDisplay" className={`sensor-connect-icon ${state}`} onClick={this.toggleDisplay} />
  }

  render() {
    const { connected, connecting, disconnecting, lostConnection, connectedSensorName, showDetails, debugMessages, showWinLink } = this.state;
    const { showAddressBox } = this.props;
    let showDebug = DEBUG && DEBUG.toLowerCase() === "true";
    let sensorName = null;
    let prefix = "Thermoscope";
    let sensorIconStyle = "sensor-tag-icon";
    const dialogBtn = { margin: 10 };

    if (connected && connectedSensorName) {
      console.log(connectedSensorName.length);
      sensorName = connectedSensorName.length > prefix.length ? connectedSensorName.substring(connectedSensorName.length - 2) : prefix;
      this.lastSensorName = sensorName;
      sensorIconStyle = connectedSensorName.length > prefix.length ? sensorIconStyle : sensorIconStyle + " small";
    }
    let nameTag;

    if (sensorName != null) {
      console.log("connected to " + sensorName, connectedSensorName);
      nameTag = <div>Connected to <span className={sensorIconStyle}>{sensorName}</span></div>;
    }

    let connectButtonText = connected ? "Disconnect" : "Connect";

    return (
      <div className="sensorConnect">
        <Dialog open={showWinLink} ref="winLinkDlg" className="dialog">
          <div className="dialog-msg">
              It looks like you're using Windows - if you want to connect to a Thermoscope on Windows, 
              you need to install some software.</div>
          <RaisedButton onClick={this.closeWinLink} style={dialogBtn} primary={true}>Cancel</RaisedButton>
          <RaisedButton onClick={this.openWinBLE} style={dialogBtn} primary={true}>OK</RaisedButton>
        </Dialog>
        <Dialog open={lostConnection} ref="lostConDialog" className="dialog" contentStyle={{minWidth: "30%", width:0}}>
          <div className="dialog-msg sensorConnect">
            <div className={sensorIconStyle}>
              <div>{this.lastSensorName == "Thermoscope" || !this.lastSensorName ?  "🌡" : this.lastSensorName}</div>
              <div className="overlay">?</div>
            </div>
            <div>Lost connection to Thermoscope</div>
          </div>
          <RaisedButton onClick={this.hideLostConDlg} primary={true}>OK</RaisedButton>
        </Dialog>
        { this.getSensorConnectButton() }
        {showDetails &&
          <div className="sensorDetails">
            {showAddressBox && <TextField hintText="IP Address" ref="ip" type="text" id="ipAddress" onChange={this.handleIPAddressChange} onKeyDown={this.enterkey}></TextField>}
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
