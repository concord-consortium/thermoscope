import React, {PureComponent} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import Thermoscope from './thermoscope';
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
      <div className="demo-links">
        <List>
          <ListItem primaryText="Thermoscope with BLE Sensor Demos" leftIcon={<i className="material-icons">group_work</i>} initiallyOpen={true}
            primaryTogglesNestedList={true} nestedItems={[
              <ListItem primaryText="Thermoscope (solid)" href="./thermoscope" key="1" />,
              <ListItem primaryText="Thermoscope (liquid)" href="./thermoscope?A=liquid&B=liquid" key="2" />,
              <ListItem primaryText="Thermoscope (gas)" href="./thermoscope?A=gas&B=gas" key="3" />
            ]} />
          <ListItem primaryText="Particle Modeler" leftIcon={<i className="material-icons">all_out</i>} initiallyOpen={true} primaryTogglesNestedList={true} nestedItems={[
              <ListItem primaryText="Particle Modeler" href="./particle-modeler" key="3" />,
              <ListItem primaryText="Particle Modeler (author mode)" href="./particle-modeler#authoring=true" rightIcon={<i className="material-icons">build</i>} key="4" />
            ]}/>
        </List>
      </div>
    </div>
  </MuiThemeProvider>
);

export default LandingPage;
