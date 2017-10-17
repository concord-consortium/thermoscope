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
        <div className="cc-logo" />
        {showNav &&
          <div className="menu">
            <div title="Home"><a href="../"><i className="material-icons">home</i></a></div>
          </div>}

      </div>
    )
  };
}
