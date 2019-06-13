import React, { PureComponent } from 'react';
import Thermoscope from './thermoscope';
import Instructions from './instructions';
import bleSensor from '../components/ble-sensor.js';

const sensor = bleSensor;

import '../../css/mixing-view.less';

const MixingMode = { Blank: 0, Intro: 1, TwoThermoscope: 2, RemovalInstructions: 3, Frozen: 4, MixInstructions: 5, StartMixTransition: 6, EndMixTransition: 7, OneThermoscope: 8 }

export default class MixingView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mode: MixingMode.Blank,
      aTemp: 20,
      bTemp: 20
    }
    this.handleContinue = this.handleContinue.bind(this);
  }

  componentDidMount() {
    setTimeout(this.handleContinue(MixingMode.Intro), 100);
  }

  setMaterial(material, type, index) {
    return () => this.setState({material, type, index});
  }

  getClassName(material) {
    return `${material} icon ${material === this.state.material ? 'active' : ''}`;
  }

  handleTemperatureChange(side) {
    return (temp) => {
      if (this.state.mode === MixingMode.TwoThermoscope) {
        if (side === 'a') {
          this.setState({ aTemp: temp });
        } else {
          this.setState({ bTemp: temp });
        }
      }
    }
  }

  handleContinue(mode) {
    return () => {
      this.setState({ mode });
      if (mode === MixingMode.StartMixTransition) {
        setTimeout(this.handleContinue(MixingMode.EndMixTransition), 1000);
      } else if (mode === MixingMode.EndMixTransition) {
        setTimeout(this.handleContinue(MixingMode.OneThermoscope), 1000);
      } else if (mode === MixingMode.Frozen) {
        setTimeout(this.handleContinue(MixingMode.MixInstructions), 2000)
      }
    }
  }

  renderTwoThermoscopes(mode) {
    const { showHideButtons, showPlayButtons, showCelsius } = this.props;
    const active = mode === MixingMode.TwoThermoscope 
      || mode === MixingMode.RemovalInstructions 
      || mode === MixingMode.Frozen
      || mode === MixingMode.MixInstructions;
    const frozen = mode >= MixingMode.Frozen;
    return (
      <div className={active ? 'visible' : 'invisible'}>
        <div className="thermoscope-container a mixing">
          <Thermoscope
            className="mixing"
            sensor={sensor}
            material={'liquid'}
            materialIndex={4}
            embeddableSrc='./lab/embeddable.html'
            label={'a mixing'}
            probeIndex={0}
            hidden={false}
            showHideButtons={showHideButtons}
            showPlayButtons={showPlayButtons}
            showCelsius={showCelsius}
            onTemperatureChage={this.handleTemperatureChange('a')}
            forceCover={true}
            frozen={frozen}
          />
        </div>
        <div className="thermoscope-container b mixing">
          <Thermoscope
            className="mixing"
            sensor={sensor}
            material={'liquid'}
            materialIndex={5}
            embeddableSrc='./lab/embeddable.html'
            label={'b mixing'}
            probeIndex={1}
            hidden={false}
            showHideButtons={showHideButtons}
            showPlayButtons={showPlayButtons}
            showCelsius={showCelsius}
            onTemperatureChage={this.handleTemperatureChange('b')}
            forceCover={true}
            frozen={frozen}
          />
        </div>
        { !frozen && <div className="continue" onClick={this.handleContinue(MixingMode.RemovalInstructions)} />}
      </div>
    );
  }

  renderMixingTransition(mode) {
    const active = mode === MixingMode.StartMixTransition || mode === MixingMode.EndMixTransition;
    const end = mode >= MixingMode.EndMixTransition;
    return (
      <div className={`transition ${active ? '' : 'invisible'}`}>
        <div className={`thermoscope-a ${end ? 'end' : 'start'}`} />
        <div className={`thermoscope-b ${end ? 'end' : 'start'}`} />
      </div>
    );
  }

  renderOneThermoscope(mode) {
    const { showHideButtons, showPlayButtons, showCelsius } = this.props;
    const { aTemp, bTemp } = this.state;
    const active = mode === MixingMode.OneThermoscope;
    return (
      <div className={active ? 'visible' : 'invisible'}>
        <div className="thermoscope-container center mixing">
          <Thermoscope
            className="mixing"
            sensor={sensor}
            material={'liquid'}
            materialIndex={3}
            embeddableSrc='./lab/embeddable.html'
            label={'center mixing'}
            probeIndex={0}
            hidden={false}
            showHideButtons={showHideButtons}
            showPlayButtons={showPlayButtons}
            showCelsius={showCelsius}
            aPegged={aTemp}
            bPegged={bTemp}
            forceCover={true}
          />
        </div>
        <div className="thermoscope-b-alt" />
      </div>
    );
  }

  renderInstructions(mode) {
    return (
      <div>
        <Instructions
          steps={['mixing-view-step1a.svg', 'mixing-view-step1b.svg']}
          visible={mode === MixingMode.Intro}
          onClose={this.handleContinue(MixingMode.TwoThermoscope)} />
        <Instructions
          steps={['mixing-view-step1b.svg', 'mixing-view-step1a.svg', 'mixing-view-step2c.svg', 'mixing-view-step2d.svg', 'mixing-view-step2e.svg']}
          visible={mode === MixingMode.RemovalInstructions}
          onClose={this.handleContinue(MixingMode.Frozen)} />
        <Instructions
          steps={['mixing-view-step2e.svg', 'mixing-view-step3b.svg']}
          visible={mode === MixingMode.MixInstructions}
          onClose={this.handleContinue(MixingMode.StartMixTransition)} />
      </div>
    );
  } 

  render() {
    const { mode } = this.state;
    return (
      <div>
        { this.renderOneThermoscope(mode) }
        { this.renderTwoThermoscopes(mode) }
        { this.renderMixingTransition(mode) }
        { this.renderInstructions(mode) }
      </div>
    )
  }
}