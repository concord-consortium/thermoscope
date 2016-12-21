import React, {PureComponent} from 'react';
import Slider from 'material-ui/Slider';

export default class Meter extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.startDragging = this.startDragging.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.finishDragging = this.finishDragging.bind(this);
  }

  scaleValue(val) {
    const {minValue, maxValue} = this.props;
    let range = maxValue - minValue;
    let scaledValue = minValue != 0 ? val - minValue : val;
    return scaledValue / range;
  }

  absoluteValue(val) {
    const {minValue, maxValue} = this.props;
    let range = maxValue - minValue;
    let absValue = Math.round(val * range);
    absValue = minValue != 0 ? absValue + minValue : absValue;
    return absValue;
  }

  handleSliderChange(event, value) {
    this.setMeterValue(value);
  }

  setMeterValue(val) {
    // sanity check, clamp the value between 0 and 1
    val = val < 0 ? 0 : val > 1 ? 1 : val;
    if (this.props.onMeterChange) {
      this.props.onMeterChange(this.absoluteValue(val));
    }
  }

  describeArc(cx, cy, radius, angleStart, angleEnd = 0){
    // arc draws backwards, so start is the offset point, end is at 0%
    var start = this.getPoint(cx, cy, radius, angleStart);
    var end = this.getPoint(cx, cy, radius, angleEnd);
    var d = [
          "M", start.x, start.y,
          "A", radius, radius, 0, 0, 0, end.x, end.y
      ].join(" ");
      return d;
  }

  getPoint(cx, cy, r, angle){
    var rad = (angle-180) * Math.PI / 180;
    var dx = cx + (r * Math.cos(rad));
    var dy = cy + (r * Math.sin(rad));
    var point = {x: dx, y: dy};
    return point;
  }

  drawMeterLine(cx, cy, length, angle, pointerWidth){
    var end = this.getPoint(cx, cy, length, angle);
    var d = [
      "M", cx, cy,
      "L", end.x, end.y,
      "Z"
    ].join(" ");
    return d;
  }

  generateSegments() {
    const {cx, cy, r, segments, arcWidth } = this.props;
    let arcSegments = [];
    let width = r / 6;

    for (var i = 0; i < segments.length; i++) {
      let segmentId = "arc-s" + i;
      let angleStart = segments[i].end;
      let angleEnd = segments[i].start;
      arcSegments.push(<path id={segmentId} key={segmentId} fill="none" stroke={segments[i].color} strokeWidth={width} d={this.describeArc(cx, cy, (r - (width/2) - arcWidth), angleStart, angleEnd)} />);
    }
    return arcSegments;
  }

  startDragging(event) {
    if (this.props.draggable) {
      let targetRect = this.meter.getBoundingClientRect(),
          centerX = (targetRect.width / 2) + targetRect.left,
          min = centerX - this.props.r,
          max = centerX + this.props.r,
          clampedX = this.clampPosition(event.clientX, min, max);
      this.updateMeterPosition(clampedX, min);
    }

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.finishDragging);

    event.preventDefault();
  }

  clampPosition(pos, min, max) {
    return pos < min ? min : pos > max ? max : pos;
  }

  updateMeterPosition(pos, min) {
    let r = this.props.r,
        val = (pos - min) / (r * 2);
    this.setMeterValue(val);
  }

  onDrag(event) {
    if (this.props.draggable) {
      let targetRect = this.meter.getBoundingClientRect(),
          centerX = (targetRect.width / 2) + targetRect.left,
          min = centerX - this.props.r,
          max = centerX + this.props.r,
          clampedX = this.clampPosition(event.clientX, min, max);
      this.updateMeterPosition(clampedX, min);
    }
  }

  finishDragging(event) {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.finishDragging)
    event.preventDefault();
  }

  render() {
    const {cx, cy, r, showSlider, segments, background, needleColor, arcWidth, needleWidth, currentValue} = this.props;

    let meterValue = this.scaleValue(currentValue);
    let angle = 180 * meterValue;
    let meterLineLength = r - 10;
    let sliderWidth = (r * 2) + "px";
    let sliderStyle = { width: sliderWidth, margin: 'auto'};
    let arcSegments = segments ?
      <g className="segments">
        {this.generateSegments()}
      </g>
      : undefined;
    let backgroundArc = background ?
      <path id="arc-bg" fill="none" stroke={background} strokeWidth={(2*r) - arcWidth} d={this.describeArc(cx, cy, 1, 180)} />
      : undefined;

    return (
      <div className="meter">
        <svg
          onTouchStart={this.startDragging}
          onMouseDown={this.startDragging}
          ref={(m) => { this.meter = m }}>
          {backgroundArc}
          {arcSegments}
          <path id="arc-incomplete" fill="none" stroke="#cccccc" strokeWidth={arcWidth} d={this.describeArc(cx, cy, r, 180)} />
          <path id="arc" fill="none" stroke="#446688" strokeWidth={arcWidth} d={this.describeArc(cx, cy, r, angle)}/>
          <path id="meterLine" fill="none" stroke="#000" strokeWidth={needleWidth} d={this.drawMeterLine(cx, cy, meterLineLength, angle, 1)} />
          <path id="meterLine" fill="none" stroke={needleColor} strokeWidth={needleWidth-1} d={this.drawMeterLine(cx, cy, meterLineLength, angle, 1)} />
          <circle id="meterLineBase" cx={cx} cy={cy} r="12" stroke="black" strokeWidth="1" fill={needleColor}  />
        </svg>
        <div className="slider">
          {showSlider && <Slider min={0} max={1} value={meterValue}
            style={sliderStyle}
            name="temperature"
            onChange={this.handleSliderChange} />}
        </div>
      </div>
    )
  }
}

Meter.PropTypes = {
  cx: React.PropTypes.object.number,
  cy: React.PropTypes.number,
  r: React.PropTypes.number,
  arcWidth: React.PropTypes.number,
  needleWidth: React.PropTypes.number,
  minValue: React.PropTypes.number,
  maxValue: React.PropTypes.number,
  currentValue: React.PropTypes.number,
  showSlider: React.PropTypes.bool,
  segments: React.PropTypes.array,
  background: React.PropTypes.string,
  needleColor: React.PropTypes.string,
  draggable: React.PropTypes.bool,
  onMeterChange: React.PropTypes.func
};

Meter.defaultProps = {
  cx: 150,
  cy: 150,
  r: 100,
  arcWidth: 4,
  needleWidth: 3,
  minValue: 0,
  maxValue: 100,
  currentValue: 30,
  showSlider: false,
  segments: undefined,
  background: undefined,
  needleColor: "#ccc",
  draggable: true
};
