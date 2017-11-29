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
import { GridList, GridTile } from 'material-ui/GridList'
import Thermoscope from '../components/thermoscope';

const sensor = bleSensor;

import '../../css/app.less';

// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';
darkBaseTheme.palette.primary1Color = '#ccc';

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
    let initialMode = ThermoscopeMode.Menu;
    if (getURLParam('A')) {
      if (getURLParam('B')) {
        initialMode = ThermoscopeMode.TwoThermoscope;
      } else {
        initialMode = ThermoscopeMode.OneThermoscope;
      }
    }
    this.state = {
      mode: initialMode
    };
    this.setThermoscopeRendering = this.setThermoscopeRendering.bind(this);
    this.renderThermoscope = this.renderThermoscope.bind(this);
    this.showMenu = this.showMenu.bind(this);
  }
  showMenu() {
    // make sure controls param is reset
    location.search = "";

    this.setState({ mode: ThermoscopeMode.Menu });
  }

  setThermoscopeRendering(params, quantity) {
    var pageUrl = params ? '?' + params : '';
    window.history.pushState('', '', pageUrl);
    this.setState({ mode: quantity })
  }

  renderThermoscope(material, probeIndex, label, hidden, showMeter, meterMinClamp, meterMaxClamp) {
    let meterMin = meterMinClamp ? meterMinClamp : 0;
    let meterMax = meterMaxClamp ? meterMaxClamp : 1;
    let showControls = getURLParam('controls');
    let thermoscope =
      <div className="thermoscope-container">
        <Thermoscope
          sensor={sensor}
          material={material}
          embeddableSrc='../lab/embeddable.html'
          label={label}
          probeIndex={probeIndex}
          showMeter={showMeter}
          meterSegments={meterSegments}
          minClamp={meterMin}
          maxClamp={meterMax}
          showMaterialControls={showControls}
          hidden={hidden}/>
      </div>;
    return thermoscope;
  }

  render() {
    const { mode } = this.state;
    const gridStyle = {
      display: 'flex',
      flexWrap: 'nowrap',
      overflowX: 'auto',
    }
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="app">
          <LogoMenu scale="logo-menu small" navPath="../index.html" />
          <div title="Home" className="main-menu-button" onClick={this.showMenu} ><i className="material-icons">home</i></div>
          { mode === ThermoscopeMode.Menu &&
            <div className="demo-links">
              <div className="list-section">
                <h1>Thermoscope Examples</h1>
                <GridList style={gridStyle}>
                <GridTile onClick={() => this.setThermoscopeRendering("A=solid&B=solid", 2)} key="1">
                    <div className="wood-icon-100 example-icon" />
                    <div className="stone-icon-100 example-icon" />
                    <div>Wood and Stone</div>
                  </GridTile>
                  <GridTile onClick={() => this.setThermoscopeRendering("A=liquid&B=liquid", 2)} key="2" >
                    <div className="oil-icon-100 example-icon" />
                    <div className="soap-icon-100 example-icon" />
                    <div>Oil and Soap</div>
                  </GridTile>
                  <GridTile onClick={() => this.setThermoscopeRendering("A=gas&B=gas", 2)} key="3" >
                    <div className="air-icon-100 example-icon" />
                    <div className="air-icon-100 example-icon" />
                    <div>Air</div>
                  </GridTile>
                  <GridTile onClick={() => this.setThermoscopeRendering("A=uniform", 1)} key="4" >
                    <div className="coconut-oil-icon-100 example-icon" />
                    <div>Experiments</div>
                  </GridTile>
                </GridList>
              </div>
              <div className="list-section">
                <h1>Demo Thermoscopes</h1>
                <GridList style={gridStyle}>
                  <GridTile onClick={() => this.setThermoscopeRendering("controls=true", 1)} key="5">
                    <div className="thermoscope-icon-84 example-icon" />
                    <div>Thermoscope (one)</div>
                  </GridTile>
                  <GridTile onClick={() => this.setThermoscopeRendering("controls=true", 2)} key="6">
                    <div className="thermoscope-icon-84 example-icon" />
                    <div className="thermoscope-icon-84 example-icon" />

                    <div>Thermoscope (two)</div>
                  </GridTile>
                </GridList>
              </div>
            </div>
          }
          {mode === ThermoscopeMode.OneThermoscope &&
            <div className="app-container">
              {this.renderThermoscope(getURLParam('A'), 0, 'A', getURLParam('hideA'))}
            </div>
          }
          { mode === ThermoscopeMode.TwoThermoscope &&
            <div className="app-container">
              {this.renderThermoscope(getURLParam('A'), 0, 'A', getURLParam('hideA'))}
              {this.renderThermoscope(getURLParam('B'), 1, 'B', getURLParam('hideB'))}
            </div>
          }
          { mode === ThermoscopeMode.ThreeThermoscope &&
            <div className="app-container">
              {this.renderThermoscope(getURLParam('A'), 0, 'A', getURLParam('hideA'), true)}
              {this.renderThermoscope(getURLParam('B'), 1, 'B', getURLParam('hideB'), true)}
              {this.renderThermoscope(getURLParam('C'), 1, 'C', getURLParam('hideC'), true)}
            </div>
          }
          <Sensor sensor={sensor} showAddressBox={false} />
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<ThermoscopeControl/>, document.getElementById('app'));
