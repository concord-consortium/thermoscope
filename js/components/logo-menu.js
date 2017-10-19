import React, {PureComponent} from 'react';
import '../../css/app.less';

export default class LogoMenu extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { scale, showNav } = this.props;

    return (
      <div className={scale}>
        <a href="../"><div className="cc-logo"></div></a>
      </div>
    )
  };
}
