import '../../css/instructions.less';
import { importAll } from '../utils';

import React, { PureComponent } from 'react';

export default class Instructions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stepIdx: 0
    };
    this.images = importAll(require.context('../../css/instr', false, /\.(png|jpe?g|svg)$/));
    this.handleContinue = this.handleContinue.bind(this);
  }

  handleContinue() {
    const { stepIdx } = this.state;
    const { steps } = this.props;
    const newStepIdx = stepIdx + 1;
    if (newStepIdx < steps.length) {
      this.setState({ stepIdx: newStepIdx});
      setTimeout(this.handleContinue, 1000);
    } else {
      this.setState({ showContinueButton: true })
    }
  }

  render() {
    const { stepIdx, showContinueButton } = this.state;
    const { steps, visible, onClose } = this.props;
    if (!this.didRunAnimation && visible) {
      setTimeout(this.handleContinue, 1500);
      this.didRunAnimation = true;

    }
    return (
      <div className={`instructions ${visible ? '' : 'invisible'}`}>
        {
          steps.map((step, _stepIdx) => {
            const visible = stepIdx >= _stepIdx;
            return (
              <div
                key={_stepIdx}
                className={`step ${visible ? 'visible' : 'invisible'}`}
                style={{backgroundImage: `url(${this.images[step]})`}}
              />
            );
          })
        }
        {showContinueButton && <div className="close" onClick={onClose} />}
      </div>
    );
  }
}
