import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import LogoMenu from '../components/logo-menu';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { GridList, GridTile } from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import '../../css/app.less';
import '../../css/icon-setter.less';

// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

const icons = ['🐞', '🦋', '🍎', '🍄', '🌈', '⭐', '🚜', '✈', '⚽', '🍒', '🐟', '🐢', '🚀',
               '🐿', '🐌', '🌼', '🐙', '🌵', '🦀', '🚁', '⛄', '🐝', '🔑', '💡', '🐍', 'A' ];

const infoServiceAddr = 0x1234;
const nameCharacteristicAddr = '00002345-0000-1000-8000-00805f9b34fb';
const versionCharacteristicAddr = '00006789-0000-1000-8000-00805f9b34fb';
const adcCalibration50CharacteristicAddr = '00000101-0000-1000-8000-00805f9b34fb';
const adcCalibration75CharacteristicAddr = '00000102-0000-1000-8000-00805f9b34fb';

const instr_start = 'Click "Connect" and select a Thermoscope to set its icon';
const instr_connected = 'Select a new icon for the Thermoscope and click "Set Icon"';
const instr_changed = 'Click "Disconnect" and turn the Thermoscope off and on again';





export class IconSetter extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      supportsIcon: false,
      supportsADCCalibration: false,
      iconChanged: false,
      status: "not connected",
      currentIcon: '',
      selectedIcon: '',
      showWinLink: false,
      sensorVersion: ''
    };

    this.infoService = null;
    this.iconCharacteristic = null;

    this.decoder = new TextDecoder('utf-8');
    this.encoder = new TextEncoder('utf-8');

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.selectIcon = this.selectIcon.bind(this);
    this.setIcon = this.setIcon.bind(this);
    this.handleADCCalibration50 = this.handleADCCalibration50.bind(this);
    this.handleADCCalibration75 = this.handleADCCalibration75.bind(this);
    this.saveCalibration = this.saveCalibration.bind(this);
  }

  logError(msg, error) {
    console.log(msg + ":" + error);
    this.setState({
      status: msg
    });
  }

  connect() {
    if (navigator.appVersion.indexOf("Win")!=-1 && navigator.bluetooth == undefined) {
      this.setState({ showWinLink: true });
      return;
    }

    console.log("connect");
    let request = navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "Thermoscope" }],
      optionalServices: [infoServiceAddr]
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
    // Step 3: Get the info service (icon + version)
    .then(function(server) {
      component.setState({
        connected: true,
        status: "getting info service"
      });
      window.server = server;
      return server.getPrimaryService(infoServiceAddr);
    })
    .catch(function(error) {
      console.error("connection failed: " + error);
      component.setState({
        status: "connection failed"
      });
    })
    // Get the sensor version
    .then(function(service) {
      component.setState({
        status: "getting sensor version characteristic"
      });
      component.infoService = service;

      component.infoService.getCharacteristic(versionCharacteristicAddr)
      .then(function(characteristic) {
        if(characteristic && characteristic.readValue) {
          component.setState({
            status: "getting sensor version value"
          });
          return characteristic.readValue();
        }
      })
      .then(function(value){
        var state = {};
        component.setState({
          sensorVersion: component.decoder.decode(value)
        });
      })
      .catch(function(error) {
        console.log("failed to get sensor version: " + error);
        component.setState({
          sensorVersion: "unknown"
        });
        return;
      })

      return component.infoService.getCharacteristic(nameCharacteristicAddr);
    })
    // Get the icon characteristic
    .then(function(characteristic){
      component.iconCharacteristic = characteristic;
      component.setState({
        status: "reading icon characteristic"
      });
      return characteristic.readValue();
    })
    .then(function(value){
      var iconVal = component.decoder.decode(value);
      component.setState({
        status: "current icon value: " + iconVal,
        supportsIcon: true,
        currentIcon: iconVal,
        selectedIcon: iconVal
      });
    })
    .catch(function(error) {
      console.log("failed to get sensor icon: " + error);
      component.setState({
        supportsIcon: false,
        status: "failed to get sensor icon"
      });
    })
    .then(function(){
      return component.infoService.getCharacteristic(adcCalibration50CharacteristicAddr);
    })
    .then(function(characteristic){
      component.adcCalibration50Characteristic = characteristic;
      component.setState({
        status: "reading adc 50% characteristic"
      });
      return characteristic.readValue();
    })
    .then(function(value){
      var counts = value.getInt16(0, true)
      component.setState({
        status: "current adc 50% value: " + counts,
        adcCalibration50: counts
      });
    })
    .then(function(){
      return component.infoService.getCharacteristic(adcCalibration75CharacteristicAddr);
    })
    .then(function(characteristic){
      component.adcCalibration75Characteristic = characteristic;
      component.setState({
        status: "reading adc 75% characteristic"
      });
      return characteristic.readValue();
    })
    .then(function(value){
      var counts = value.getInt16(0, true)
      component.setState({
        status: "current adc 75% value: " + counts,
        supportsADCCalibration: true,
        adcCalibration75: counts
      });
    })
  }

  disconnect() {
    window.server.disconnect();

    this.setState({
      connected: false,
      status: "not connected",
      supportsIcon: false,
      supportsADCCalibration: false,
      currentIcon: '',
      selectedIcon: '',
      sensorVersion: ''
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

  handleADCCalibration50(event) {
    this.setState({adcCalibration50: event.target.value});
  }

  handleADCCalibration75(event) {
    this.setState({adcCalibration75: event.target.value});
  }

  saveCalibration() {
    // Add error checking
    var adcCalibration50Data = new DataView(new ArrayBuffer(2));
    var adcCalibration75Data = new DataView(new ArrayBuffer(2));
    var self = this;
    adcCalibration50Data.setInt16(0, this.state.adcCalibration50, true);
    adcCalibration75Data.setInt16(0, this.state.adcCalibration75, true);
    console.log("saving calibration");
    this.adcCalibration50Characteristic.writeValue(adcCalibration50Data)
    .then(function(){
      // only one gatt call can be going at once it seems
      self.adcCalibration75Characteristic.writeValue(adcCalibration75Data);
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

  openWinBLE(event) {
    window.location = "/windows-ble/";
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
            <Dialog open={this.state.showWinLink} ref="winLinkDlg" className="dialog">
              <div className="dialog-msg">
                  It looks like you&apos;re using Windows - if you want to connect to a Thermoscope on Windows,
                  you need to install some software.</div>
              <RaisedButton onClick={this.openWinBLE}>OK</RaisedButton>
            </Dialog>
            <div>
              {!this.state.connected && <RaisedButton id="connect" onClick={this.connect}>Connect</RaisedButton>}
              {this.state.connected && <RaisedButton id="disconnect" onClick={this.disconnect}>Disconnect</RaisedButton>}
            </div>
            {this.state.connected && <div>
              {this.state.supportsIcon && <div>
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
              {this.state.supportsADCCalibration && <div style={{color: 'black'}}>
                  <div><label>ADC Calibration 0.5:
                    <input type="text" value={this.state.adcCalibration50} onChange={this.handleADCCalibration50} />
                  </label></div>
                  <div><label>ADC Calibration 0.75:
                  <input type="text" value={this.state.adcCalibration75} onChange={this.handleADCCalibration75} />
                  </label></div>
                  <RaisedButton id="save-calibration" onClick={this.saveCalibration} className="button2">
                    Save Calibration</RaisedButton>
              </div>}
            </div>}

          </div>
          <div id="status" className="message">{this.state.status}</div>
          <div className="message">{this.state.sensorVersion ? 'sensor version: ' + this.state.sensorVersion : ' '}</div>
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
