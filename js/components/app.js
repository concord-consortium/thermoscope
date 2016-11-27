import React, {PureComponent} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Thermoscope from './thermoscope';
import injectTapEventPlugin from 'react-tap-event-plugin';

import '../../css/app.less';

// Required by Material-UI library.
injectTapEventPlugin();

// App is used just for layout. Put the whole state into Thermoscope component (preferably only there).
const App = () => (
  <MuiThemeProvider>
    <div className="app">
      <div className="thermoscope-container">
        <Thermoscope/>
      </div>
      <div className="thermoscope-container">
        <Thermoscope/>
      </div>
    </div>
  </MuiThemeProvider>
);

export default App;
