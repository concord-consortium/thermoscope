import React, {PureComponent} from 'react';
import Slider from 'material-ui/Slider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import LabModel from '../components/lab-model';
import Meter from '../components/meter';
import models, { MIN_TEMP, MAX_TEMP } from '../models';
import { getURLParam } from '../utils';
import Aperture from '../components/aperture';
import Dial from './dial';
import StyledButton from './styled-button';

import '../../css/thermoscope.less';
import '../../css/aperture.less';

const SHOW_MATERIAL_CONTROLS = getURLParam('controls');
const MODEL_WIDTH = 400;
const MODEL_HEIGHT = 400;
const MATERIAL_TYPES = ['solid', 'liquid', 'gas'];

export default class Thermoscope extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      temperature: this.props.temperature ? this.props.temperature : 20,
      liveData: false,
      materialType: this.props.material ? this.props.material : 'solid',
      materialIdx: this.props.materialIndex ? this.props.materialIndex : this.props.probeIndex ? this.props.probeIndex : 0,
      label: this.props.label,
      paused: false,
      hidden: this.props.hidden
    };
    this.handleTemperatureChange = this.handleTemperatureChange.bind(this);
    this.handleMaterialTypeChange = this.handleMaterialTypeChange.bind(this);
    this.handleMaterialIdxChange = this.handleMaterialIdxChange.bind(this);
    this.props.sensor.on('statusReceived', this.liveDataHandler.bind(this));
    this.props.sensor.on('connectionLost', this.connectionLostHandler.bind(this));
    this.togglePause = this.togglePause.bind(this);
    this.toggleHidden = this.toggleHidden.bind(this);
  }

  componentWillUnmount() {
    this.props.sensor.removeAllListeners('statusReceived');
  }

  handleTemperatureChange(value, liveData) {
    const { onTemperatureChage, frozen } = this.props;
    if (frozen) return;
    this.setState({temperature: value, liveData: !!liveData});
    if (onTemperatureChage) {
      onTemperatureChage(value);
    }
  }

  handleMaterialTypeChange(event, value) {
    this.setState({materialType: value, materialIdx: 0});
  }

  handleMaterialIdxChange(event, value) {
    this.setState({materialIdx: value});
  }

  liveDataHandler() {
    if (this.props.sensor && this.props.sensor.liveSensors) {
      let newData = this.props.sensor.liveSensors[this.props.probeIndex].liveValue;
      if (!isNaN(newData) && isFinite(newData)) {
        let roundedTemperatureData = Math.round(newData);
        this.handleTemperatureChange(roundedTemperatureData, true);
      }
    }
  }

  connectionLostHandler() {
    this.setState({liveData: false});
  }

  togglePause() {
    const { paused } = this.state;
    this.setState({ paused: !paused });
  }
  toggleHidden() {
    const { hidden } = this.state;
    this.setState({ hidden: !hidden });
  }

  renderIcon(iconName) {
    return <div className={"material-icon " + iconName.toLowerCase().replace(/ /g,"-") + "-icon"}/>
  }

  modelToClassName(model) {
    return model.name.toLowerCase().split(" ")[0];
  }

  getButtonBackground(buttonType, label, model, state) {
    const stateInfix = state ? `-${state}` : "";
    if (label.indexOf("experiment") > -1) {
      return `one-view-${buttonType}-button-a${stateInfix}.svg`;
    } else if (label.indexOf("mixing") > -1) {
      return (label.indexOf("center") > -1)
        ? `mixed-view-${buttonType}-button${stateInfix}.svg`
        : `mixing-view-${buttonType}-button-a${stateInfix}.svg`;
    }
    const name = this.modelToClassName(model);
    const backgroundLabel = label.toLowerCase() === "center" ? "a" : label.toLowerCase();
    return `${buttonType}-button-${backgroundLabel}${stateInfix}-${name}.svg`;
  }

  render() {
    const { temperature, materialType, materialIdx, liveData, label, paused, hidden } = this.state;
    const { embeddableSrc, showMaterialControls, showHideButtons, showPlayButtons, showCelsius, className, aPegged, bPegged, forceCover, frozen } = this.props;

    const model = models[materialType][materialIdx];
    let material = MATERIAL_TYPES.indexOf(materialType > -1) ? materialType : 'solid';

    let showControlsParam = SHOW_MATERIAL_CONTROLS != null ? SHOW_MATERIAL_CONTROLS.toLowerCase() === "true" : false;
    // props can turn on or off the controls from a parent container
    let showControls = showMaterialControls != null ? showMaterialControls : false;

    // simulation pause
    const zeroTempScale = function (temp) { return 0; };
    let pauseButtonText = paused ? "Resume" : "Pause";
    let toggleApertureText = hidden ? "Activate" : "Hide";
    let showClass = hidden ? "hidden" : "shown";
    let tempScale = paused ? zeroTempScale : model.tempScale;

    let isMixing = isFinite(aPegged) && isFinite(bPegged);
    // if mixing without live sensors, simulate a median temperature
    let calculatedTemperature = isMixing && !liveData ? Math.round((aPegged + bPegged) / 2) : temperature;
    // Need to pass both values to Lab to simulate the mixing process
    let mixingValues = isMixing ? { aTemp: aPegged, bTemp: bPegged } : undefined;
    // a url parameter will override the props setting
    if (SHOW_MATERIAL_CONTROLS != null) showControls = showControlsParam;

    return (

      <div className={`thermoscope ${className}`}>
        <div className={`label ${label.toLowerCase()} ${this.modelToClassName(model)}`} />
        {!hidden && [
            !frozen &&
              <LabModel temperature={calculatedTemperature}
                model={model.json}
                tempScale={tempScale}
                timeStepScale={model.timeStepScale}
                gravityScale={model.gravityScale}
                coulombForcesSettings={model.coulombForcesSettings}
                width={MODEL_WIDTH} height={MODEL_HEIGHT}
                embeddableSrc={embeddableSrc}
                mixing={mixingValues}
                key="lab"
            />,
            <div className={`zoom-fade ${label.toLowerCase()} ${this.modelToClassName(model)}`} key="fade"/>,
            <div className={`zoom-circle ${label.toLowerCase()} ${this.modelToClassName(model)}`} key="circle"/>,
            <Dial
              className={`${className ? className : ''} ${label.toLowerCase()} ${this.modelToClassName(model)}`}
              temperature={calculatedTemperature}
              showCelsius={showCelsius}
              onUpdateTemp={this.handleTemperatureChange}
              minTemp={-6}
              maxTemp={60}
              draggable={!liveData && !forceCover}
              key="dial1"
              peggedTemp={aPegged}
              frozen={frozen}
            />,
            (isFinite(bPegged) &&
              <Dial
                className={`${className} ${label.toLowerCase()} ${this.modelToClassName(model)} dial2`}
                temperature={calculatedTemperature}
                showCelsius={showCelsius}
                onUpdateTemp={this.handleTemperatureChange}
                minTemp={-6}
                maxTemp={60}
                draggable={false}
                key="dial2"
                peggedTemp={bPegged}
              />
            )
          ]
        }
        {showHideButtons &&
          <StyledButton
            className={`show-hide ${label.toLowerCase()}`}
            onClick={this.toggleHidden}
            background={this.getButtonBackground("showhide", label, model, hidden ? "press1" : undefined)}
            hoveredBackground={this.getButtonBackground("showhide", label, model, hidden ? "hover2": "hover1")}
            activeBackground={this.getButtonBackground("showhide", label, model, hidden ? "press2" : "hover1")}
          />
        }
        {showPlayButtons &&
          <StyledButton
            className={`play-pause ${label.toLowerCase()}`}
            onClick={this.togglePause}
            background={this.getButtonBackground("playpause", label, model, paused ? "press1" : undefined)}
            hoveredBackground={this.getButtonBackground("playpause", label, model, paused ? "hover2": "hover1")}
            activeBackground={this.getButtonBackground("playpause", label, model, paused ? "press2" : "hover1")}
          />
        }
        {/* <div className={`show-hide ${showClass} ${label.toLowerCase()} ${this.modelToClassName(model)}`} onClick={this.toggleHidden} /> */}
        <div className={`thermoscope ${label.toLowerCase()}`} />
        {/* {showMeter && <Meter minValue={MIN_TEMP} maxValue={MAX_TEMP} currentValue={temperature} background="#444" segments={meterSegments} minClamp={minClamp} maxClamp={maxClamp} onMeterChange={this.onMeterChange} />} */}
        <div>
          {/* {!paused && !hidden &&
            <div className="controls-row top">
              <div className="temperatureDisplay">Temperature {temperature}°C</div>
              <div className="slider">
                {!liveData && !showMeter && <Slider min={MIN_TEMP} max={MAX_TEMP} step={1} value={temperature}
                  sliderStyle={{ marginTop: 5, marginBottom: 5 }}
                  name="temperature"
                  onChange={this.handleTempSliderChange} />}
              </div>
            </div>
          }
          {paused || hidden &&
            <div className="controls-row">
              <div className="slider">
                &nbsp;
              </div>
            </div>
          } */}
          <div>
            {/* <div className="controls-row">
              <div className="aperture">
                <RaisedButton id="hidden" onClick={this.toggleAperture}>{toggleApertureText}</RaisedButton>
              </div>
              {showControls &&
                <div className="pause">
                  <RaisedButton id="pause" onClick={this.togglePause}>{pauseButtonText}</RaisedButton>
                </div>
              }
            </div> */}

            {showControls &&
              <div className="controls-row">
                <div className="material-type-select">
                  <RadioButtonGroup name="material-type" valueSelected={material} onChange={this.handleMaterialTypeChange}>
                    <RadioButton value="solid" label="Solid" icon={this.renderIcon("solid")}/>
                    <RadioButton value="liquid" label="Liquid"  icon={this.renderIcon("liquid")}/>
                    <RadioButton value="gas" label="Gas"  icon={this.renderIcon("gas")}/>
                    <RadioButton value="uniform" label="Experiments" />
                  </RadioButtonGroup>
                </div>
                <div className="material-select">
                  {this.renderIcon(model.name)}
                  <SelectField floatingLabelText="Material" value={materialIdx} onChange={this.handleMaterialIdxChange}>
                    {models[material].map((model, idx) =>
                      <MenuItem key={idx} value={idx} primaryText={model.name} leftIcon={this.renderIcon(model.name)}/>
                    )}
                  </SelectField>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

Thermoscope.defaultProps = {
  showMaterialControls: null
}
