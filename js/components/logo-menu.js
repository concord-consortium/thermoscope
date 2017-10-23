import React, {PureComponent} from 'react';
import '../../css/app.less';

export default class LogoMenu extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { scale, showNav, navPath } = this.props;
    let path = navPath ? navPath : '../index.html';

    return (
      <div className={scale}>
        <a href={path}><div className="cc-logo"></div></a>
      </div>
    )
  };
}
