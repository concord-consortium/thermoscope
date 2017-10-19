import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Sensor from '../components/sensor';
import LabQuest2 from 'sensor-labquest-2-interface';
import bleSensor from '../components/ble-sensor.js';
import LogoMenu from '../components/logo-menu';
import { getURLParam } from '../utils';
import { List, ListItem } from 'material-ui/List';
import Thermoscope from '../components/thermoscope';

const sensor = bleSensor;

import '../../css/app.less';

// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

let ThermoscopeMode = { Menu: 0, OneThermoscope: 1, TwoThermoscope: 2, ThreeThermoscope: 3 };
let meterSegments = [
  {
    color: "#800000",
    start: 0,
    end: 45
  },
  {
    color: "#a0a000",
    start: 45,
    end: 145
  },
  {
    color: "#008000",
    start: 145,
    end: 180
  }
];

export default class ThermoscopeControl extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      mode: ThermoscopeMode.Menu
    };
    this.setThermoscopeRendering = this.setThermoscopeRendering.bind(this);
    this.renderThermoscope = this.renderThermoscope.bind(this);
    this.showMenu = this.showMenu.bind(this);
  }
  showMenu() {
    this.setState({ mode: ThermoscopeMode.Menu });
  }

  setThermoscopeRendering(params, quantity) {
    var pageUrl = params ? '?' + params : '';
    window.history.pushState('', '', pageUrl);
    this.setState({ mode: quantity })
  }

  renderThermoscope(material, probeIndex, label, showMeter, meterMinClamp, meterMaxClamp) {
    let meterMin = meterMinClamp ? meterMinClamp : 0;
    let meterMax = meterMaxClamp ? meterMaxClamp : 1;
    let showControls = getURLParam('controls');
    let thermoscope =
      <div className="thermoscope-container">
        <div className="label">{label}</div>
        <Thermoscope
          sensor={sensor}
          material={material}
          embeddableSrc='../lab/embeddable.html'
          probeIndex={probeIndex}
          showMeter={showMeter}
          meterSegments={meterSegments}
          minClamp={meterMin}
          maxClamp={meterMax}
          showMaterialControls={showControls}/>
      </div>;
    return thermoscope;
  }

  render() {
    const { mode } = this.state;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="app">
          <LogoMenu scale="logo-menu small" />
          <div title="Home" className="main-menu-button" onClick={this.showMenu} ><i className="material-icons">home</i></div>
          { mode === ThermoscopeMode.Menu &&
            <div className="demo-links">
              <List>
              <ListItem primaryText="Thermoscope (solid) Wood and Stone" onClick={() => this.setThermoscopeRendering("A=solid&B=solid", 2)} key="1" />
              <ListItem primaryText="Thermoscope (liquid) Oil and Soap" onClick={() => this.setThermoscopeRendering("A=liquid&B=liquid", 2)} key="2" />
              <ListItem primaryText="Thermoscope (gas) Air" onClick={() => this.setThermoscopeRendering("A=gas&B=gas", 2)} key="3" />

              <ListItem primaryText="Thermoscope (one)" onClick={() => this.setThermoscopeRendering("controls=true", 1)} key="4" />
              <ListItem primaryText="Thermoscope (two)" onClick={() => this.setThermoscopeRendering("controls=true", 2)} key="5" />
              <ListItem primaryText="Thermoscope (three)" onClick={() => this.setThermoscopeRendering("A=gas&B=liquid&C=solid&controls=true", 3)} key="6" />
              </List>
            </div>
          }
          {mode === ThermoscopeMode.OneThermoscope &&
            <div className="app-container">
              {this.renderThermoscope(getURLParam('A'), 0, 'A')}
            </div>
          }
          { mode === ThermoscopeMode.TwoThermoscope &&
            <div className="app-container">
              {this.renderThermoscope(getURLParam('A'), 0, 'A')}
              {this.renderThermoscope(getURLParam('B'), 1, 'B')}
            </div>
          }
          { mode === ThermoscopeMode.ThreeThermoscope &&
            <div className="app-container">
              {this.renderThermoscope(getURLParam('A'), 0, 'A', true)}
              {this.renderThermoscope(getURLParam('B'), 1, 'B', true)}
              {this.renderThermoscope(getURLParam('C'), 1, 'C', true)}
            </div>
          }
          <Sensor sensor={sensor} showAddressBox={false} />
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<ThermoscopeControl/>, document.getElementById('app'));
