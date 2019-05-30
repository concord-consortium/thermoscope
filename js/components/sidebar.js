import React, {PureComponent} from 'react';
import '../../css/sidebar.less';

export default class LogoMenu extends PureComponent {

  render() {
    const { active, showHideButtons, showPlayButtons, showCelsius } = this.props;
    const { onClose, onToggleHideButtons, onTogglePlayButtons, onToggleCelsius } = this.props;

    return (
      <div className="sidebar-container">
        <div className="sidebar-cover" />
        <div className={`sidebar ${active ? 'active' : ''}`}>
          <div className="close" onClick={onClose} />
          <div className={`show-hide toggle ${showHideButtons ? "on" : "off"}`}>
            <div className="thumb" onClick={onToggleHideButtons}/>
          </div>
          <div className={`show-play toggle ${showPlayButtons ? "on" : "off"}`}>
            <div className="thumb" onClick={onTogglePlayButtons}/>
          </div>
          <div className={`toggle-celsius toggle ${showCelsius ? "left" : "right"}`}>
            <div className="c-label" onClick={onToggleCelsius}/>
            <div className="thumb" onClick={onToggleCelsius}/>
            <div className="f-label" onClick={onToggleCelsius}/>
          </div>
        </div>
      </div>
    )
  };
}
