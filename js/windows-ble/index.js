import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import LogoMenu from '../components/logo-menu';
import { List, li } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';

import '../../css/app.less';
import '../../css/windows-ble.less';

// Required by Material-UI library.
injectTapEventPlugin();

darkBaseTheme.palette.textColor = '#ccc';


export class WindowsBLE extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {};
    
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="app">
          <h1>Windows BLE Support</h1>
          <LogoMenu scale="logo-menu"/>
          
          <div className="app-container">
            <div>
                <p>It looks like you're using Windows - if you want to connect to a Thermoscope on Windows, 
                    you need to install some software.</p>
                <p>The Windows 10 Web Bluetooth Polyfill (created by Uri Shaked) allows the Chrome browser 
                    to connect to Bluetooth devices. 
                    Follow instructions below, or check 
                    the <a href="https://github.com/urish/web-bluetooth-polyfill">GitHub repository</a> for 
                    the latest version and more information.</p>
                <h2>Installation</h2>
                <ol>
                    <li>
                        You need to have Windows 10 Creators Update (version 1703 / build 15063) or newer
                    </li>
                    <li>
                        You also need Visual C++ Redistributable for Visual Studio 2015 (x86), if not already installed
                    </li>
                    <li>
                        Download the <a href="chrome-ble-extension.zip">Chrome BLE extension</a>
                    </li>
                    <li>
                        Open Chrome Extensions pane (chrome://extensions/) and enable "Developer Mode" 
                        (there is a checkbox on top of the page)
                    </li>
                    <li>
                        Click the "Load unpacked extension..." button
                    </li>
                    <li>
                        Choose the extension folder inside the cloned repo
                    </li>
                    <li>
                        Take a note of the extension ID for the newly added extension, you will need it in step 8. 
                        The ID is a long string of lowercase english letters, e.g. mfjncijdfecdpkfldkechgoadojddehp
                    </li>
                    <li>
                        Download the <a href="BLEServer-0.3.6.zip">BLEServer (v0.3.6)</a> and unpack it inside 
                        C:\Program Files (x86)\Web Bluetooth Polyfill
                    </li>
                    <li>
                        Edit C:\Program Files (x86)\Web Bluetooth Polyfill\manifest.json and change the extension id 
                        in the allowed_origins section to match the extension ID you found in step 6
                    </li>
                    <li>
                        Run C:\Program Files (x86)\Web Bluetooth Polyfill\register.cmd to register the Native Messaging server
                    </li>
                </ol>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

}

ReactDOM.render(<WindowsBLE/>, document.getElementById('app'));
