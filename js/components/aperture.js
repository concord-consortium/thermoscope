import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';

var _size = 45;

export default class Aperture extends PureComponent{
  constructor(props) {
    super(props);
    this.getTransform = this.getTransform.bind(this);
  }

  getAngle(openAngle) {
    const { open, openAngleDelta } = this.props;
    let angle = open ? openAngle : openAngle + openAngleDelta;
    return angle;
  }

  getTransform(blade, openRotation) {
    return "rotate(" + (blade.a + openRotation) + " " + blade.x + "," + blade.y + ")";
  }

  render() {
    const { open, openAngleDelta, bladeColor, outerColor } = this.props;
    let center = _size + (_size/2);
    let r = _size;
    let rsin60 = r * Math.sqrt(3) / 2;
    let rcos60 = r * 0.5;

    let a = { x: center - rcos60, y: center + rsin60, a: 0 };
    let b = { x: center + rcos60, y: center + rsin60, a: -60 };
    let c = { x: center + r, y: center, a: -120 };
    let d = { x: center + rcos60, y: center - rsin60, a: 180 };
    let e = { x: center - rcos60, y: center - rsin60, a: 120 };
    let f = { x: center - r, y: center, a: 60 };

    let viewSize = "0 0 " + (_size * 1.9) + " " + (_size * 1.9);
    let bladePosition = "translate(" + (_size * -0.55) + " " + (_size * -0.55) + ")";
    return (
      <div id="aperture-container">
        <svg id="shutter" viewBox={viewSize} width="400" height="400">
          <mask id="bladesMask" >
            <circle cx={center} cy={center} r={_size-3}/>
          </mask>
            <Motion style={{ x: spring(open ? 0: openAngleDelta , {stiffness: 120, damping: 26})}}>
            {({ x }) =>
              <g id="blades" transform={bladePosition}>
                <rect id="a" x={a.x} y={a.y} height={r} width={r} stroke="none" fill={bladeColor} transform={this.getTransform(a, x)} />
                <rect id="b" x={b.x} y={b.y} height={r} width={r} stroke="none" fill={bladeColor} transform={this.getTransform(b, x)} />
                <rect id="c" x={c.x} y={c.y} height={r} width={r} stroke="none" fill={bladeColor} transform={this.getTransform(c, x)} />
                <rect id="d" x={d.x} y={d.y} height={r} width={r} stroke="none" fill={bladeColor} transform={this.getTransform(d, x)} />
                <rect id="e" x={e.x} y={e.y} height={r} width={r} stroke="none" fill={bladeColor} transform={this.getTransform(e, x)} />
                <rect id="f" x={f.x} y={f.y} height={r} width={r} stroke="none" fill={bladeColor} transform={this.getTransform(f, x)} />
              </g>
            }
            </Motion>
          <circle id="blind" cx={center} cy={center} r={_size-6} stroke={outerColor} strokeWidth="1" fill="none" opacity="0.7" transform={bladePosition}/>
        </svg>
      </div>
    )
  }
}
Aperture.defaultProps = {
  openAngleDelta: -60,
  open: true,
  bladeColor: "black",
  outerColor: "black"
}
