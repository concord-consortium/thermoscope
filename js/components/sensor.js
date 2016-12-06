import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';

import '../../css/sensor-connect.less';

export default class Sensor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { connected: false , connecting: false, showDetails: false};
    this.connectedSensor = this.props.sensor;
    this.handleIPAddressChange = this.handleIPAddressChange.bind(this);
    this.connect = this.connect.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
  }

  handleIPAddressChange(event){
    this.setState({ipAddress: event.target.value});
  }

  connect(event, value) {
    if (!this.state.connected) {
      this.setState({ connecting: true });
      this.connectedSensor.connect(this.state.ipAddress);
      this.connectedSensor.on('connected', this.connected.bind(this));
    }
  }

  connected(event) {
    this.setState({ connected: true, connecting: false });
  }

  toggleDisplay(event) {
    this.setState({ showDetails: this.state.showDetails ? false : true});
  }

  render() {
    const { connected, connecting, showDetails } = this.state;
    let connectStatus = connected ? "Connected." : "";
    return (
        <div className="sensorConnect">
          <div id="toggleSensorDisplay" onClick={this.toggleDisplay}><i className="material-icons">settings_input_antenna</i></div>
            {showDetails &&
                <div className="sensorDetails">
                  <TextField hintText="IP Address" ref="ip" type="text" id="ipAddress" onChange={this.handleIPAddressChange}></TextField>
                  <RaisedButton id="connect" onClick={this.connect}>Connect</RaisedButton>
                  {connecting &&
                    <LinearProgress />
                  }
                  {!connecting && <div id="sensorConnectionStatus">{connectStatus}</div>}
                </div>}
      </div>
    )
  }
}