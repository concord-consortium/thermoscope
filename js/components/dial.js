import React, { PureComponent } from 'react';

import '../../css/dial.less';

const POINTER_OFFSET_LEFT = 19;
const POINTER_OFFSET_TOP = 91;
const POINTER_ORIGIN_OFFSET_LEFT = 98;
const POINTER_ORIGIN_OFFSET_TOP = 26;

export default class Dial extends PureComponent {
  constructor(props) {
    super(props);
    this.startDragging = this.startDragging.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.finishDragging = this.finishDragging.bind(this);
  }

  startDragging(event) {
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.finishDragging);
    document.addEventListener('touchmove', this.onDrag);
    document.addEventListener('touchend', this.finishDragging);

    event.preventDefault();
  }

  // Returns the value v that is p% between min and max
  numberBetween(p, min, max) {
    return (max - min) * p + min;
  }

  // Returns the percent p that x is between min and max
  percentBetween(x, min, max) {
    return (x - min) /  (max - min);
  }

  onDrag(event) {
    const { draggable, minTemp, maxTemp, onUpdateTemp } = this.props;
    if (draggable) {
      const yPos = event.clientY ? -event.clientY : -event.touches[0].clientY;
      const xPos = event.clientX ? event.clientX : event.touches[0].clientX;

      // Since smaller y-values are above larger y-values, we must multiply the y-values by -1 for atan to give expected results
      const pointerTransformOriginY = -1 * (this.gauge.offsetTop  + POINTER_OFFSET_TOP + POINTER_ORIGIN_OFFSET_TOP);
      const pointerTransformOriginX = this.gauge.offsetLeft + POINTER_OFFSET_LEFT + POINTER_ORIGIN_OFFSET_LEFT;

      const angle = Math.atan2(yPos - pointerTransformOriginY, xPos - pointerTransformOriginX);
      const clampAngle = angle > 0
        ? angle
        : angle < -Math.PI / 2
          ? Math.PI
          : 0;

      // The angle is calculated off the positive x-axis, but since the min value points left,
      // we want the angle calculated off the negative x-axis instead
      const reverseAngle = Math.PI - clampAngle;
      const anglePercent = reverseAngle / Math.PI;

      onUpdateTemp(this.numberBetween(anglePercent, minTemp, maxTemp));
    }
  }

  finishDragging(event) {
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.finishDragging);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('touchend', this.finishDragging);

    event.preventDefault();
  }

  getTemperatureDisplay() {
    const { temperature, showCelsius } = this.props;
    const convertedTemp = showCelsius ? temperature : temperature * (9/5) + 32;
    const label = showCelsius ? "C" : "F";
    return `${Math.round(convertedTemp)} °${label}`;
  }

  getTransformForRotation(rotation) {
    return `rotate(${rotation}rad)`;
  }

  render() {
    const { className, minTemp, maxTemp, temperature, draggable, peggedTemp, frozen } = this.props;
    const tempPercent = this.percentBetween(temperature, minTemp, maxTemp);
    const rotation = this.getTransformForRotation(tempPercent * Math.PI);
    const peggedTempPercent = this.percentBetween(peggedTemp, minTemp, maxTemp);
    const peggedTempRotation = this.getTransformForRotation(peggedTempPercent * Math.PI);
    return (
      <div className={`temp-gauge ${className ? className : ''}`} ref={g => this.gauge = g}>
        <div 
          className={frozen ? "pegged-pointer" : "pointer"}
          onMouseDown={this.startDragging}
          onTouchStart={this.startDragging}
          style={{transform: rotation}} />
        {isFinite(peggedTemp) && 
          <div 
            className="pegged-pointer"
            style={{transform: peggedTempRotation}} />
        }
        <div className={`cover ${className} ${draggable ? "inactive" : "active"}`} />
        <div className="readout"> {this.getTemperatureDisplay()} </div>
      </div>
    );
  }
}
