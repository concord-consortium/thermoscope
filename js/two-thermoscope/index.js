import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import Thermoscope from '../components/thermoscope';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Sensor from '../components/sensor';
import LabQuest2 from 'sensor-labquest-2-interface';
import bleSensor from '../components/ble-sensor.js';
import { getURLParam } from '../utils';

const sensor = bleSensor;

import '../../css/app.less';

// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

export default class TwoThermoscope extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="app">
          <div className="app-container">
            <div className="thermoscope-container">
              <div className="label">A</div>
              <Thermoscope sensor={sensor} material={getURLParam('A')} probeIndex={0}/>
            </div>
            <div className="thermoscope-container">
              <div className="label">B</div>
              <Thermoscope sensor={sensor} material={getURLParam('B')} probeIndex={1}/>
            </div>
          </div>
          <Sensor sensor={sensor} showAddressBox={false} />
        </div>
      </MuiThemeProvider>
    )
  }
}

ReactDOM.render(<TwoThermoscope/>, document.getElementById('app'));
