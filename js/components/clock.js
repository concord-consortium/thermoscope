import React, {PureComponent} from 'react';
import '../../css/app.less';

export default class Clock extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    let clockClassName = this.props.dark ? 'clock-dark' : 'clock';
    return (
      <div className={clockClassName}>
        <span>{this.state.date.toLocaleTimeString()}</span>
      </div>
    )
  };
}
