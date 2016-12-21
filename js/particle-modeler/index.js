import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import Lab from 'react-lab';
import NewAtomBin from './new-atom-bin';
import Authoring from './authoring';
import models from './models/';
import { getStateFromHashWithDefaults, getDiffedHashParams, parseToPrimitive } from '../utils';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import injectTapEventPlugin from 'react-tap-event-plugin';

import '../../css/app.less';
import '../../css/particle-modeler.less';

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

// Set of authorable properties which can be overwritten by the url hash.
let authoredDefaults = {
  authoring: false,
  temperatureControl: {
    label: "Heatbath",
    value: false
  },
  targetTemperature: {
    label: "Heatbath temperature",
    value: 0,
    min: 0,
    max: 1000
  },
  gravitationalField: {
    label: "Gravity",
    value: 0,
    min: 0,
    max: 1e-5
  },
  timeStep: {
    label: "Time step",
    value: 1,
    min: 0,
    max: 5
  },
  viscosity: {
    label: "Viscosity",
    value: 1,
    min: 0,
    max: 10
  },
  showFreezeButton: {
    label: "Show Freeze Button",
    value: false
  },
  startWithAtoms: {
    label: "Start With Existing Atoms",
    value: false
  }
};

export default class Interactive extends PureComponent {

  constructor(props) {
    super(props);

    let hashParams = window.location.hash.substring(1),
        authoredState = getStateFromHashWithDefaults(hashParams, authoredDefaults),
        model = authoredState.startWithAtoms.value ? models.baseModel : models.emptyModel;

    this.state = {
      interactive: models.interactive,
      model: model,
      showNewAtom0: true,
      showNewAtom1: true,
      showNewAtom2: true,
      deleteHover: false,
      ...authoredState
    };

    this.handleModelLoad = this.handleModelLoad.bind(this);
    this.addNewDraggableAtom = this.addNewDraggableAtom.bind(this);
    this.handleAuthoringPropChange = this.handleAuthoringPropChange.bind(this);
    this.freeze = this.freeze.bind(this);
  }

  setModelProps(prevState = {}) {
    let newModelProperties = {}
    for (let prop in this.state.model) {
      if (this.state[prop] !== "" && this.state[prop] !== prevState[prop]) {
        newModelProperties[prop] = parseToPrimitive(this.state[prop]);
      }
    }
    api.set(newModelProperties);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.startWithAtoms.value !== nextState.startWithAtoms.value) {
       let model = nextState.startWithAtoms.value ? models.baseModel : models.emptyModel;
       this.setState({model: model});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let hash = getDiffedHashParams(this.state, authoredDefaults);
    window.location.hash = hash;

    this.setModelProps(prevState);
  }

  handleModelLoad() {
    api = lab.scriptingAPI;
    let _this = this;
    api.onDrag('atom', function(x, y, d, i) {
      if (d.pinned === 1) {
        let el = d.element,
            newState = {};
        api.setAtomProperties(i, {pinned: 0});
        newState["showNewAtom"+el] = false;
        _this.setState(newState);
        _this.addNewDraggableAtom(el);
      } else {
        if (d.x > delIcon.x && d.x < delIcon.x+delIcon.width && d.y > delIcon.y && d.y < delIcon.y+delIcon.height) {
          // mark atoms for deletion
          if (!d.marked) {
            _this.setState({deleteHover: true});
            api.setAtomProperties(i, {marked: 1});
          }
        } else if (d.marked) {
            _this.setState({deleteHover: false});
          api.setAtomProperties(i, {marked: 0});
        }
      }
    });

    let deleteMarkedAtoms = function() {
      let atomsToDelete = [];
      for (let i=0, ii=api.getNumberOfAtoms(); i<ii; i++) {
        if (api.getAtomProperties(i).marked)
          atomsToDelete.push(i);
      }
      for (let i=atomsToDelete.length-1; i>-1; i--) {
        api.removeAtom(atomsToDelete[i]);
      }

      _this.setState({deleteHover: false});
    }

    lab.iframe.contentDocument.body.onmouseup = deleteMarkedAtoms;

    this.addNewDraggableAtom(0);
    this.addNewDraggableAtom(1);
    this.addNewDraggableAtom(2);
    this.setModelProps();
  }

  addNewDraggableAtom(el=0) {
    let y = atomBox.y - (el * atomBox.spacing),
        added = api.addAtom({x: atomBox.x, y: y, element: el, draggable: 1, pinned: 1});
    if (!added) {
      setTimeout(() => this.addNewDraggableAtom(el), 2000);
    } else {
      let newState = {};
      newState["showNewAtom"+el] = true;
      this.setState(newState);
    }
  }

  freeze() {
    let oldTemp = this.state.targetTemperature.value,
        oldControl = this.state.temperatureControl.value;
    api.set({temperatureControl: true});
    api.set({targetTemperature: 0});
    setTimeout(function() {
      api.set({temperatureControl: oldControl});
      api.set({targetTemperature: oldTemp});
    }, 500)
  }

  handleAuthoringPropChange(prop, value) {
    let newState = {};
    newState[prop] = {...this.state[prop]};
    newState[prop].value = parseToPrimitive(value);
    this.setState(newState);
  }

  render () {
    let appClass = "app", authoringPanel = null, freezeButton = null;
    if (this.state.authoring) {
      appClass += " authoring";
      authoringPanel = <Authoring {...this.state} onChange={this.handleAuthoringPropChange} />
    }

    if (this.state.showFreezeButton.value === true) {
      freezeButton = <button onClick={this.freeze}>Freeze</button>
    }
    let deleteOpacity = this.state.deleteHover ? 0.3 : 0.7;

    return (
      <MuiThemeProvider>
        <div className={appClass}>
          <div className="lab-wrapper">
            <Lab ref={node => lab = node} model={this.state.model} interactive={this.state.interactive} height='380px'
                playing={true} onModelLoad={this.handleModelLoad} embeddableSrc='../lab/embeddable.html'/>
            <div className="lab-ui">
              <NewAtomBin showAtom0={this.state.showNewAtom0} showAtom1={this.state.showNewAtom1} showAtom2={this.state.showNewAtom2}/>
              { freezeButton }
              <DeleteIcon className="delete-icon" style={{width: 45, height: 50, opacity: deleteOpacity}}/>
            </div>
          </div>
          { authoringPanel }
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<Interactive/>, document.getElementById('app'));
