import React, {PureComponent} from 'react';
import '../../css/app.less';

export default class LogoMenu extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { scale, enableNav, navPath } = this.props;
    let path = navPath ? navPath : '../index.html';
    let logo = enableNav ? <a href={path}><div className="cc-logo"></div></a> : <div className="cc-logo"></div>;

    return (
      <div className={scale}>
        {logo}
      </div>
    )
  };
}
