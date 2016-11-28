import React, {PureComponent} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import Thermoscope from './thermoscope';
import injectTapEventPlugin from 'react-tap-event-plugin';
import LabQuest2 from '../../public/sensor-labquest-2-interface.js';

import '../../css/app.less';

// Required by Material-UI library.
injectTapEventPlugin();
LabQuest2.startPolling("10.11.12.207");

darkBaseTheme.palette.textColor = '#ccc';

// App is used just for layout. Put the whole state into Thermoscope component (preferably only there).
const App = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <div className="app">
      <div className="thermoscope-container">
        <Thermoscope sensor={LabQuest2} probeIndex={0}/>
      </div>
      <div className="thermoscope-container">
        <Thermoscope sensor={LabQuest2} probeIndex={1}/>
      </div>
    </div>
  </MuiThemeProvider>
);

export default App;
