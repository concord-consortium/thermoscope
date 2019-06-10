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
import Clock from '../components/clock';
import Sidebar from '../components/sidebar';
import { getURLParam } from '../utils';
import { List, ListItem } from 'material-ui/List';
import { GridList, GridTile } from 'material-ui/GridList'
import Thermoscope from '../components/thermoscope';
import ExperimentSelector from '../components/experiment-selector';
import MixingView from '../components/mixing-view';

const sensor = bleSensor;
const enableUrlParam = getURLParam('params') || false;

import '../../css/app.less';

// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';
darkBaseTheme.palette.primary1Color = '#ccc';

export const ThermoscopeMode = { Menu: 0, OneThermoscope: 1, TwoThermoscope: 2, ThreeThermoscope: 3, 
                                 ExperimentSelector: 4, SingleExperiment: 5, ExperimentSubmenu: 6,
                                 MixingView: 7 };
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
    if (enableUrlParam && getURLParam('A')) {
      if (enableUrlParam && getURLParam('B')) {
        initialMode = ThermoscopeMode.TwoThermoscope;
      } else {
        initialMode = ThermoscopeMode.OneThermoscope;
      }
    }
    this.state = {
      mode: initialMode,
      showSidebar: false,
      showHideButtons: false,
      showPlayButtons: false,
      showCelsius: true
    };
    this.setThermoscopeRendering = this.setThermoscopeRendering.bind(this);
    this.renderThermoscope = this.renderThermoscope.bind(this);
    this.showMenu = this.showMenu.bind(this);
  }
  getParam(param) {
    if (enableUrlParam) {
      return getURLParam(param);
    } else {
      return this.state.params[param] || false;
    }
  }
  showMenu() {
    this.setState({ mode: ThermoscopeMode.Menu });
  }
  toggleState(key) {
    return () => this.setState({ [key]: !this.state[key] });
  }

  setThermoscopeRendering(params, mode) {
    if (enableUrlParam) {
      let urlParams = Object.entries(params).map(e => e.join('=')).join('&');
      var pageUrl = params ? '?' + urlParams : '';
      window.history.pushState('', '', pageUrl);
    }

    this.setState({ params, mode })
  }

  renderThermoscope(material, probeIndex, label, hidden, materialIndex, showMeter, meterMinClamp, meterMaxClamp) {
    const { showHideButtons, showPlayButtons, showCelsius } = this.state;
    let meterMin = meterMinClamp ? meterMinClamp : 0;
    let meterMax = meterMaxClamp ? meterMaxClamp : 1;
    let showControls = this.getParam('controls');
    let thermoscope =
      <div className={`thermoscope-container ${label.toLowerCase()}`}>
        <Thermoscope
          sensor={sensor}
          material={material}
          embeddableSrc='./lab/embeddable.html'
          label={label}
          probeIndex={probeIndex}
          materialIndex={materialIndex}
          showMeter={showMeter}
          meterSegments={meterSegments}
          minClamp={meterMin}
          maxClamp={meterMax}
          showMaterialControls={showControls}
          hidden={hidden}
          showHideButtons={showHideButtons}
          showPlayButtons={showPlayButtons}
          showCelsius={showCelsius}
        />
      </div>;
    return thermoscope;
  }

  render() {
    const { mode, showSidebar, showPlayButtons, showHideButtons, showCelsius } = this.state;
    const gridStyle = {
      display: 'flex',
      flexWrap: 'nowrap',
    }
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="app-container">
          <div className="app">
            <Clock />
            <LogoMenu scale="logo-menu small" navPath="../index.html" />
            {
              mode !== ThermoscopeMode.Menu &&
              <div title="Home" className="main-menu-button" onClick={this.showMenu} />
            }
            <div className="options" onClick={this.toggleState("showSidebar")}/>
            { mode === ThermoscopeMode.Menu &&
              <div className="list-section">
                <div className="demo-links">
                  <div className="icon-row">
                    <div className="water-icon example-icon"
                      onClick={() => this.setThermoscopeRendering({ A: 'liquid', B: 'liquid', materialA: 2, materialB: 2, container: 'water-water'}, 2)}/>
                    <div className="wood-stone example-icon"
                      onClick={() => this.setThermoscopeRendering({ A: 'solid', B: 'solid', container: 'wood-stone' }, 2)}/>
                    <div className="oil-soap example-icon"
                      onClick={() => this.setThermoscopeRendering({ A: 'liquid', B: 'liquid', container: 'oil-soap' }, 2)}/>
                  </div>
                  <div className="icon-row">
                    <div className="air-icon example-icon"
                      onClick={() => this.setThermoscopeRendering({ A: 'gas', B: 'gas', container: 'air' }, 2)}/>
                    <div className="coconut-icon example-icon"
                      onClick={() => this.setThermoscopeRendering({ A: 'uniform', materialA: 1, container: 'coconut' }, 1)}/>
                    <div className="experiments-icon example-icon"
                      onClick={() => this.setState({ mode: ThermoscopeMode.ExperimentSubmenu })}/>
                  </div>
                </div>
              </div>
            }
            {mode === ThermoscopeMode.OneThermoscope &&
              <div className={`app-container ${this.getParam('container')}`}>
                <div className="background" />
                {this.renderThermoscope(this.getParam('A'), 0, 'center', this.getParam('hideA'), this.getParam('materialA'))}
              </div>
            }
            { mode === ThermoscopeMode.TwoThermoscope &&
              <div className={`app-container ${this.getParam('container')}`}>
                <div className="background" />
                {this.renderThermoscope(this.getParam('A'), 0, 'A', this.getParam('hideA'),  this.getParam('materialA'))}
                {this.renderThermoscope(this.getParam('B'), 1, 'B', this.getParam('hideB'),  this.getParam('materialB'))}
              </div>
            }
            { mode === ThermoscopeMode.ThreeThermoscope &&
              <div className={`app-container ${this.getParam('container')}`}>
                <div className="background" />
                {this.renderThermoscope(this.getParam('A'), 0, 'A', this.getParam('hideA'), this.getParam('materialA'), true)}
                {this.renderThermoscope(this.getParam('B'), 1, 'B', this.getParam('hideB'), this.getParam('materialB'), true)}
                {this.renderThermoscope(this.getParam('C'), 1, 'C', this.getParam('hideC'), this.getParam('materialC'), true)}
              </div>
            }
            { mode === ThermoscopeMode.ExperimentSelector &&
              <ExperimentSelector onSelect={this.setThermoscopeRendering} />
            }
            {mode === ThermoscopeMode.SingleExperiment &&
              <div className={`app-container ${this.getParam('container')}`}>
                <div className="background" />
                {this.renderThermoscope(this.getParam('A'), 0, 'center experiment', this.getParam('hideA'), this.getParam('materialA'))}
              </div>
            }
            {
              mode === ThermoscopeMode.ExperimentSubmenu && 
              <div className="submenu">
                <div className="one-view-icon example-icon"
                  onClick={() => this.setState({ mode: ThermoscopeMode.ExperimentSelector })}/>
                <div className="mixing-icon example-icon"
                  onClick={() => this.setState({ mode: ThermoscopeMode.MixingView })}/>
              </div>
            }
            {
              mode === ThermoscopeMode.MixingView && 
              <div className="mixing-container">
                <div  className="background" />
                <MixingView 
                  showHideButtons={showHideButtons}
                  showPlayButtons={showPlayButtons}
                  showCelsius={showCelsius}
                /> 
              </div>
            }
            <Sensor sensor={sensor} showAddressBox={false} />
            <Sidebar 
              active={showSidebar}
              onClose={this.toggleState("showSidebar")}
              showHideButtons={showHideButtons}
              onToggleHideButtons={this.toggleState("showHideButtons")}
              showPlayButtons={showPlayButtons}
              onTogglePlayButtons={this.toggleState("showPlayButtons")}
              showCelsius={showCelsius}
              onToggleCelsius={this.toggleState("showCelsius")}
            /> 
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<ThermoscopeControl/>, document.getElementById('app'));
