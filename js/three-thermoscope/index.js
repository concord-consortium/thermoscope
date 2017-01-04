import React, { PureComponent } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import ReactDOM from 'react-dom';
import Thermoscope from '../components/thermoscope';
import injectTapEventPlugin from 'react-tap-event-plugin';
import LabQuest2 from 'sensor-labquest-2-interface';

import '../../css/meter.less';
import '../../css/three-thermoscope.less';

// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

export default class ThreeThermoscope extends PureComponent {

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
        <div className="three-thermoscope">
          <div className="thermoscope-container">
            <div className="label">A</div>
            <Thermoscope sensor={LabQuest2} probeIndex={0} temperature={5} material="solid" embeddableSrc='../lab/embeddable.html' showMeter={true} meterSegments={meterSegments} minClamp={0} maxClamp={0.25}/>
          </div>
          <div className="thermoscope-container">
            <div className="label">B</div>
            <Thermoscope sensor={LabQuest2} probeIndex={1} temperature={30}  material="liquid" embeddableSrc='../lab/embeddable.html' showMeter={true} meterSegments={meterSegments} minClamp={0.25} maxClamp={0.8}/>
          </div>
          <div className="thermoscope-container">
            <div className="label">C</div>
            <Thermoscope sensor={LabQuest2} probeIndex={2} temperature={50} material="gas" embeddableSrc='../lab/embeddable.html' showMeter={true} meterSegments={meterSegments} minClamp={0.8} maxClamp={1}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<ThreeThermoscope/>, document.getElementById('app'));
