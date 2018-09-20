import React, {PureComponent} from 'react';
import '../../css/app.less';

export default class LogoMenu extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { scale } = this.props;

    return (
      <div className={scale}>
        <div className="cc-logo"></div>
      </div>
    )
  };
}
