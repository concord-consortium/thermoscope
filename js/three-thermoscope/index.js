import React, { PureComponent } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import ReactDOM from 'react-dom';
import Thermoscope from '../components/thermoscope';
import injectTapEventPlugin from 'react-tap-event-plugin';
import LabQuest2 from 'sensor-labquest-2-interface';

import '../../css/three-thermoscope.less';
// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

export default class ThreeThermoscope extends PureComponent {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="three-thermoscope">
          <div className="thermoscope-container">
            <div className="label">A</div>
            <Thermoscope sensor={LabQuest2} probeIndex={0} material="solid" embeddableSrc='../lab/embeddable.html'/>
          </div>
          <div className="thermoscope-container">
            <div className="label">B</div>
            <Thermoscope sensor={LabQuest2} probeIndex={1} material="liquid" embeddableSrc='../lab/embeddable.html'/>
          </div>
          <div className="thermoscope-container">
            <div className="label">C</div>
            <Thermoscope sensor={LabQuest2} probeIndex={2} material="gas" embeddableSrc='../lab/embeddable.html'/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<ThreeThermoscope/>, document.getElementById('app'));
