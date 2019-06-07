import React, { PureComponent } from 'react';
import { ThermoscopeMode } from '../thermoscope';

import '../../css/experiment-selector.less';

export default class ExperimentSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      material: 'none'
    }
    this.handleContinue = this.handleContinue.bind(this);
  }

  setMaterial(material, type, index) {
    return () => this.setState({material, type, index});
  }

  getClassName(material) {
    return `${material} icon ${material === this.state.material ? 'active' : ''}`;
  }

  handleContinue() {
    const { onSelect } = this.props;
    const { type, index } = this.state;
    onSelect({ A: type, materialA: index, container: 'experiment'}, ThermoscopeMode.SingleExperiment);
  }

  render() {
    return (
      <div className="experiment-selector">
        <div className="background" />
        <div className={`selected-exp ${this.state.material}`} />
        <div className="solids">
          <div className="header" />
          <div className={this.getClassName('wood')} onClick={this.setMaterial('wood', 'solid', 0)} />
          <div className={this.getClassName('stone')} onClick={this.setMaterial('stone', 'solid', 1)} />
          <div className={this.getClassName('coconut')} onClick={this.setMaterial('coconut', 'uniform', 1)} />
        </div>
        <div className="liquids">
          <div className="header" />
          <div className={this.getClassName('water')} onClick={this.setMaterial('water', 'liquid', 2)} />
          <div className={this.getClassName('oil')} onClick={this.setMaterial('oil', 'liquid', 0)} />
          <div className={this.getClassName('soap')} onClick={this.setMaterial('soap', 'liquid', 1)} />
        </div>
        <div className="gas">
          <div className="header" />
          <div className={this.getClassName('air')} onClick={this.setMaterial('air', 'gas', 0)} />
        </div>
        <div className="go-on" onClick={this.handleContinue} />
      </div>
    );
  }
}