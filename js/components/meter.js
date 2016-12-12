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
    this.setState({ meterValue: value });
  }

  describeArc(cx, cy, radius, angle){
    // arc draws backwards, so start is the offset point, end is at 0%
    var start = this.getPoint(cx, cy, radius, angle);
    var end = this.getPoint(cx, cy, radius, 0);
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

  render() {
    const {meterValue} = this.state;
    const {cx, cy, r, showSlider} = this.props;

    let angle = 180 * meterValue;
    let meterLineLength = r - 10;
    return (
      <div className="meter">
        <svg>
          <path id="arc-bg" fill="none" stroke="#cccccc" strokeWidth="2" d={this.describeArc(cx, cy, r, 180)} />
          <path id="arc" fill="none" stroke="#446688" strokeWidth="2" d={this.describeArc(cx, cy, r, angle)}/>
          <path id="meterLine" fill="none" stroke="#664488" strokeWidth="1" d={this.drawMeterLine(cx, cy, meterLineLength, angle, 1)} />
          <circle id="meterLineBase" cx={cx} cy={cy} r="12" stroke="black" strokeWidth="1" fill="#664488" />
        </svg>
        <div className="slider">
          {showSlider && <Slider min={0} max={1} step={0.01} value={meterValue}
            sliderStyle={{ marginTop: 5, marginBottom: 5 }}
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
  currentValue: React.PropTypes.number
};

Meter.defaultProps = {
  cx: 150,
  cy: 150,
  r: 100,
  minValue: 0,
  maxValue: 100,
  currentValue: 30
};
