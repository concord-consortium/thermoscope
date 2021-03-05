# Thermoscope
This repository contains the initial code to visualize matter at different temperatures, controlled either directly from the application, or by input from an external temperature sensor.

## Testing
Latest builds for the Thermoscope application can be found here: https://thermoscope.concord.org/branch/master/
Main production url is https://thermoscope.concord.org/ though there is heavy caching on this site.


The main Thermoscope demo page is here: https://thermoscope.concord.org/ and accepts url parameters as follows:
https://thermoscope.concord.org/?A=liquid&B=liquid&controls=false&hideB

where `A` and `B` (case sensitive) represent Thermoscopes A and B's default particle visualization, which can be one of the following states (default is `solid`):
   ```
   solid
   liquid
   gas
   ```

Additionally, the `controls` parameter can be used to show or hide the controls at the bottom of the thermoscope (default is true):
   ```
   controls=true/false
   ```

The `hideA`, `hideB` and `hideC` parameters can start any of the thermoscope displays with the aperture closed

## Particle Modeler
The Production version of the Particle Modeler is built from the `particle-modeler-app` branch.
The Particle Modeler is built by updating the webpack configuration to use the `/particle-modeler/index` as the root of the files for the `dist` folder.

```
module.exports = {
  entry: {
    'particle-modeler': './js/particle-modeler/index.js'
     ...
```

The Web version of the Particle Modeler can be found here: https://particle-modeler.concord.org/
To access the Particle Modeler in Authoring mode, adjust the url to add #authoring=true, for example: https://thermoscope.concord.org/particle-modeler/#authoring=true

## Development

First, you need to make sure that webpack is installed and all the NPM packages required by this project are available:

```
npm install
```
Then you can build the project files using:
```
npm start
```
And serve the contents of `dist` using, e.g. live-server
```
live-server dist
```
or start webpack dev server:
```
npm install -g webpack-dev-server
webpack-dev-server
```
and open http://localhost:8080/ or http://localhost:8080/webpack-dev-server/ (auto-reload after each code change).

To connect to a thermoscope on Windows 10, install the Web Bluetooth Polyfill Chrome extension:
https://github.com/urish/web-bluetooth-polyfill
Follow the installation instructions in the repository's readme file.

## Deployment
Both the Thermoscope and the Particle Modeler are primarily intended as iOS applications, but there are web versions of each available online.

### Web
Production branch will deploy the Thermoscope to the root of `https://thermoscope.concord.org`

The Particle Modeler web application has been updated by switching to the `particle-modeler-app` branch, building, and manually copying the contents of the `Dist` folder to the S3 bucket.
### iOS
The Thermoscope App is built from XCode by taking a self-contained `Dist` folder, built from this repository, and embedding it in the web view (see https://github.com/concord-consortium/thermoscope-ios-ble for the XCode project), requiring no external connection.

The Particle Modeler is built in a similar fashion, but by adjusting a few settings in `webpack.config.js` to set the Particle Modeler as the launch screen (with no navigation to the Thermoscope side of the application). For simplicity, the `particle-modeler-app` branch has this set already. Once a build is done from this branch, the new `dist` folder can be copied into the XCode project at https://github.com/concord-consortium/particle-modeler-ios.
#### Obsolete iOS publishing
iOS devices using the Thermoscope app used to depend on the deployed output of `ios` branch by using the webview on iOS and pointing to the live branch at https://thermoscope.concord.org/branch/ios/. The app on iPads was formerly hard-wired to the iOS path.

