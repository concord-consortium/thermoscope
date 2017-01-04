import React, { PureComponent } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import ReactDOM from 'react-dom';
import Thermoscope from '../components/thermoscope';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Sensor from '../components/sensor';
import LabQuest2 from 'sensor-labquest-2-interface';

import '../../css/meter.less';
// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

export default class MeterThermoscope extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {

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

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="meter-thermoscope">
          <Sensor sensor={LabQuest2} />
          <div className="app-container">
            <div className="thermoscope-container">
              <div className="label">A</div>
              <Thermoscope sensor={LabQuest2} probeIndex={0} material="solid" embeddableSrc='../lab/embeddable.html' showMeter={true} meterSegments={meterSegments}/>
            </div>
            <div className="thermoscope-container">
              <div className="label">B</div>
              <Thermoscope sensor={LabQuest2} probeIndex={1} material="liquid" embeddableSrc='../lab/embeddable.html' showMeter={true} meterSegments={meterSegments}/>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<MeterThermoscope/>, document.getElementById('app'));
