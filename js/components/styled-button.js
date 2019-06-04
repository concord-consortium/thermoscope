import React, {PureComponent} from 'react';

export default class StyledButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      active: false
    };
  }

  handleMouse(enter) {
    return () => {
      if (enter) {
        this.setState({hovered: true});
      } else {
        this.setState({
          hovered: false,
          active: false
        });
      }
    }
  }

  handleClick(down) {
    return () => this.setState({active: down});
  }

  render() {
    const { hovered, active } = this.state;
    const { className, background, hoveredBackground, activeBackground, onClick } = this.props;
    const currentBackground = active 
      ? activeBackground
      : hovered
        ? hoveredBackground
        : background;
    return (
      <div 
        className={className}
        onClick={onClick}
        style={{backgroundImage: `url(${currentBackground})`}}
        onMouseEnter={this.handleMouse(true)}
        onMouseLeave={this.handleMouse(false)}
        onMouseDown={this.handleClick(true)}
        onMouseUp={this.handleClick(false)}
      />
    );
  }
}
