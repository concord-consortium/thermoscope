# Thermoscope
This repository contains the initial code to visualize matter at different temperatures, controlled either directly from the application, or by input from an external temperature sensor.

## Testing
Latest published builds for the Thermoscope demo are deployed to https://concord-consortium.github.io/thermoscope/

The Particle Modeler demo can be found here: https://concord-consortium.github.io/thermoscope/particle-modeler
To access the Particle Modeler in Authoring mode, adjust the url to add #authoring=true, for example: https://concord-consortium.github.io/thermoscope/particle-modeler/#authoring=true

The Speedometer demo is available here: https://concord-consortium.github.io/thermoscope/meter

The three thermoscope page is available here: https://concord-consortium.github.io/thermoscope/three-thermoscope

To connect to the LabQuest2 device, you need an http connection. Since Github pages force https, there is a copy of the site available on S3 that can be accessed via http. The best url for demonstrating sensor connection is hosted here:
http://models-resources.concord.org/thermoscope/index.html

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