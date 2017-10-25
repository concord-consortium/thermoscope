import React, {PureComponent} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import LogoMenu from './logo-menu';
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
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <div className="app">
        {!particleMenuMode &&
        <div>
          <h1>Thermoscope and Particle Modeler Examples</h1>
          <LogoMenu scale="logo-menu" navPath="./index.html" />
          <div className="main-menu">
            <div className="menu-button"> <a href="./thermoscope/"><div className="thermoscope-link" /></a></div>
            <div className="menu-button"><a><div className="particle-modeler-link" onClick={this.showParticleMenu}/></a></div>
            </div>
          <div className="settings-button"><a href="./icon-setter/"><div className="settings-link"><i className="material-icons">settings</i></div></a></div>
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
              <ListItem primaryText="One Particle Example (Authoring)" href= "./particle-modeler/#authoring=true&targetTemperature=140&gravitationalField=0.000005&timeStep=0.6&viscosity=0.8&showFreezeButton=true&elements=1&element1Sigma=0.392&element1Epsilon=-0.5&element1Mass=10&element2Sigma=0.255&element2Epsilon=0&element2Mass=19.9&pair11Epsilon=-0.5&pair11Sigma=0.392&pair12Forces=true&pair12Epsilon=-0.25&pair12Sigma=0.378&pair22Forces=true&pair22Epsilon=-0.065&pair22Sigma=0.157" key="7" />
              <ListItem primaryText="Container Demo" href= "./particle-modeler/?model=eyJ0YXJnZXRUZW1wZXJhdHVyZSI6eyJsYWJlbCI6IkhlYXRiYXRoIHRlbXBlcmF0dXJlIiwidmFsdWUiOjE0MCwibWluIjowLCJtYXgiOjEwMDB9LCJncmF2aXRhdGlvbmFsRmllbGQiOnsibGFiZWwiOiJHcmF2aXR5IiwidmFsdWUiOjAuMDAwMDA1NSwibWluIjowLCJtYXgiOjAuMDAwMDF9LCJ0aW1lU3RlcCI6eyJsYWJlbCI6IlRpbWUgc3RlcCIsInZhbHVlIjowLjI1LCJtaW4iOjAsIm1heCI6NX0sInZpc2Nvc2l0eSI6eyJsYWJlbCI6IlZpc2Nvc2l0eSIsInZhbHVlIjowLjgsIm1pbiI6MCwibWF4IjoxMH0sInNob3dGcmVlemVCdXR0b24iOnsibGFiZWwiOiJTaG93IEZyZWV6ZSBCdXR0b24iLCJ2YWx1ZSI6dHJ1ZX0sImNvbnRhaW5lciI6eyJsYWJlbCI6IlNob3cgQ29udGFpbmVyIiwidmFsdWUiOnRydWV9LCJlbGVtZW50cyI6eyJsYWJlbCI6Ik51bWJlciBvZiB1bmlxdWUgZWxlbWVudHMiLCJ2YWx1ZSI6MywibWluIjoxLCJtYXgiOjMsInN0ZXAiOjF9LCJlbGVtZW50MVNpZ21hIjp7ImxhYmVsIjoiU2lnbWEiLCJlbGVtZW50IjowLCJwcm9wZXJ0eSI6InNpZ21hIiwidmFsdWUiOjAuMjcsIm1pbiI6MC4wMSwibWF4IjowLjV9LCJlbGVtZW50MUVwc2lsb24iOnsibGFiZWwiOiJFcHNpbG9uIiwiZWxlbWVudCI6MCwicHJvcGVydHkiOiJlcHNpbG9uIiwidmFsdWUiOi0wLjUsIm1pbiI6LTAuNSwibWF4IjowfSwiZWxlbWVudDFNYXNzIjp7ImxhYmVsIjoiTWFzcyIsImVsZW1lbnQiOjAsInByb3BlcnR5IjoibWFzcyIsInZhbHVlIjoxMCwibWluIjoxMCwibWF4IjoxMDAwfSwiZWxlbWVudDJTaWdtYSI6eyJsYWJlbCI6IlNpZ21hIiwiZWxlbWVudCI6MSwicHJvcGVydHkiOiJzaWdtYSIsInZhbHVlIjowLjI1NSwibWluIjowLjAxLCJtYXgiOjAuNX0sImVsZW1lbnQyRXBzaWxvbiI6eyJsYWJlbCI6IkVwc2lsb24iLCJlbGVtZW50IjoxLCJwcm9wZXJ0eSI6ImVwc2lsb24iLCJ2YWx1ZSI6MCwibWluIjotMC41LCJtYXgiOjB9LCJlbGVtZW50Mk1hc3MiOnsibGFiZWwiOiJNYXNzIiwiZWxlbWVudCI6MSwicHJvcGVydHkiOiJtYXNzIiwidmFsdWUiOjE5LjksIm1pbiI6MTAsIm1heCI6MTAwMH0sImVsZW1lbnQzRXBzaWxvbiI6eyJsYWJlbCI6IkVwc2lsb24iLCJlbGVtZW50IjoyLCJwcm9wZXJ0eSI6ImVwc2lsb24iLCJ2YWx1ZSI6LTAuNDk1LCJtaW4iOi0wLjUsIm1heCI6MH0sInBhaXIxMUZvcmNlcyI6eyJlbGVtZW50MSI6MCwiZWxlbWVudDIiOjAsInByb3BlcnR5IjoidXNlIiwidmFsdWUiOnRydWV9LCJwYWlyMTFFcHNpbG9uIjp7ImVsZW1lbnQxIjowLCJlbGVtZW50MiI6MCwicHJvcGVydHkiOiJlcHNpbG9uIiwidmFsdWUiOi0wLjUsIm1pbiI6LTAuNSwibWF4IjowfSwicGFpcjExU2lnbWEiOnsiZWxlbWVudDEiOjAsImVsZW1lbnQyIjowLCJwcm9wZXJ0eSI6InNpZ21hIiwidmFsdWUiOjAuMjY1LCJtaW4iOjAuMDEsIm1heCI6MC41fSwicGFpcjEyRm9yY2VzIjp7ImVsZW1lbnQxIjowLCJlbGVtZW50MiI6MSwicHJvcGVydHkiOiJ1c2UiLCJ2YWx1ZSI6dHJ1ZX0sInBhaXIxMkVwc2lsb24iOnsiZWxlbWVudDEiOjAsImVsZW1lbnQyIjoxLCJwcm9wZXJ0eSI6ImVwc2lsb24iLCJ2YWx1ZSI6LTAuMjUsIm1pbiI6LTAuNSwibWF4IjowfSwicGFpcjEyU2lnbWEiOnsiZWxlbWVudDEiOjAsImVsZW1lbnQyIjoxLCJwcm9wZXJ0eSI6InNpZ21hIiwidmFsdWUiOjAuMzc4LCJtaW4iOjAuMDEsIm1heCI6MC41fSwicGFpcjEzRm9yY2VzIjp7ImVsZW1lbnQxIjowLCJlbGVtZW50MiI6MiwicHJvcGVydHkiOiJ1c2UiLCJ2YWx1ZSI6dHJ1ZX0sInBhaXIxM0Vwc2lsb24iOnsiZWxlbWVudDEiOjAsImVsZW1lbnQyIjoyLCJwcm9wZXJ0eSI6ImVwc2lsb24iLCJ2YWx1ZSI6LTAuNSwibWluIjotMC41LCJtYXgiOjB9LCJwYWlyMTNTaWdtYSI6eyJlbGVtZW50MSI6MCwiZWxlbWVudDIiOjIsInByb3BlcnR5Ijoic2lnbWEiLCJ2YWx1ZSI6MC4xODYsIm1pbiI6MC4wMSwibWF4IjowLjV9LCJwYWlyMjJFcHNpbG9uIjp7ImVsZW1lbnQxIjoxLCJlbGVtZW50MiI6MSwicHJvcGVydHkiOiJlcHNpbG9uIiwidmFsdWUiOi0wLjA2NSwibWluIjotMC41LCJtYXgiOjB9LCJwYWlyMjJTaWdtYSI6eyJlbGVtZW50MSI6MSwiZWxlbWVudDIiOjEsInByb3BlcnR5Ijoic2lnbWEiLCJ2YWx1ZSI6MC4xNTcsIm1pbiI6MC4wMSwibWF4IjowLjV9LCJhdG9tcyI6eyJ4IjpbMi4zMTk1NDE0MjI4NzM2NzM1LDIuMDE5NzIzODE0MDMwNTYwMiwyLjAyMDA4OTQwMTY2MzYzODQsMi4zMTY0MTE0NTI3ODgwMDM1LDIuMTY5NzExMzc3MTUxOTIyLDIuMTgwNzkwMjU2MDkwNDkxNSwxLjg3MjU5ODE1NTM0NDc1NjIsMi42MTY2NTk0Nzc2OTc0MjI0LDIuNDcxMzMwNDc0NDUzNTY4NSwxLjcxOTA0NTA1NTUxNzU2OTYsMi4zMjI5MzUxNzU3NTQ2NTQsMi40NjgxNjgyODY1NjU2NDkzLDIuNjE3MDI4Njk2MjYzNjQxOCwyLjc2NTcxMzE4NzkxMjY5NiwyLjkxNDA5MDEyMDI2MTc3MTVdLCJ5IjpbMC44MDE3MDIyMzEyOTQ2MzAxLDAuMjk2MjQ2NTc0ODc1NzU2NSwwLjgwNTU3NzIwMjk1NzAxNDIsMC4yOTU1NTU0MTkwODIwNTAxLDAuNTQ5MTEyODA3NDgzNzQwOCwxLjA1OTI0MDQ5MDE2MjYyNzYsMC41NTAzNzA4MzkwMTY0MDEyLDAuMjk1NDY4NDMwNzMwMjc0MSwxLjA1NTQ1NTg4MDk1NDYyOTcsMC4yOTk4NDM5NzgzNjkwMjA3NywxLjMxMjMxMTY2MjQwNzE2NTgsMC41NDkwMjc5ODMzODQxMjk3LDAuODAzNDUyNjkwODAyMjM3OCwwLjU1MDg2Mjg2MzgyMzk0NiwwLjI5NTIzODE5MzQzNjczMjM1XSwidngiOlstMC4wMDAzOTc5Mzg2NjQ2NjA2ODI3NCwwLjAwMDE0NzAxNzQ3MDU2NTE0ODk5LDAuMDAwMDg2MjA4NDA0ODU4Njc2OTYsMC4wMDAwNDg3OTU1OTEzODY2MDgwMiwwLjAwMDA2MjcyNzg0ODkwNjYwNjEzLDAuMDAwMDA2NDUzNTUwNTY4NTIxMDI1LDAuMDAwMjAzMDc2MTE0MTc4NzgzNzgsLTAuMDAwMjc5NTQzNDE5NDA5MDIzNDUsMC4wMDAxMzQ5MjY2ODkwNTcxNzg3MiwwLjAwMDQyNjEwMDA0NTAwMTM0MjEsLTAuMDAwMTI5NjA3NjY5OTkzOTk5NjYsLTAuMDAwMjMyNTA1MjMwNTA1MTcyMiwwLjAwMDAxMjgwODM0NzA4ODQ0NDkzNSwtMC4wMDAxMjc2MTgyMzIxMjYzNjM5LDAuMDAwMDM5MDk5MTU1MDgzOTMxNDZdLCJ2eSI6Wy0wLjAwMDI2MjM3OTE3MDg5ODU5OTU2LC0wLjAwMDI2MjY5MTAwNDM0MjcyNjg3LC0wLjAwMDEyMTUxODUwMzAxOTk3NTY3LDAuMDAwMDQ1NjUyNTYxNTE3MDY1ODY2LDAuMDAwMjE5NjI4ODcxNTI2ODM4NSwtMC4wMDAyNjkyNzU5ODAzMTM5NjU2LC0wLjAwMDA0MzQzMzc1MTMwNjQ0MzAyLC0wLjAwMDI2NTU4NzU0OTkyNjY0NDMzLDAuMDAwMjM3MjA3ODM1MDYwOTUxODYsLTAuMDAwMDcyMDYzMzkwNzY2MDkwODQsMC4wMDAwMDc1MzIxMjM2NDAzMDgxODUsLTAuMDAwMDA1OTU0Mjg5Njk2MTgyNTY0LDAuMDAwMDkyMzA4NDU0MzcyNTEzODgsLTAuMDAwMTc4MTg0ODEwNzM2ODY3NjYsMC4wMDAwNjQ3MzY5OTcxNjA4MzI5M10sImNoYXJnZSI6WzAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwXSwiZnJpY3Rpb24iOlswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMF0sImVsZW1lbnQiOlswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMF0sInBpbm5lZCI6WzAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwXSwiZHJhZ2dhYmxlIjpbMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDFdfX0=#targetTemperature=140&gravitationalField=0.0000055&timeStep=0.25&viscosity=0.8&showFreezeButton=true&container=true&elements=3&element1Sigma=0.27&element1Epsilon=-0.5&element1Mass=10&element2Sigma=0.255&element2Epsilon=0&element2Mass=19.9&element3Epsilon=-0.495&pair11Forces=true&pair11Epsilon=-0.5&pair11Sigma=0.265&pair12Forces=true&pair12Epsilon=-0.25&pair12Sigma=0.378&pair13Forces=true&pair13Epsilon=-0.5&pair13Sigma=0.186&pair22Epsilon=-0.065&pair22Sigma=0.157" key="8" />
                </div>
            </List>
          </div>
        </div>
          }
        <div className="version-identifier">Master 20171024.1</div>
      </div>
    </MuiThemeProvider>
    );
  }
}

