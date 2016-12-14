import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import Lab from 'react-lab';
import NewAtomBin from './new-atom-bin';
import Authoring from './authoring';
import models from './models/';
import { getStateFromHashWithDefaults, getDiffedHashParams, parseToPrimitive } from '../utils';

import '../../css/app.less';
import '../../css/particle-modeler.less';

let api, lab;

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
      }
    });

    this.addNewDraggableAtom(0);
    this.addNewDraggableAtom(1);
    this.addNewDraggableAtom(2);
    this.setModelProps();
  }

  addNewDraggableAtom(el=0) {
    let y = 2.22 - (el * 0.24),
        added = api.addAtom({x: 0.37, y: y, element: el, draggable: 1, pinned: 1});
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
    return (
      <div className={appClass}>
        <div className="lab-wrapper">
          <Lab ref={node => lab = node} model={this.state.model} interactive={this.state.interactive} height='380px'
              playing={true} onModelLoad={this.handleModelLoad} embeddableSrc='../lab/embeddable.html'/>
          { freezeButton }
        </div>
        <NewAtomBin showAtom0={this.state.showNewAtom0} showAtom1={this.state.showNewAtom1} showAtom2={this.state.showNewAtom2}/>
        { authoringPanel }
      </div>
    );
  }
}

ReactDOM.render(<Interactive/>, document.getElementById('app'));
