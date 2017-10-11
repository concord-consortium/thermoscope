import React, { PureComponent } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import ReactDOM from 'react-dom';
import Aperture from '../components/aperture.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

import '../../css/aperture.less';
// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

export default class ThermoscopeAperture extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {


    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="thermoscope-aperture">
          <Aperture />
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<ThermoscopeAperture/>, document.getElementById('app'));
