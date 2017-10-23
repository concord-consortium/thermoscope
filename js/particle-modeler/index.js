import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import Lab from 'react-lab';
import NewAtomBin from './new-atom-bin';
import Authoring from './authoring';
import SimulationControls from './simulation-controls';
import models from './models/';
// Set of authorable properties which can be overwritten by the url hash.
import authorableProps from './models/authorable-props';
import { getStateFromHashWithDefaults, getDiffedHashParams, parseToPrimitive, getURLParam, getModelDiff, loadModelDiff } from '../utils';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import LogoMenu from '../components/logo-menu';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getUsername from '../components/user-name-generator.js';
import '../../css/app.less';
import '../../css/particle-modeler.less';

import Rebase from 're-base';
var base = Rebase.createClass({
    apiKey: "AIzaSyChElp_DuPn3Q0jwV1VXq2M4urgKgANrKw",
    authDomain: "particlemodeler.firebaseapp.com",
    databaseURL: "https://particlemodeler.firebaseio.com",
    storageBucket: "particlemodeler.appspot.com",
    messagingSenderId: "708009502450"
});
// Required by Material-UI library.
injectTapEventPlugin();

let api, lab;

let atomBox = {
      x: 0.37,
      y: 2.22,
      spacing: 0.24
    },
    delIcon = {
      x: 4.187,
      y: 0.141,
      width: 0.141,
      height: 0.146
  };

let particleMaxVelocity = 0.0005;
let saveStateInterval = 2000;

let slowSpeedTimeStep = 0.05;

export default class Interactive extends PureComponent {

  constructor(props) {
    super(props);
    let hashParams = window.location.hash.substring(1),
      model = models.emptyModel,
      authoredState = getStateFromHashWithDefaults(hashParams, authorableProps),
      urlModel = getURLParam("model"),
      // Disable recording of student interaction by default
      recordInteractions = getURLParam("record") ? getURLParam("record") === "true" : false;
    if (urlModel) {
      authoredState = loadModelDiff(JSON.parse(atob(urlModel)), authorableProps);
      if (authoredState.atoms) model.atoms = authoredState.atoms;
    }
    // Group session identifiers by current hour to collate student activity in Firebase
    let d = new Date();
    let sessionDate = Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDay(),d.getUTCHours());
    let sessionName = getUsername();

    this.state = {
      interactive: models.interactive,
      model,
      showAtom0: true,
      showAtom1: true,
      showAtom2: true,
      deleteHover: false,
      showRestart: false,
      pinnedAtoms: {},
      nextUpdate: Date.now(),
      sessionDate,
      sessionName,
      recordInteractions,
      modelDiff: getModelDiff(authoredState, authorableProps),
      ...authoredState
    };

