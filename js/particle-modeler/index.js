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
import Clock from '../components/clock';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getUsername from '../components/user-name-generator.js';
import { updateContainerLid, updateContainerVisibility, getContainerPosition } from './container';

import '../../css/app.less';
import '../../css/particle-modeler.less';
import '../../css/redesign/particle-modeler-student.less';

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
      model = models.mixing,
      authoredState = getStateFromHashWithDefaults(hashParams, authorableProps),
      urlModel = getURLParam("model"),
      allowLiveDragging = getURLParam("allowLiveDragging") ? true : false,
      // Disable recording of student interaction by default
      recordInteractions = getURLParam("record") ? getURLParam("record") === "true" : false;
    if (urlModel) {
      authoredState = loadModelDiff(JSON.parse(atob(urlModel)), authorableProps);
      if (authoredState.atoms) model.atoms = authoredState.atoms;
    }
    // Group session identifiers by current hour to collate student activity in Firebase
    let d = new Date();
    let sessionDate = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCHours());
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
      allowLiveDragging,
      simulationRunning: false,
      modelDiff: getModelDiff(authoredState, authorableProps),
      ...authoredState
    };

    this.handleModelLoad = this.handleModelLoad.bind(this);
    this.addNewDraggableAtom = this.addNewDraggableAtom.bind(this);
    this.handleAuthoringPropChange = this.handleAuthoringPropChange.bind(this);
    this.changeElementCount = this.changeElementCount.bind(this);
    this.handleSimulationChange = this.handleSimulationChange.bind(this);
    this.studentView = this.studentView.bind(this);
    this.generateParticleText = this.generateParticleText.bind(this);
    this.addParticleText = this.addParticleText.bind(this);
    this.removeParticleText = this.removeParticleText.bind(this);
    this.getCurrentModelLink = this.getCurrentModelLink.bind(this);
    this.updateDiff = this.updateDiff.bind(this);
    this.toggleRunState = this.toggleRunState.bind(this);
    this.toggleHeat = this.toggleHeat.bind(this);
    this.toggleContainerLid = this.toggleContainerLid.bind(this);
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
          if (this.state[`pair${(elem1 + 1)}${(elem2 + 1)}Forces`].value) {
            api.setPairwiseLJProperties(elem1, elem2, { sigma: parseToPrimitive(this.state[`pair${(elem1 + 1)}${(elem2 + 1)}Sigma`].value), epsilon: parseToPrimitive(this.state[`pair${(elem1 + 1)}${(elem2 + 1)}Epsilon`].value) });
          } else {
           //  api.removePairwiseLJProperties(elem1, elem2);
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
    if (recordInteractions) {
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
    api.stop();
    this.addParticleText();
    if (this.state.container) {
      const containerScale = this.state.authoring ? 0.5 : 0.3534;
      updateContainerVisibility(this.state.container.value, null, this.state.containerHeight, this.state.containerLid, api, containerScale);
      updateContainerLid(this.state.containerLid, this.state.containerLid.value, this.state.container.value, this.state.containerHeight, api);
    }
    api.onDrag('atom', (x, y, d, i) => {
      if (api.isStopped() || this.state.allowLiveDragging) {
        if (d.pinned === 1) {
          let el = d.element,
            newState = {};
          api.get
          // initial spawned elements do not interact with the simulation
          if (el >= this.state.elements.value) {
            el -= 3;
            newState["showAtom" + el] = false;
          } else {
            // this was a pinned live particle
            // this.removeParticleText(i)
          }
          api.setAtomProperties(i, { pinned: 0, element: el });

          this.setState(newState);
          this.addNewDraggableAtom(el);
        } else {
          let elementOverDeleteIcon = d.x > delIcon.x && d.x < delIcon.x + delIcon.width && d.y > delIcon.y && d.y < delIcon.y + delIcon.height;
          let elementInsideAtomBox = Math.abs(d.x - atomBox.x) < atomBox.spacing && Math.abs(d.y - atomBox.y) < atomBox.spacing;
          // check if atom is over the delete icon
          if (elementOverDeleteIcon) {
            // mark atoms for deletion
            if (!d.marked) {
              this.setState({ deleteHover: true });
              api.setAtomProperties(i, { marked: 1 });
            }
          } else if (!elementInsideAtomBox && d.marked) {
            this.setState({ deleteHover: false });
            api.setAtomProperties(i, { marked: 0 });
          } else if (elementInsideAtomBox) {
            if (!d.marked) {
              this.setState({ deleteHover: true });
              api.setAtomProperties(i, { marked: 1 });
            }
          }
        }
        if (this.state.nextUpdate < Date.now()) {
          // this triggers component update & save
          this.updateDiff(Date.now() + saveStateInterval);
        }
      }
    });

    api.onClick('atom', (x, y, d, i) => {
      if (d.pinned === 0) {
        api.setAtomProperties(i, { pinned: 1 });
        let newState = this.state.pinnedAtoms;
        newState[i] = { x, y };
        this.setState({ pinnedAtoms: newState });
        // this.addParticleText(i);
      } else if (d.element < this.state.elements.value) {
        api.setAtomProperties(i, { pinned: 0 });
        // this.removeParticleText(i);
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
      for (let i = 0, ii = api.getNumberOfAtoms(); i < ii; i++) {
        let d = api.getAtomProperties(i);
        if (d.marked && !d.pinned) {
          atomsToDelete.push(i);
        } else {
          let elementInsideAtomBox = Math.abs(d.x - atomBox.x) < atomBox.spacing && Math.abs(d.y - atomBox.y) < atomBox.spacing;
          if (elementInsideAtomBox && d.element < 3) {
            atomsToDelete.push(i);
          }
        }
      }
      for (let i = atomsToDelete.length - 1; i > -1; i--) {
        api.removeAtom(atomsToDelete[i]);
      }
      this.setState({ deleteHover: false });
    }

    lab.iframe.contentDocument.body.onmouseup = deleteMarkedAtoms;
    lab.iframe.contentDocument.body.style.touchAction = "none";

    for (let i = 0; i < this.state.elements.value; i++) {
      this.addNewDraggableAtom(i);
    }

    this.setModelProps();
  }

  generateParticleText(i, t, c) {
    let textProps = {
      "text": t ? t : "A",
      "hostType": "Atom",
      "hostIndex": i,
      "layer": 1,
      "textAlign": "center",
      "width": 0.03,
      "color": c ? c : "black"
    };
    return textProps;
  }

  convertHexToLabColor(hexColor) {
    if (hexColor[0] === '#') {
      hexColor = hexColor.substr(1);
    }

    var num = parseInt(hexColor, 16);
    num = num - Math.pow(2, 24);
  }

  addParticleText(particle) {
    let textboxes = api.get('textBoxes');
    for (let i = textboxes.length - 1; i >= 0; i--) {
      api.removeTextBox(i);
    }
    if (!particle) {
      var newVx = [];
      var newVy = [];
      var newTextboxes = [];
      // add boxes for all labeled particles
      api.set({ 'textboxes': {} });
      let textToAdd = [];
      for (let i = 0; i < api.getNumberOfAtoms(); i++) {
        let a = api.getAtomProperties(i);
        // if (a.x < 1.7) {
          // let textProps = this.generateParticleText(i, "A", "white");
          // api.addTextBox(textProps);
          // newTextboxes.push(textProps);
          // var adjustedVx = 0;
          // var adjustedVy = 0;
          // api.setAtomProperties(i, { vx: adjustedVx, vy: adjustedVy });
        // } else {
          let textProps = this.generateParticleText(i, "B");
          api.addTextBox(textProps);
          newTextboxes.push(textProps);
        // }
        newVx.push(api.getAtomProperties(i).vx);
        newVy.push(api.getAtomProperties(i).vy);
      }
      // console.log("New VX:", newVx.concat(','));
      // console.log("New Vy:", newVy.concat(','));
      console.log("new textboxes", JSON.stringify(newTextboxes.concat(',')));
    } else {
      // add box for specific particle
      let textProps = this.generateParticleText(particle);
      api.addTextBox(textProps);
    }
  }
  removeParticleText(particle) {
    let textboxes = api.get('textBoxes');
    let textToRemove = -1;
    for (let i = 0; i < textboxes.length; i++) {
      if (textboxes[i].hostIndex == particle) {
        textToRemove = i;
        break;
      }
    }
    if (textToRemove > -1) api.removeTextBox(textToRemove);
  }

  addNewDraggableAtom(el = 0, skipCheck = false) {
    if (!api.isStopped()) {
      // try again every couple of seconds - this ensures that if you hit run too fast after
      // adding a particle that a new particle would be present when the model is stopped
      setTimeout(() => this.addNewDraggableAtom(el, skipCheck), 2000);
    } else {
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
  }

  studentView() {
    this.setState({ authoring: false });
  }

  handleSimulationChange(changedProps) {
    api.set(changedProps);
  }

  handleAuthoringPropChange(prop, value) {
    let newState = {};
    newState[prop] = { ...this.state[prop] };
    newState[prop].value = parseToPrimitive(value);

    if (prop === "elements") {
      this.changeElementCount(value);
    }
    if (prop === "container") {
      try {
        updateContainerVisibility(value, null, this.state.containerHeight, this.state.containerLid, api);
        // if the container is set to invisible we need to also remove the lid
        if (!value) {
          let lid = this.state.containerLid;
          lid.value = false;
          this.setState({ containerLid: lid });
        }
      } catch (ex) {
        console.log("ERROR: ", ex);
        newState[prop].value = this.state[prop].value;
      }
    }
    if (prop === "containerHeight") {
      let h = value;
      try {
        updateContainerVisibility(this.state.container.value, h, this.state.containerHeight, this.state.containerLid, api)
      } catch (ex) {
        console.log("ERROR: ", ex);
        newState[prop].value = this.state[prop].value;
      }
    }
    if (prop === "containerLid") {
      try {
        newState[prop].value = updateContainerLid(this.state.containerLid, value, this.state.container.value, this.state.containerHeight, api); // container lid dependent on container visibility
      } catch (ex) {
        console.log("ERROR: ", ex);
        newState[prop].value = this.state[prop].value;
      }
    }
    newState.nextUpdate = Date.now();
    newState.atoms = this.getAtomsWithoutPlaceholders();
    newState.modelDiff = getModelDiff(newState, authorableProps);
    this.setState(newState);
  }

  changeElementCount(newElementCount) {
    // has the number of elements been increased
    if (newElementCount > this.state.elements.value) {
      for (let i = this.state.elements.value; i < newElementCount; i++) {
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
      for (let i = 0; i < newElementCount; i++) {
        this.addNewDraggableAtom(i, true);
      }
    }
  }

  toggleRunState() {
    if (api.isStopped()) {
      console.log("Simulation is currently stopped, attempting to start");
      // Check for atoms inside atom box and remove those first
      // These could have been left behind from setup moving atoms dragged into invalid locations
      let atomsToDelete = [];
      for (let i = 0, ii = api.getNumberOfAtoms(); i < ii; i++) {
        let d = api.getAtomProperties(i);
        // We have invisible / hidden atoms under the base of the beaker - ignore those
        if (d.element !== 2) {
          let elementInsideAtomBox = Math.abs(d.x - atomBox.x) < atomBox.spacing && Math.abs(d.y - atomBox.y) < atomBox.spacing;
          if (elementInsideAtomBox && d.element < 3) {
            atomsToDelete.push(i);
            console.log("Invalid position - inside box, will remove " + i);
          } else if (Math.abs(d.ax) > 0.1 || Math.abs(d.ay) > 0.1) {
            atomsToDelete.push(i);
            console.log("Invalid position - extreme acceleration, likely due to overlap, will remove " + i);
          }
        }
      }
      for (let i = atomsToDelete.length - 1; i > -1; i--) {
        api.removeAtom(atomsToDelete[i]);
      }
      atomsToDelete = [];

      // all atoms should now be valid
      api.start();
      if (!this.state.allowLiveDragging) {
        for (let i = 0, ii = api.getNumberOfAtoms(); i < ii; i++) {
          api.setAtomProperties(i, { draggable: false });
          if (api.getAtomProperties(i).element > 2) {
            api.setAtomProperties(i, { visible: false });
          }
        }
      }

    } else {
      console.log("Simulation is running, attempting to stop");
      api.stop();
      for (let i = 0, ii = api.getNumberOfAtoms(); i < ii; i++) {
        api.setAtomProperties(i, { draggable: true });
        if (api.getAtomProperties(i).element > 2) {
          api.setAtomProperties(i, { visible: true });
        }
      }

    }
    this.setState({ simulationRunning: !api.isStopped() });
  }

  toggleHeat(heatLevel) {
    if (heatLevel != undefined & api != undefined && heatLevel > 0) {
      const { container } = this.state;
      let heatAtoms = [];
      let containerPosition = getContainerPosition();

      // iterate through all atoms, remove elements no longer needed
      for (let i = 0, ii = api.getNumberOfAtoms(); i < ii; i++) {
        let a = api.getAtomProperties(i);
        if (a.element !== 2 && !a.pinned) {
          // heatable atoms are near the base of the simulation, and if the container is in place, only those inside the container
          if (a.y <= containerPosition.basePos + 0.5) {
            if (container.value) {
              if (a.x > containerPosition.leftPos && a.y < containerPosition.rightPos) heatAtoms.push(i);
            }
          }
        }
      }
      let heatValue = heatLevel;

      if (heatLevel !== 1 && heatAtoms.length > 0) {
        // excite lowest particles
        for (let i = heatAtoms.length - 1; i > -1; i--) {
          let p = api.getAtomProperties(heatAtoms[i]);
          api.setAtomProperties(heatAtoms[i], { vx: p.vx * heatLevel, vy: p.vy * heatLevel });
        }
      } else {
        //heatValue = 0
      }
      this.setState({ heatLevel: heatValue });
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

  toggleContainerLid() {
    const { containerLid, containerHeight } = this.state;
    updateContainerLid(containerLid, !containerLid.value, true, containerHeight, api);
    let lid = {...containerLid};
    lid.value = !containerLid.value;
    this.setState({ containerLid: lid });
  }

  render() {
    const { authoring, allowLiveDragging, heatLevel } = this.state;
    let appClass = "app";
    if (authoring) {
      appClass += " authoring";
    } else {
      appClass += " student";
    }

    let deleteOpacity = this.state.deleteHover ? 0.3 : 0.7;
    const deleteIconClass = this.state.deleteHover ? "delete-icon hover" : "delete-icon";
    let newAtomVisibility = {
      atomsToShow: [this.state.showAtom0, this.state.showAtom1, this.state.showAtom2],
      count: this.state.elements.value
    };

    let allowDragging = api ? (allowLiveDragging || api.isStopped()) : true;
    // we will only render the heatbath if it is set to a non-zero value
    let heatBathStyle = heatLevel > 1 ? "heatbath hot" : heatLevel < 1 ? "heatbath cold" : "heatbath";
    const labHeight = authoring ? 380 :  580;
    const labWidth = authoring ? 565 : 800;

    return (
      <MuiThemeProvider>
        <div className={appClass}>
          <div className="app-container" >
            <div className="sim-frame">
              <div className="sim-frame-overlay" />
            </div>
            <div className="lab-wrapper">
              <Lab ref={node => lab = node} model={this.state.model}
                interactive={this.state.interactive}
                height={labHeight}
                width={labWidth}
                frameBorder="0"
                playing={true}
                onModelLoad={this.handleModelLoad} embeddableSrc='../lab/embeddable.html' />
              { allowDragging &&
                <div className="lab-ui">
                <NewAtomBin atomVisibility={newAtomVisibility} onParticleAdded={true} />
                {authoring &&
                  <DeleteIcon className={deleteIconClass} style={{ width: 45, height: 50, opacity: deleteOpacity }} />
                }
                {!authoring &&
                  <div className={deleteIconClass}><div className="delete-icon-overlay"/></div>
                }
                </div>
              }
              <div className={heatBathStyle} />
            </div>
            {authoring && <div>
              <IconButton id="studentView" iconClassName="material-icons" className="student-button" onClick={this.studentView} tooltip="student view">school</IconButton>
              <Authoring {...this.state} onChange={this.handleAuthoringPropChange} />
              <IconButton key="modelSnapshot" iconClassName="material-icons" className="model-link-button" onClick={this.updateDiff} tooltip="update link">share</IconButton>
              <div className="model-link"><a href={this.getCurrentModelLink()} target="_blank" rel="noopener">Link for Current Model</a></div>
            </div>}
          </div>
          <SimulationControls {...this.state} onChange={this.handleSimulationChange} onToggleHeat={this.toggleHeat} onContainerLid={this.toggleContainerLid} onToggleRunState={this.toggleRunState} />
          <LogoMenu scale="logo-menu small" navPath="../index.html" />
          <Clock dark={authoring} />
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<Interactive/>, document.getElementById('app'));
