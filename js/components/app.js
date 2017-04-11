import React, {PureComponent} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import Thermoscope from './thermoscope';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Sensor from './sensor';
import LabQuest2 from 'sensor-labquest-2-interface';
import bleSensor from './ble-sensor.js';
import { getURLParam } from '../utils';

const sensor = bleSensor;

import '../../css/app.less';
const DEBUG = getURLParam('debug') || 'false';
// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

// App is used just for layout. Put the whole state into Thermoscope component (preferably only there).
const App = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <div className="app">
      <div className="app-container">
        <div className="thermoscope-container">
          <div className="label">A</div>
          <Thermoscope sensor={sensor} probeIndex={0}/>
        </div>
        <div className="thermoscope-container">
          <div className="label">B</div>
          <Thermoscope sensor={sensor} probeIndex={1}/>
        </div>
      </div>
      <Sensor sensor={sensor} debug={DEBUG}/>
    </div>
  </MuiThemeProvider>
);

export default App;
