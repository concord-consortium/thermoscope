import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import LogoMenu from '../components/logo-menu';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { GridList, GridTile } from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';

import '../../css/app.less';
import '../../css/icon-setter.less';

// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

const icons = ['🐞', '🦋', '🍎', '🍄', '🌈', '⭐', '🚜', '✈', '⚽', '🍒', '🐟', '🐢', '🚀',
               '🐿', '🐌', '🌼', '🐙', '🌵', '🦀', '🚁', '⛄', '🐝', '🔑', '💡', '🐍', 'A' ];

const nameServiceAddr = 0x1234;
const nameCharacteristicAddr = 0x2345;

const instr_start = 'Click "Connect" and select a Thermoscope to set its icon';
const instr_connected = 'Select a new icon for the Thermoscope and click "Set Icon"';
const instr_changed = 'Click "Disconnect" and turn the Thermoscope off and on again';


export class IconSetter extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      iconChanged: false,
      status: "not connected",
      currentIcon: '',
      selectedIcon: ''
    };

    this.iconCharacteristic = null;

    this.decoder = new TextDecoder('utf-8');
    this.encoder = new TextEncoder('utf-8');

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.selectIcon = this.selectIcon.bind(this);
    this.setIcon = this.setIcon.bind(this);
  }

  connect() {
    console.log("connect");
    let request = navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "Thermoscope" }],
      optionalServices: [nameServiceAddr]
    });


    var component = this;
    // Step 2: Connect to it
    request.then(function(device) {
      component.setState({
        status: "connecting",
        iconChanged: false
      });
      return device.gatt.connect();
    })
    // Step 3: Get the icon service
    .then(function(server) {
      component.setState({
        status: "getting icon service"
      });
      window.server = server;
      return server.getPrimaryService(nameServiceAddr);
    })
    .then(function(service){
      component.setState({
        status: "getting characteristic"
      });
      return service.getCharacteristic(nameCharacteristicAddr);
    })
    .then(function(characteristic){
      component.iconCharacteristic = characteristic;
      component.setState({
        status: "reading characteristic"
      });
      return characteristic.readValue();
    })
    .then(function(value){
      var iconVal = component.decoder.decode(value);
      component.setState({
        connected: true,
        status: "current icon value: " + iconVal,
        currentIcon: iconVal,
        selectedIcon: iconVal
      });
    })
    .catch(function(error) {
      console.error('Connection failed!', error);
      component.setState({
        status: "connection failed"
      });
    });
  }

  disconnect() {
    window.server.disconnect();

    this.setState({
      connected: false,
      status: "disconnected"
    });
  }

  selectIcon(event) {
    var icon = event.target.value;
    this.setState({
      selectedIcon: icon
    });
  }

  setIcon() {
    var encoded = this.encoder.encode(this.state.selectedIcon);

    this.iconCharacteristic.writeValue(encoded);
    this.setState({
      iconChanged: true,
      status: "current icon value: " + this.state.selectedIcon,
      currentIcon: this.state.selectedIcon
    });
  }

  getInstructions() {
    var newInstr = '';
    if(!this.state.connected) {
      newInstr = instr_start;
    } else if(!this.state.iconChanged) {
      newInstr = instr_connected;
    } else {
      newInstr = instr_changed;
    }

    return newInstr;
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="app icon-setter">
          <h1>Thermoscope Icon Setter</h1>
          <LogoMenu scale="logo-menu"/>
          <h3 id="instructions" className="message">
            {this.getInstructions()}
          </h3>
          <div className="app-container">
            <div>
              {!this.state.connected && <RaisedButton id="connect" onClick={this.connect}>Connect</RaisedButton>}
              {this.state.connected && <RaisedButton id="disconnect" onClick={this.disconnect}>Disconnect</RaisedButton>}
            </div>
            {this.state.connected && <div>
              <select id="icon-select" value={this.state.selectedIcon} onChange={this.selectIcon} className="icons">
              {icons.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
              </select>
              <RaisedButton id="set-icon" onClick={this.setIcon} className="button2"
                disabled={this.state.selectedIcon == this.state.currentIcon}>
                Set Icon</RaisedButton>
            </div>}

          </div>
          <div id="status" className="message">{this.state.status}</div>
          <div className="instructions">
            <div>After the icon has been set, and the thermoscope power cycled, the device will still show up with the
              wrong name on any computer or tablet that saw it with the wrong name. The device is saying "Hi, I'm device 12345,
              my name is Thermoscope X". The operating system sees "12345" and ignores the rest, so it continues to show
              the device with the name "Thermoscope". However, after a connection has been made to the device then the
              operating system updates its name for "12345" to be "Thermoscope X"
              </div>
          </div>

        </div>
      </MuiThemeProvider>
    );
  }

}

ReactDOM.render(<IconSetter/>, document.getElementById('app'));
