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
                <ListItem primaryText="Container Demo" href= "./particle-modeler/?model=eyJncmF2aXRhdGlvbmFsRmllbGQiOnsibGFiZWwiOiJHcmF2aXR5IiwidmFsdWUiOjAuMDAwMDA1NSwibWluIjowLCJtYXgiOjAuMDAwMDF9LCJ0aW1lU3RlcCI6eyJsYWJlbCI6IlRpbWUgc3RlcCIsInZhbHVlIjowLjI1LCJtaW4iOjAsIm1heCI6NX0sInZpc2Nvc2l0eSI6eyJsYWJlbCI6IlZpc2Nvc2l0eSIsInZhbHVlIjowLjgsIm1pbiI6MCwibWF4IjoxMH0sInNob3dGcmVlemVCdXR0b24iOnsibGFiZWwiOiJTaG93IEZyZWV6ZSBCdXR0b24iLCJ2YWx1ZSI6dHJ1ZX0sImNvbnRhaW5lciI6eyJsYWJlbCI6IlNob3cgQ29udGFpbmVyIiwidmFsdWUiOnRydWV9LCJlbGVtZW50cyI6eyJsYWJlbCI6Ik51bWJlciBvZiB1bmlxdWUgZWxlbWVudHMiLCJ2YWx1ZSI6MSwibWluIjoxLCJtYXgiOjMsInN0ZXAiOjF9LCJlbGVtZW50MVNpZ21hIjp7ImxhYmVsIjoiU2lnbWEiLCJlbGVtZW50IjowLCJwcm9wZXJ0eSI6InNpZ21hIiwidmFsdWUiOjAuMjcsIm1pbiI6MC4wMSwibWF4IjowLjV9LCJlbGVtZW50MUVwc2lsb24iOnsibGFiZWwiOiJFcHNpbG9uIiwiZWxlbWVudCI6MCwicHJvcGVydHkiOiJlcHNpbG9uIiwidmFsdWUiOi0wLjUsIm1pbiI6LTAuNSwibWF4IjowfSwiZWxlbWVudDFNYXNzIjp7ImxhYmVsIjoiTWFzcyIsImVsZW1lbnQiOjAsInByb3BlcnR5IjoibWFzcyIsInZhbHVlIjoxMCwibWluIjoxMCwibWF4IjoxMDAwfSwiZWxlbWVudDJTaWdtYSI6eyJsYWJlbCI6IlNpZ21hIiwiZWxlbWVudCI6MSwicHJvcGVydHkiOiJzaWdtYSIsInZhbHVlIjowLjI1NSwibWluIjowLjAxLCJtYXgiOjAuNX0sImVsZW1lbnQyRXBzaWxvbiI6eyJsYWJlbCI6IkVwc2lsb24iLCJlbGVtZW50IjoxLCJwcm9wZXJ0eSI6ImVwc2lsb24iLCJ2YWx1ZSI6MCwibWluIjotMC41LCJtYXgiOjB9LCJlbGVtZW50Mk1hc3MiOnsibGFiZWwiOiJNYXNzIiwiZWxlbWVudCI6MSwicHJvcGVydHkiOiJtYXNzIiwidmFsdWUiOjE5LjksIm1pbiI6MTAsIm1heCI6MTAwMH0sImVsZW1lbnQzRXBzaWxvbiI6eyJsYWJlbCI6IkVwc2lsb24iLCJlbGVtZW50IjoyLCJwcm9wZXJ0eSI6ImVwc2lsb24iLCJ2YWx1ZSI6LTAuNDk1LCJtaW4iOi0wLjUsIm1heCI6MH0sInBhaXIxMUZvcmNlcyI6eyJlbGVtZW50MSI6MCwiZWxlbWVudDIiOjAsInByb3BlcnR5IjoidXNlIiwidmFsdWUiOnRydWV9LCJwYWlyMTFFcHNpbG9uIjp7ImVsZW1lbnQxIjowLCJlbGVtZW50MiI6MCwicHJvcGVydHkiOiJlcHNpbG9uIiwidmFsdWUiOi0wLjUsIm1pbiI6LTAuNSwibWF4IjowfSwicGFpcjExU2lnbWEiOnsiZWxlbWVudDEiOjAsImVsZW1lbnQyIjowLCJwcm9wZXJ0eSI6InNpZ21hIiwidmFsdWUiOjAuMjY1LCJtaW4iOjAuMDEsIm1heCI6MC41fSwicGFpcjEyRm9yY2VzIjp7ImVsZW1lbnQxIjowLCJlbGVtZW50MiI6MSwicHJvcGVydHkiOiJ1c2UiLCJ2YWx1ZSI6dHJ1ZX0sInBhaXIxMkVwc2lsb24iOnsiZWxlbWVudDEiOjAsImVsZW1lbnQyIjoxLCJwcm9wZXJ0eSI6ImVwc2lsb24iLCJ2YWx1ZSI6LTAuMjUsIm1pbiI6LTAuNSwibWF4IjowfSwicGFpcjEyU2lnbWEiOnsiZWxlbWVudDEiOjAsImVsZW1lbnQyIjoxLCJwcm9wZXJ0eSI6InNpZ21hIiwidmFsdWUiOjAuMzc4LCJtaW4iOjAuMDEsIm1heCI6MC41fSwicGFpcjEzRm9yY2VzIjp7ImVsZW1lbnQxIjowLCJlbGVtZW50MiI6MiwicHJvcGVydHkiOiJ1c2UiLCJ2YWx1ZSI6dHJ1ZX0sInBhaXIxM0Vwc2lsb24iOnsiZWxlbWVudDEiOjAsImVsZW1lbnQyIjoyLCJwcm9wZXJ0eSI6ImVwc2lsb24iLCJ2YWx1ZSI6LTAuNSwibWluIjotMC41LCJtYXgiOjB9LCJwYWlyMTNTaWdtYSI6eyJlbGVtZW50MSI6MCwiZWxlbWVudDIiOjIsInByb3BlcnR5Ijoic2lnbWEiLCJ2YWx1ZSI6MC4xODYsIm1pbiI6MC4wMSwibWF4IjowLjV9LCJwYWlyMjJFcHNpbG9uIjp7ImVsZW1lbnQxIjoxLCJlbGVtZW50MiI6MSwicHJvcGVydHkiOiJlcHNpbG9uIiwidmFsdWUiOi0wLjA2NSwibWluIjotMC41LCJtYXgiOjB9LCJwYWlyMjJTaWdtYSI6eyJlbGVtZW50MSI6MSwiZWxlbWVudDIiOjEsInByb3BlcnR5Ijoic2lnbWEiLCJ2YWx1ZSI6MC4xNTcsIm1pbiI6MC4wMSwibWF4IjowLjV9LCJhdG9tcyI6eyJ4IjpbMi4xNDI2Nzg2MzM1ODY5Njc0LDEuODUyODE2MDE4MjkwMzkyLDEuODM2MDAxODUwNzQ5NzE5NiwyLjE0NTg4ODM1MjQ5MjI3NiwxLjk5MDMxNzM3MjgwOTY5NCwxLjk5MzQyMjI3NDExMTY3NTQsMS42OTEwMzQwMzA0MzE1MzMyLDIuNDQyMTUzNDM2NjU0Mzc0MiwyLjI4ODQzMTUwMDQ2MDYyLDEuNTQ4NDczMTc3NTMyNTk0OCwyLjEzNDcwMzQwOTU1MDQ2NzMsMi4yODk3MDAzNjI1ODQ2MTc3LDIuNDQwMjc2NDczNTIwMzczLDIuNTg3ODc3Njc3NTgwMTQ3OCwyLjczNjgwODg0NDAzMTMwOV0sInkiOlswLjc2Nzk2NDMwMjEwODI0NTIsMC4yNzI0MDYyODMxMTMxOTQ3LDAuNzczMzgxMTMwNjk3NTIyMywwLjI2MDA2MzQ1NjEwMjI3MTk0LDAuNTE4Mjg2NzgyMzU4NTg2NSwxLjAyNzg3Njc0OTMyMjkyNDYsMC41MTQwMDY5OTA1NzEzNzc2LDAuMjcyNjgyMjkwODk2NTY0MywxLjAyMDM0MTY3OTU0NDY3NzEsMC4yNTY0MjMxMjEwNzQwNjY0LDEuMjgwNjA1MDE5OTY5NjYyNiwwLjUyMTI5NTg3MzAzNjU2NzMsMC43NzIzNzczNTcyMTI3MDY4LDAuNTIyMDIxNTM2NjU4ODY5NywwLjI2MjQ5NjAzMTAxNjc1NjhdLCJ2eCI6WzAuMDAwMDkwMTI4NDk4MDgyNTkyODYsMC4wMDA1NDYwNTc0OTc4OTU3ODM5LDAuMDAwNDEzNDIyNTUxMTYzNTg3OTUsLTAuMDAwMTM3NDg5NjExMjQyNTY0NjQsMC4wMDAxMzcxMzc0Nzg5MDQxMTgwMywwLjAwMDAxMTQxOTg3MTI1NzI0MjUyMywtMC4wMDA2MzU4MzIwNDAwNDU0NzUyLC0wLjAwMDE1OTAxODkwNzEyNDIwMTIyLDAuMDAwMTIxMzcxMzI5OTA0MDg2MjUsLTAuMDAwMjkwMDc0NzM4MzMzODQzMiwwLjAwMDA4MDU2OTY5OTg2ODI0NzQzLDAuMDAwNDE3OTk0NTk1MDg5ODM2OTMsMC4wMDAyMzk5OTg5MzI3MzU4NDgsLTAuMDAwNTM4NjkyMzk1NzE2Njc5OSwwLjAwMDAwNzQ1NjU3MTMxMDYyMDM2MV0sInZ5IjpbLTAuMDAwMDYyNDQxMzgzMTE5MDc5NTksMC4wMDAyMDEwODg3MDEwNDM2Njk1MiwwLjAwMDExMzc2NjAxMzI0MjUxNjE3LC0wLjAwMDE4ODYzOTQ1MDQ2NTI2NjAyLC0wLjAwMDAzOTU4MjUzMjk3NTc4MDY4LDAuMDAwMjM3NjE3MzU5NjE5MjMyNSwtMC4wMDAzMDMxODA0OTA0MzM2ODA0LDAuMDAwMjcyNzU5Nzk2Njk5Mjc5OCwtMC4wMDAyODQzNTI0MDIzMzE3NzEzLDAuMDAwMjA3ODY0NDk1NTYzOTEyMzgsLTAuMDAwMDQ0NjA3NjQzNTk2OTgzMzUsMC4wMDAwNjExNDEwNTU1NTc2Mjc0NCwwLjAwMDA0ODY2NTA1MTAyMzAzNzg0LC0wLjAwMDA4NDYxODg5Mjk3MzIwNjk0LDAuMDAwMTE4NjQ2OTQ4NTA3MDk4MzJdLCJjaGFyZ2UiOlswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMF0sImZyaWN0aW9uIjpbMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDBdLCJlbGVtZW50IjpbMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDBdLCJwaW5uZWQiOlswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMF0sImRyYWdnYWJsZSI6WzEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDEsMSwxXX19" key="8" />

                </div>
            </List>
          </div>
        </div>
          }
        <div className="version-identifier">iOS 20171024.3</div>
      </div>
    </MuiThemeProvider>
    );
  }
}

