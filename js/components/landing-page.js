import React, {PureComponent} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import LogoMenu from './logo-menu';
import Clock from './clock';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { List, ListItem } from 'material-ui/List';
import { getURLParam } from '../utils';

import '../../css/app.less';

// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';


export default class LandingPage extends PureComponent {
  constructor(props) {
    super(props);
    let particleMenuMode = getURLParam("particleMenu") ? true : false;
    this.state = {
      particleMenuMode
    }
    this.showParticleMenu = this.showParticleMenu.bind(this);
  }
  showParticleMenu() {
    var pageUrl = '?' + "particleMenu=true";
    window.history.pushState('', '', pageUrl);
    this.setState({ particleMenuMode: true });
  }
  render() {
    const { particleMenuMode } = this.state;

    const iPadBuild = window.location.href.indexOf('/branch/ios') > -1;
    const versionId = iPadBuild ? 'iOS' : 'Master';
    const headerText = iPadBuild ? 'Welcome to the Thermoscope! Tap the Icon to Start' : 'Thermoscope and Particle Modeler Examples';

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="app">
        <Clock />
        {!particleMenuMode &&
        <div>
          <h1>{headerText}</h1>
          <LogoMenu scale="logo-menu" navPath="./index.html" />
          <div className="main-menu">
            <div className="menu-button"> <a href="./thermoscope/"><div className="thermoscope-link" /></a></div>
            {!iPadBuild && <div className="menu-button"><a><div className="particle-modeler-link" onClick={this.showParticleMenu} /></a></div>}
            </div>
            {!iPadBuild && <div className="settings-button"><a href="./icon-setter/"><div className="settings-link"><i className="material-icons">settings</i></div></a></div>}
        </div>
        }
        {particleMenuMode &&
          <div>
          <h1>Particle Modeler Examples</h1>
          <LogoMenu scale="logo-menu small" navPath="./index.html" />
          <div className="demo-links">
              <List>
              <div className="list-section">
                <h1>Empty Particle Modeler</h1>
                <ListItem primaryText="Particle Modeler" href="./particle-modeler/" />
                <ListItem primaryText="Particle Modeler (Authoring)" href="./particle-modeler/#authoring=true" />
                </div>
                <div className="list-section">
                  <h1>Particle Modeler Examples</h1>
                  <ListItem primaryText="One Particle Example" href= "./particle-modeler/#targetTemperature=140&gravitationalField=0.000005&timeStep=0.6&viscosity=0.8&showFreezeButton=true&elements=1&element1Sigma=0.392&element1Epsilon=-0.5&element1Mass=10&element2Sigma=0.255&element2Epsilon=0&element2Mass=19.9&pair11Epsilon=-0.5&pair11Sigma=0.392&pair12Forces=true&pair12Epsilon=-0.25&pair12Sigma=0.378&pair22Forces=true&pair22Epsilon=-0.065&pair22Sigma=0.157" key="6" />
                  <ListItem primaryText="One Particle Example (Authoring)" href="./particle-modeler/#authoring=true&targetTemperature=140&gravitationalField=0.000005&timeStep=0.6&viscosity=0.8&showFreezeButton=true&elements=1&element1Sigma=0.392&element1Epsilon=-0.5&element1Mass=10&element2Sigma=0.255&element2Epsilon=0&element2Mass=19.9&pair11Epsilon=-0.5&pair11Sigma=0.392&pair12Forces=true&pair12Epsilon=-0.25&pair12Sigma=0.378&pair22Forces=true&pair22Epsilon=-0.065&pair22Sigma=0.157" key="7" />
                  <ListItem primaryText="Container Demo" href="./particle-modeler/#gravitationalField=0.0000051&timeStep=0.25&viscosity=0.8&showFreezeButton=true&container=true&element1Sigma=0.299&element1Epsilon=-0.5&element1Mass=19.9&element2Sigma=0.255&element2Epsilon=0&element2Mass=19.9&element3Epsilon=-0.495&pair11Forces=true&pair11Epsilon=-0.5&pair11Sigma=0.299&pair12Forces=true&pair12Epsilon=-0.25&pair12Sigma=0.378&pair13Epsilon=-0.5&pair22Epsilon=-0.065&pair22Sigma=0.157" key="8" />
                  <ListItem primaryText="Container Demo (Authoring)" href="./particle-modeler/#authoring=true&gravitationalField=0.0000051&timeStep=0.25&viscosity=0.8&showFreezeButton=true&container=true&element1Sigma=0.299&element1Epsilon=-0.5&element1Mass=19.9&element2Sigma=0.255&element2Epsilon=0&element2Mass=19.9&element3Epsilon=-0.495&pair11Forces=true&pair11Epsilon=-0.5&pair11Sigma=0.299&pair12Forces=true&pair12Epsilon=-0.25&pair12Sigma=0.378&pair13Epsilon=-0.5&pair22Epsilon=-0.065&pair22Sigma=0.157" key="9" />
              </div>
            </List>
          </div>
        </div>
          }
        <div className="version-identifier">{versionId} 20180716.1</div>
      </div>
    </MuiThemeProvider>
    );
  }
}

