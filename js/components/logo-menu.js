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
        {showNav &&
          <div className="menu">
            <div title="Home"><a href="../"><i className="material-icons">home</i></a></div>
            <div title="Thermoscope"><a href="../thermoscope"><i className="material-icons">group_work</i></a></div>
            <div title="Particle Modeler"><a href="../particle-modeler"><i className="material-icons">all_out</i></a></div>
          </div>}
        <img className="cc-logo" src="../css/concord-consortium-logo.png" />
      </div>
    )
  };
}
