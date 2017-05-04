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
      <LogoMenu scale="logo-menu"/>
      <div className="demo-links">
        <List>
          <ListItem primaryText="Thermoscope with BLE Sensor Demos" leftIcon={<i className="material-icons">group_work</i>} initiallyOpen={true}
            primaryTogglesNestedList={true} nestedItems={[
              <ListItem primaryText="Thermoscope (solid)" href="./thermoscope/" key="1" />,
              <ListItem primaryText="Thermoscope (liquid)" href="./thermoscope/?A=liquid&B=liquid" key="2" />,
              <ListItem primaryText="Thermoscope (gas)" href="./thermoscope/?A=gas&B=gas" key="3" />
            ]} />
          <ListItem primaryText="Particle Modeler" leftIcon={<i className="material-icons">all_out</i>} initiallyOpen={true} primaryTogglesNestedList={true} nestedItems={[
            <ListItem primaryText="Particle Modeler" href="./particle-modeler/" key="4" />,
            <ListItem primaryText="One Particle Modeler" href= "./particle-modeler/#authoring=true&targetTemperature=140&gravitationalField=0.000005&timeStep=0.6&viscosity=0.8&showFreezeButton=true&elements=2&element1Sigma=0.392&element1Epsilon=-0.5&element1Mass=10&element2Sigma=0.255&element2Epsilon=0&element2Mass=19.9&pair11Epsilon=-0.5&pair11Sigma=0.392&pair12Forces=true&pair12Epsilon=-0.25&pair12Sigma=0.378&pair22Forces=true&pair22Epsilon=-0.065&pair22Sigma=0.157" key="5" />
            ]}/>
        </List>
      </div>
    </div>
  </MuiThemeProvider>
);

export default LandingPage;
