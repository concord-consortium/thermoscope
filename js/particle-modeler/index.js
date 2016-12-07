import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import Lab from 'react-lab';
import NewAtomBin from './new-atom-bin';
import interactive from './interactive.json';
import model from './model.json';

import '../../css/particle-modeler.less';

let api, lab;

export default class Interactive extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showNewAtom: true
    };
    this.handleModelLoad = this.handleModelLoad.bind(this);
    this.addNewDraggableAtom = this.addNewDraggableAtom.bind(this);
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
  }

  addNewDraggableAtom() {
    var added = api.addAtom({x: 0.37, y: 2.22, element: 2, draggable: 1, pinned: 1});
    if (!added) {
      setTimeout(this.addNewDraggableAtom, 2000);
    } else {
        this.setState({showNewAtom: true});
    }
  }

  render () {
    return (
      <div>
        <Lab ref={node => lab = node} model={model} interactive={interactive} height='380px'
              playing={true} onModelLoad={this.handleModelLoad} embeddableSrc='../lab/embeddable.html'/>
        <NewAtomBin showAtom={this.state.showNewAtom}/>
      </div>
    );
  }
}

ReactDOM.render(<Interactive/>, document.getElementById('app'));
