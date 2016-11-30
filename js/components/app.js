import React, {PureComponent} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import Thermoscope from './thermoscope';
import injectTapEventPlugin from 'react-tap-event-plugin';
import LabQuest2 from 'sensor-labquest-2-interface';

import '../../css/app.less';
import '../../css/sensor-connect.less';

// Required by Material-UI library.
injectTapEventPlugin();

// For the LabQuest2 sensor
var connect = function() {
  LabQuest2.connect(document.getElementById("sensorIP").value);
  document.getElementById("sensorConnectionStatus").innerHTML = "Connecting...";
  LabQuest2.on('connected', function(){
    document.getElementById("sensorConnectionStatus").innerHTML = "Connected.";
  });
};


darkBaseTheme.palette.textColor = '#ccc';

// App is used just for layout. Put the whole state into Thermoscope component (preferably only there).
const App = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <div className="app">
      <div className="sensorConnect">
        <span>Sensor IP Address</span>
        <input name="ip" type="text" id="sensorIP"></input>
        <button id="connect" onClick={connect}>Connect</button>
        <div id="sensorConnectionStatus"></div>
      </div>
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
