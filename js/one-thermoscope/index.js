import React, { PureComponent } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import ReactDOM from 'react-dom';
import Thermoscope from '../components/thermoscope';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Sensor from '../components/sensor';
import LabQuest2 from 'sensor-labquest-2-interface';

import '../../css/app.less';
import '../../css/three-thermoscope.less';
// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

let meterSegments = [
      {
        color: "#4444ff",
        start: 0,
        end: 50
      },
      {
        color: "#cccc00",
        start: 50,
        end: 130
      },
      {
        color: "#ff0000",
        start: 130,
        end: 180
      }
    ];

export default class OneThermoscope extends PureComponent {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="app">
          <div className="app-container">
            <div className="three-thermoscope">
              <div className="thermoscope-container">
                <Thermoscope sensor={LabQuest2} probeIndex={0} showMaterialControls={false} material="uniform" embeddableSrc='../lab/embeddable.html' showMeter={true} meterSegments={meterSegments}/>
              </div>
            </div>
          </div>
          <Sensor sensor={LabQuest2}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<OneThermoscope/>, document.getElementById('app'));
