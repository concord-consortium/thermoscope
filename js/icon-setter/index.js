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
               '🐿', '🐌', '🌼', '🐙', '🌵', '🦀', '🚁', '⛄', '🐝', '🔑', '💡', '🐍' ];

const nameServiceAddr = 0x1234;
const nameCharacteristicAddr = 0x2345;

export class IconSetter extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      icon: ''
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
      console.log("connecting");
      return device.gatt.connect();
    })
    // Step 3: Get the icon service
    .then(function(server) {
      console.log("getting service");
      window.server = server;
      return server.getPrimaryService(nameServiceAddr);
    })
    .then(function(service){
      console.log("getting characteristic");
      return service.getCharacteristic(nameCharacteristicAddr);
    })
    .then(function(characteristic){
      component.iconCharacteristic = characteristic;
      console.log("reading value");
      return characteristic.readValue();
    })
    .then(function(value){
      console.log('current value: ' + component.decoder.decode(value));

      component.setState({
        connected: true,
        icon: component.decoder.decode(value)
      });
    })
    .catch(function(error) {
      console.error('Connection failed!', error);
    });
  }

  disconnect() {
    window.server.disconnect();

    this.setState({
      connected: false
    });
  }

  selectIcon(event) {
    var icon = event.target.value;
    this.newIcon = icon;
    this.setState({icon: icon});
    console.log("new icon: " + icon);
  }

  setIcon() {
    var encoded = this.encoder.encode(this.newIcon);
    console.log("encoded: " + encoded);
    this.iconCharacteristic.writeValue(encoded);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="app icon-setter">
          <h1>Thermoscope Icon Setter</h1>
          <LogoMenu scale="logo-menu"/>
          <div className="app-container">
            <div>
              {!this.state.connected && <RaisedButton id="connect" onClick={this.connect}>Connect</RaisedButton>}
              {this.state.connected && <RaisedButton id="disconnect" onClick={this.disconnect}>Disconnect</RaisedButton>}
            </div>
            {this.state.connected && <div>
              <select id="icon-select" value={this.state.icon} onChange={this.selectIcon} className="icons">
              {icons.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
              </select>
              <RaisedButton id="set-icon" onClick={this.setIcon} className="button2">Set Icon</RaisedButton>
            </div>}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

}

ReactDOM.render(<IconSetter/>, document.getElementById('app'));
