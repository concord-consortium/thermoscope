import React from 'react';
import ReactDOM from 'react-dom';
import Lab from 'react-lab';
import interactive from './interactive.json';
import model from './model.json';

class Interactive extends React.Component {
  render() {
    return (
      <div>
        <Lab model={model} interactive={interactive} height='380px' playing={true} embeddableSrc='../lab/embeddable.html'/>
      </div>
    );
  }
}

ReactDOM.render(<Interactive/>, document.getElementById('app'));
