# Thermoscope
This repository contains the initial code to visualize matter at different temperatures, controlled either directly from the application, or by input from an external temperature sensor.

## Testing
Latest published builds for the Thermoscope demo are deployed to https://concord-consortium.github.io/thermoscope/

The Particle Modeler demo can be found here: https://concord-consortium.github.io/thermoscope/particle-modeler
To access the Particle Modeler in Authoring mode, adjust the url to add #authoring=true, for example: https://concord-consortium.github.io/thermoscope/particle-modeler/#authoring=true

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
You can build a simple github page deployment by following these steps:
1. prepare the destination directory: `rm -rf ./dist`
1. clone the gh-pages branch to dist: `git clone -b gh-pages https://github.com/concord-consortium/thermoscope.git dist`
1. build: `webpack`
1. add the files, commit and push: `cd dist; git add . && git commit -m 'Update gh-pages' && git push origin gh-pages`
