import React, {PureComponent} from 'react';

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

export default class StyledButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      active: false
    };
    this.images = importAll(require.context('../../css/exp', false, /\.(png|jpe?g|svg)$/));
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
        style={{backgroundImage: `url(${this.images[currentBackground]})`}}
        onMouseEnter={this.handleMouse(true)}
        onMouseLeave={this.handleMouse(false)}
        onMouseDown={this.handleClick(true)}
        onMouseUp={this.handleClick(false)}
      />
    );
  }
}
