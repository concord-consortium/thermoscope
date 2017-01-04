import React, {PureComponent} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import Thermoscope from './thermoscope';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Sensor from './sensor';
import LabQuest2 from 'sensor-labquest-2-interface';

import '../../css/app.less';

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
          <Thermoscope sensor={LabQuest2} probeIndex={0}/>
        </div>
        <div className="thermoscope-container">
          <div className="label">B</div>
          <Thermoscope sensor={LabQuest2} probeIndex={1}/>
        </div>
      </div>
      <Sensor sensor={LabQuest2}/>
    </div>
  </MuiThemeProvider>
);

export default App;
