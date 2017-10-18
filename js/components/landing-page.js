import React, {PureComponent} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import Thermoscope from './thermoscope';
import LogoMenu from './logo-menu';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { List, ListItem } from 'material-ui/List';

import '../../css/app.less';

// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';

const LandingPage = () => (
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <div className="app">
      <h1>Thermoscope and Particle Modeler Examples</h1>
      <LogoMenu scale="logo-menu" />
      <div className="main-menu">
        <div className="menu-button"> <a href="/thermoscope-control/"><div className="thermoscope-link" /></a></div>
        <div className="menu-button"><a href="/particle-modeler/"><div className="particle-modeler-link" /></a></div>
      </div>
    </div>
  </MuiThemeProvider>
);

export default LandingPage;
