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
  }
};

export default class Interactive extends PureComponent {

  constructor(props) {
    super(props);

    let hashParams = window.location.hash.substring(1),
        authoredState = getStateFromHashWithDefaults(hashParams, authoredDefaults);

    this.state = {
      interactive: models.interactive,
      model: models.baseModel,
      showNewAtom: true,
      ...authoredState
    };

    this.handleModelLoad = this.handleModelLoad.bind(this);
    this.addNewDraggableAtom = this.addNewDraggableAtom.bind(this);
    this.handleAuthoringPropChange = this.handleAuthoringPropChange.bind(this);
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
        api.setAtomProperties(i, {pinned: 0});
        _this.setState({showNewAtom: false});
        _this.addNewDraggableAtom();
      }
    });

    this.addNewDraggableAtom();
    this.setModelProps();
  }

  addNewDraggableAtom() {
    var added = api.addAtom({x: 0.37, y: 2.22, element: 2, draggable: 1, pinned: 1});
    if (!added) {
      setTimeout(this.addNewDraggableAtom, 2000);
    } else {
        this.setState({showNewAtom: true});
    }
  }

  handleAuthoringPropChange(prop, value) {
    let newState = {};
    newState[prop] = {...this.state[prop]};
    newState[prop].value = parseToPrimitive(value);
    this.setState(newState);
  }

  render () {
    let appClass = "app", authoringPanel = null;
    if (this.state.authoring) {
      appClass += " authoring";
      authoringPanel = <Authoring {...this.state} onChange={this.handleAuthoringPropChange} />
    }
    return (
      <div className={appClass}>
        <div className="lab-wrapper">
          <Lab ref={node => lab = node} model={this.state.model} interactive={this.state.interactive} height='380px'
              playing={true} onModelLoad={this.handleModelLoad} embeddableSrc='../lab/embeddable.html'/>
        </div>
        <NewAtomBin showAtom={this.state.showNewAtom}/>
        { authoringPanel }
      </div>
    );
  }
}

ReactDOM.render(<Interactive/>, document.getElementById('app'));
