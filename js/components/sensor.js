import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import '../../css/sensor-connect.less';

export default class Sensor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { connected: false };
    this.handleIPAddressChange = this.handleIPAddressChange.bind(this);
    this.connect = this.connect.bind(this);
  }
  handleIPAddressChange(event){
    this.setState({ipAddress: event.target.value});
  }

  connect(event, value) {
    if (!this.state.connected) {
      this.props.sensor.connect(this.state.ipAddress);
      this.props.sensor.on('connected', this.connected.bind(this));
    }
  }

  connected(event) {
    this.setState({ connected: true });
  }
  render() {
    let connectStatus = this.state.connected ? "Connected." : "";
    return (
      <div className="sensorConnect">
        <TextField hintText="IP Address" ref="ip" type="text" id="ipAddress" onChange={this.handleIPAddressChange}></TextField>
        <RaisedButton id="connect" onClick={this.connect}>Connect</RaisedButton>
        <div id="sensorConnectionStatus">{connectStatus}</div>
      </div>
    )
  }
}