import React, { PureComponent } from 'react';
import Thermoscope from './thermoscope';
import bleSensor from '../components/ble-sensor.js';

const sensor = bleSensor;

import '../../css/mixing-view.less';

const MixingMode = { TwoThermoscope: 0, StartMixTransition: 1, EndMixTransition: 2, OneThermoscope: 3  }

export default class MixingView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mode: MixingMode.TwoThermoscope,
      aTemp: 20,
      bTemp: 20
    }
    this.handleContinue = this.handleContinue.bind(this);
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
      }
    }
  }

  renderTwoThermoscopes(mode) {
    const { showHideButtons, showPlayButtons, showCelsius } = this.props;
    const active = mode === MixingMode.TwoThermoscope;
    return (
      <div className={active ? '' : 'invisible'}>
        <div className="thermoscope-container a mixing">
          <Thermoscope
            className="mixing"
            sensor={sensor}
            material={'liquid'}
            materialIndex={2}
            embeddableSrc='./lab/embeddable.html'
            label={'a mixing'}
            probeIndex={0}
            hidden={false}
            showHideButtons={showHideButtons}
            showPlayButtons={showPlayButtons}
            showCelsius={showCelsius}
            onTemperatureChage={this.handleTemperatureChange('a')}
            forceCover={true}
          />
        </div>
        <div className="thermoscope-container b mixing">
          <Thermoscope
            className="mixing"
            sensor={sensor}
            material={'liquid'}
            materialIndex={2}
            embeddableSrc='./lab/embeddable.html'
            label={'b mixing'}
            probeIndex={1}
            hidden={false}
            showHideButtons={showHideButtons}
            showPlayButtons={showPlayButtons}
            showCelsius={showCelsius}
            onTemperatureChage={this.handleTemperatureChange('b')}
            forceCover={true}
          />
        </div>
        <div className="continue" onClick={this.handleContinue(MixingMode.StartMixTransition)} />
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

  render() {
    const { mode } = this.state;
    return (
      <div>
        { this.renderOneThermoscope(mode) }
        { this.renderTwoThermoscopes(mode) }
        { this.renderMixingTransition(mode) }
      </div>
    )
  }
}