    this.handleModelLoad = this.handleModelLoad.bind(this);
    this.addNewDraggableAtom = this.addNewDraggableAtom.bind(this);
    this.handleAuthoringPropChange = this.handleAuthoringPropChange.bind(this);
    this.changeElementCount = this.changeElementCount.bind(this);
    this.handleSimulationChange = this.handleSimulationChange.bind(this);
    this.studentView = this.studentView.bind(this);
    this.generatePinnedParticleText = this.generatePinnedParticleText.bind(this);
    this.addPinnedParticleText = this.addPinnedParticleText.bind(this);
    this.removePinnedParticleText = this.removePinnedParticleText.bind(this);
    this.getCurrentModelLink = this.getCurrentModelLink.bind(this);
    this.updateDiff = this.updateDiff.bind(this);
    this.toggleContainerVisibility = this.toggleContainerVisibility.bind(this);
  }

  componentWillMount() {
    this.captureErrors();
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  captureErrors() {
    window.onerror = (message, file, line, column, errorObject) => {
      column = column || (window.event && window.event.errorCharacter);
      var stack = errorObject ? errorObject.stack : null;

      var data = {
        message: message,
        file: file,
        line: line,
        column: column,
        errorStack: stack,
      };
      // If we want to log externally, use data, or grab on the console for more information
      // console.log(data);
      if (file.indexOf("lab.min.js") > -1) {
        // likely indication of divergent lab model - offer a graceful restart button
        this.setState({ showRestart: true });
      }
    }
  }

  setModelProps(prevState = {}) {
    let newModelProperties = {},
        newElementProperties = [{}, {}, {}],
        newPairwiseProperties = [[{}, {}, {}], [{}, {}, {}], [{}, {}, {}]];
    for (let prop in authorableProps) {
      let value = this.state[prop];
      if (value !== "" && value !== prevState[prop]) {
        if (value.hasOwnProperty("element")) {
          newElementProperties[value.element][value.property] = parseToPrimitive(value);
        } else if (value.hasOwnProperty("element1")) {
          newPairwiseProperties[parseToPrimitive(value.element1)][parseToPrimitive(value.element2)][value.property] = parseToPrimitive(value);
        } else {
          newModelProperties[prop] = parseToPrimitive(value);
        }
      }
    }

    api.set(newModelProperties);

    for (let elem in newElementProperties) {
      api.setElementProperties(elem, newElementProperties[elem]);
    }
    for (let elem1 = 0; elem1 < newPairwiseProperties.length; elem1++) {
      for (let elem2 = 0; elem2 < newPairwiseProperties[elem1].length; elem2++) {
        let pairValue = newPairwiseProperties[elem1][elem2];
        if (Object.keys(pairValue).length > 0) {
          if (this.state[`pair${(elem1+1)}${(elem2+1)}Forces`].value) {
            api.setPairwiseLJProperties(elem1, elem2, { sigma: parseToPrimitive(this.state[`pair${(elem1+1)}${(elem2+1)}Sigma`].value), epsilon: parseToPrimitive(this.state[`pair${(elem1+1)}${(elem2+1)}Epsilon`].value) });
          } else {
            api.removePairwiseLJProperties(elem1, elem2);
          }
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let hash = getDiffedHashParams(this.state, authorableProps);
    window.location.hash = hash;
    this.setModelProps(prevState);
    this.saveModel();
  }

  getAtomsWithoutPlaceholders() {
    if (!api) return null;
    //clean out placeholder atoms - they get added separately
    let ax = [], ay = [], vx = [], vy = [], charge = [], friction = [], element = [], pinned = [], draggable = [];
    for (var i = 0, a; i < api.getNumberOfAtoms(); i++) {
      a = api.getAtomProperties(i);
      // only add live elements, not draggable, pinned placeholders
      if (a.element < this.state.elements.value) {
        ax.push(a.x);
        ay.push(a.y);
        vx.push(a.vx);
        vy.push(a.vy);
        charge.push(a.charge);
        friction.push(0); // using a.friction can cause issues - dragging temporarily sets friction to 10, but this value can stick around when creating a link to the model
        element.push(a.element);
        pinned.push(a.pinned);
        draggable.push(a.draggable);
      }
    }
    let atoms = {
      x: ax, y: ay, vx, vy, charge, friction, element, pinned, draggable
    };
    return atoms;
  }

  saveModel() {
    const { recordInteractions, modelDiff, sessionDate, sessionName } = this.state;
    // To save entire model:
    // lab.interactiveController.getModel().serialize();
    if (recordInteractions){
      base.post(`${sessionDate}/${sessionName}/${Date.now()}`, {
        data: modelDiff
      }).then(() => {
        // update completed console.log("then");
        }).catch(err => {
          console.log("Error storing diff data on Firebase", err);
      });
    }
  }

  handleModelLoad() {
    api = lab.scriptingAPI;
    this.addPinnedParticleText();
    if (!this.state.Container || this.state.Container.value === false) this.toggleContainerVisibility(false);
    api.onDrag('atom', (x, y, d, i) => {
      if (d.pinned === 1) {
        let el = d.element,
          newState = {};
        // initial spawned elements do not interact with the simulation
        if (el >= this.state.elements.value) {
          el -= 3;
          newState["showAtom"+el] = false;
        } else {
          // this was a pinned live particle
          this.removePinnedParticleText(i)
        }
        api.setAtomProperties(i, {pinned: 0, element: el});

        this.setState(newState);
        this.addNewDraggableAtom(el);
      } else {
        if (d.x > delIcon.x && d.x < delIcon.x+delIcon.width && d.y > delIcon.y && d.y < delIcon.y+delIcon.height) {
          // mark atoms for deletion
          if (!d.marked) {
            this.setState({deleteHover: true});
            api.setAtomProperties(i, { marked: 1 });

          }
        } else if (d.marked) {
          this.setState({deleteHover: false});
          api.setAtomProperties(i, {marked: 0});
        }
      }
      if (this.state.nextUpdate < Date.now()) {
        // this triggers component update & save
        this.updateDiff(Date.now() + saveStateInterval);
      }
    });

    api.onClick('atom', (x, y, d, i) => {
      if (d.pinned === 0) {
        api.setAtomProperties(i, { pinned: 1 });
        let newState = this.state.pinnedAtoms;
        newState[i] = { x, y };
        this.setState({ pinnedAtoms: newState });
        this.addPinnedParticleText(i);
      } else if (d.element < this.state.elements.value){
        api.setAtomProperties(i, { pinned: 0 });
        this.removePinnedParticleText(i);
      }
      this.updateDiff(Date.now());
    });

    api.onPropertyChange('time', function (t) {
      // this will fire every tick
      for (var i = 0, a; i < api.getNumberOfAtoms(); i++) {
        a = api.getAtomProperties(i);
        if (((a.vx * a.vx) + (a.vy * a.vy)) > particleMaxVelocity) {
          // particles moving too fast can cause the model to freeze up
          let adjustedVx = a.vx * 0.01;
          let adjustedVy = a.vy * 0.01;
          api.setAtomProperties(i, { vx: adjustedVx, vy: adjustedVy });
        }
      }
    });
    let deleteMarkedAtoms = () => {
      let atomsToDelete = [];
      for (let i=0, ii=api.getNumberOfAtoms(); i<ii; i++) {
        if (api.getAtomProperties(i).marked && ! api.getAtomProperties(i).pinned)
          atomsToDelete.push(i);
      }
      for (let i=atomsToDelete.length-1; i>-1; i--) {
        api.removeAtom(atomsToDelete[i]);
      }

      this.setState({deleteHover: false});
    }

    lab.iframe.contentDocument.body.onmouseup = deleteMarkedAtoms;
    lab.iframe.contentDocument.body.style.touchAction = "none";

    for (let i = 0; i < this.state.elements.value; i++){
      this.addNewDraggableAtom(i);
    }

    this.setModelProps();
  }

  generatePinnedParticleText(i) {
      let textProps = {
          "text": "P",
          "hostType": "Atom",
          "hostIndex": i,
          "layer": 1,
          "textAlign": "center",
          "width": 0.3
        };
      return textProps;
  }

  addPinnedParticleText(particle) {
    if (!particle) {
      // add boxes for all pinned particles
      api.set({ 'textboxes': {} });
      let textToAdd = [];
      for (let i = 0; i < api.getNumberOfAtoms(); i++){
        let a = api.getAtomProperties(i);
        if (a.pinned && a.element < this.state.elements.value) {
          let textProps = this.generatePinnedParticleText(i);
          api.addTextBox(textProps);
        }
      }
    } else {
      // add box for specific particle
      let textProps = this.generatePinnedParticleText(particle);
      api.addTextBox(textProps);
    }
  }
  removePinnedParticleText(particle) {
    let textboxes = api.get('textBoxes');
    let textToRemove = -1;
    for (let i = 0; i < textboxes.length; i++){
      if (textboxes[i].hostIndex == particle) {
        textToRemove = i;
        break;
      }
    }
    if (textToRemove > -1) api.removeTextBox(textToRemove);
  }

  addNewDraggableAtom(el = 0, skipCheck = false) {
    if (skipCheck || this.state.elements.value > el) {
      let y = atomBox.y - (el * atomBox.spacing),
        added = api.addAtom({ x: atomBox.x, y: y, element: (el + 3), draggable: 1, pinned: 1 });
      if (!added) {
        setTimeout(() => this.addNewDraggableAtom(el), 2000);
      } else {
        let newState = {};
        newState["showAtom" + el] = true;
        this.setState(newState);
      }
    }
  }

  studentView() {
    this.setState({ authoring: false });
  }

  handleSimulationChange(changedProps){
      api.set(changedProps);
  }

  handleAuthoringPropChange(prop, value) {
    let newState = {};
    newState[prop] = {...this.state[prop]};
    newState[prop].value = parseToPrimitive(value);

    if (prop === "elements") {
      this.changeElementCount(value);
    }
    if (prop === "Container") {
      this.toggleContainerVisibility(value);
    }
    if (prop === "ContainerHeight") {
      for (let i = 0; i < 6; i++) {
        let l = api.getLineProperties(i);
        if (i === 0) l.y1 = value;
        if (i === 4) l.y2 = value;
        if (i === 5) {
          l.y1 = value;
          l.y2 = value;
        }

        api.setLineProperties(i, l);
      }
    }
    newState.nextUpdate = Date.now();
    newState.atoms = this.getAtomsWithoutPlaceholders();
    newState.modelDiff = getModelDiff(newState, authorableProps);
    this.setState(newState);
  }

  toggleContainerVisibility(visible) {
    // get lines and modify y
    // initial setup in model is visible = true
    // hence all initial y coords will be positive
    let currentlyVisible = api.getLineProperties(0).y1 > 0;
    if (visible && !currentlyVisible || !visible && currentlyVisible) {
      for (let i = 0; i < 6; i++) {
        let l = api.getLineProperties(i);
        l.y1 *= -1;
        l.y2 *= -1;
        api.setLineProperties(i, l);
      }
    }
  }

  changeElementCount(newElementCount) {
    // has the number of elements been increased
    if (newElementCount > this.state.elements.value) {
      for (let i = this.state.elements.value; i < newElementCount; i++){
        this.addNewDraggableAtom(i, true);
      }
    } else {
      let atomsToDelete = [];
      // iterate through all atoms, remove any for elements no longer needed
      for (let i = 0, ii = api.getNumberOfAtoms(); i < ii; i++) {
        if (api.getAtomProperties(i).element >= newElementCount)
          atomsToDelete.push(i);
      }
      for (let i = atomsToDelete.length - 1; i > -1; i--) {
        api.removeAtom(atomsToDelete[i]);
      }
      // because initial draggable elements are a different type, recreate the hidden dragables after deleting
      for (let i = 0; i < newElementCount; i++){
        this.addNewDraggableAtom(i, true);
      }
    }
  }

  updateDiff(nextUpdate) {
    let currentState = this.state;
    currentState.atoms = this.getAtomsWithoutPlaceholders();
    let modelDiff = getModelDiff(currentState, authorableProps);

    this.setState({ nextUpdate, atoms: currentState.atoms, modelDiff});
  }

  getCurrentModelLink() {
    if (this.state.authoring) {
      let d = this.state.modelDiff;
      if (d) {
        // this is called each render
        let link = JSON.stringify(d);
        let encodedLink = btoa(link);
        let finalLink = window.location.origin + window.location.pathname + "?model=" + encodedLink;
        return finalLink;
      }
    }
    return null;
  }

  render() {
    const { authoring, showFreezeButton, showRestart} = this.state;
    let appClass = "app";
    if (authoring) {
      appClass += " authoring";
    }

    let deleteOpacity = this.state.deleteHover ? 0.3 : 0.7;
    let newAtomVisibility = {
      atomsToShow: [this.state.showAtom0, this.state.showAtom1, this.state.showAtom2],
      count: this.state.elements.value
    };

    return (
      <MuiThemeProvider>
        <div className={appClass}>
          <LogoMenu scale="logo-menu small" navPath="../index.html" />
          <div className="app-container">
            <div className="lab-wrapper">
              <Lab ref={node => lab = node} model={this.state.model} interactive={this.state.interactive} height='380px'
                playing={true} onModelLoad={this.handleModelLoad} embeddableSrc='../lab/embeddable.html' />
              <div className="lab-ui">
                <NewAtomBin atomVisibility={newAtomVisibility} onParticleAdded={true} />

                <DeleteIcon className="delete-icon" style={{ width: 45, height: 50, opacity: deleteOpacity }} />
              </div>
            </div>
            {authoring && <div>
              <IconButton id="studentView" iconClassName="material-icons" className="student-button" onClick={this.studentView} tooltip="student view">school</IconButton>
              <Authoring {...this.state} onChange={this.handleAuthoringPropChange} />
              <IconButton key="modelSnapshot" iconClassName="material-icons" className="model-link-button" onClick={this.updateDiff} tooltip="update link">share</IconButton>
              <div className="model-link"><a href={this.getCurrentModelLink()} target="_blank" rel="noopener">Link for Current Model</a></div>
            </div>}
          </div>
          <SimulationControls {...this.state} onChange={this.handleSimulationChange} />
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<Interactive/>, document.getElementById('app'));
