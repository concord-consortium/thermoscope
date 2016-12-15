import React, {PureComponent} from 'react';
import Slider from 'material-ui/Slider';

export default class Meter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      meterValue: this.scaleCurrentValue(props.currentValue),
      showSlider: false
    }
    this.scaleCurrentValue(props.currentValue);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  componentWillReceiveProps(prevProps) {
    if (this.props.currentValue != prevProps.currentValue) {
      this.setState({meterValue: this.scaleCurrentValue(this.props.currentValue) });
    }
  }

  scaleCurrentValue(absoluteValue) {
    const {minValue, maxValue} = this.props;
    let range = maxValue - minValue;
    let scaledValue = minValue != 0 ? absoluteValue - minValue : absoluteValue;
    return scaledValue / range;
  }

  handleSliderChange(event, value) {
    this.setMeterValue(value);
  }

  setMeterValue(val) {
    // sanity check, clamp the value between 0 and 1
    val = val < 0 ? 0 : val > 1 ? 1 : val;
    this.setState({ meterValue: val });
    if (this.props.onMeterChange) {
      this.props.onMeterChange(val);
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
    const {cx, cy, r, showSlider, segments } = this.props;
    let arcSegments = [];
    for (var i = 0; i < segments.length; i++) {
      let segmentId = "arc-s" + i;
      let angleStart = segments[i].end;
      let angleEnd = segments[i].start;
      arcSegments.push(<path id={segmentId} key={segmentId} fill="none" stroke={segments[i].color} strokeWidth="34" d={this.describeArc(cx, cy, 80, angleStart, angleEnd)} />);
    }
    return arcSegments;
  }

  startDragging(event) {
    if (this.props.draggable) {
      let targetRect = event.currentTarget.getBoundingClientRect();
      let centerX = (targetRect.width / 2) + targetRect.left;
      this.setState({ centerX: centerX, minX: centerX - this.props.r, maxX: centerX + this.props.r });
      let clampedX = this.checkPosition(event.clientX);
      if (clampedX) {
        this.updateMeterPosition(clampedX);
      }
    }
    event.preventDefault();
  }
  checkPosition(pos) {
    let {centerX, minX, maxX} = this.state;
    let r = this.props.r;
    let padding = 10;

    if (centerX && pos > (minX - padding) && pos < (maxX + padding)) {
      // clamp position for meter controls while allowing a slight padded tolerance on dragging
      let clampedPos = pos < minX ? minX : pos > maxX ? maxX : pos;
      return clampedPos;
    } else if (centerX) {
      // was dragging, but now out of bounds
      this.endDrag();
    }
    // not dragging
    return false;
  }

  updateMeterPosition(pos) {
    let minX = this.state.minX;
    let r = this.props.r;
    let val = (pos - minX) / (r * 2);
    this.setMeterValue(val);
  }

  onDrag(event) {
    if (this.props.draggable && this.state.centerX) {
      let clampedX = this.checkPosition(event.clientX);
      if (clampedX) {
        this.updateMeterPosition(clampedX);
      }
    }
  }
  endDrag() {
    this.setState({centerX: undefined, minX: undefined, maxX: undefined});
  }
  finishDragging(event) {
    this.endDrag();
    event.preventDefault();
  }

  render() {
    const {meterValue} = this.state;
    const {cx, cy, r, showSlider, segments, background, needleColor} = this.props;

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
      <path id="arc-bg" fill="none" stroke={background} strokeWidth="190" d={this.describeArc(cx, cy, 1, 180)} />
      : undefined;

    return (
      <div className="meter">
        <svg
          onTouchStart={this.startDragging.bind(this)}
          onMouseDown={this.startDragging.bind(this)}
          onTouchMove={this.onDrag.bind(this)}
          onMouseMove={this.onDrag.bind(this)}
          onMouseLeave={this.finishDragging.bind(this)}
          onTouchEnd={this.finishDragging.bind(this)}
          onMouseUp={this.finishDragging.bind(this)}>
          {backgroundArc}
          {arcSegments}
          <path id="arc-incomplete" fill="none" stroke="#cccccc" strokeWidth="4" d={this.describeArc(cx, cy, r, 180)} />
          <path id="arc" fill="none" stroke="#446688" strokeWidth="4" d={this.describeArc(cx, cy, r, angle)}/>
          <path id="meterLine" fill="none" stroke="#000" strokeWidth="3" d={this.drawMeterLine(cx, cy, meterLineLength, angle, 1)} />
          <path id="meterLine" fill="none" stroke={needleColor} strokeWidth="2" d={this.drawMeterLine(cx, cy, meterLineLength, angle, 1)} />
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
  minValue: 0,
  maxValue: 100,
  currentValue: 30,
  showSlider: false,
  segments: undefined,
  background: undefined,
  needleColor: "#ccc",
  draggable: true
};
