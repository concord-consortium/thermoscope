# Thermoscope
This repository contains the initial code to visualize matter at different temperatures, controlled either directly from the application, or by input from an external temperature sensor.

## Testing
Latest builds for the Thermoscope application can be found here: https://thermoscope.concord.org/branch/master/
Main production url is https://thermoscope.concord.org/ though there is heavy caching on this site.

Thermoscope apps on iPad devices are currently using MASTER branch.

The main Thermoscope demo page is here: https://thermoscope.concord.org/branch/master/thermoscope/ and accepts url parameters as follows:
https://concord-consortium.github.io/thermoscope/thermoscope/?A=liquid&B=liquid&controls=false

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


The Particle Modeler demo can be found here: https://thermoscope.concord.org/branch/master/particle-modeler
To access the Particle Modeler in Authoring mode, adjust the url to add #authoring=true, for example: https://thermoscope.concord.org/branch/master/particle-modeler/#authoring=true

## Development

First, you need to make sure that webpack is installed and all the NPM packages required by this project are available:

```
npm install -g webpack
npm install
```
Then you can build the project files using:
```
webpack
```
or start webpack dev server:
```
npm install -g webpack-dev-server
webpack-dev-server
```
and open http://localhost:8080/ or http://localhost:8080/webpack-dev-server/ (auto-reload after each code change).

## Deployment

#### Github Pages:
Run `./build-and-deploy.sh`
