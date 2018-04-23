import React, { PureComponent } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
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
    let loading = false,
    appCache = window.applicationCache;
    switch (appCache.status) {
      case appCache.CHECKING: // CHECKING == 2
        loading = true;
        break;
      case appCache.DOWNLOADING: // DOWNLOADING == 3
        loading = true;
        break;
      default:
        loading = false;
        break;
    }
    this.setState({
      date: new Date(),
      loading
    });
  }

  render() {
    const { loading, date } = this.state;
    let clockClassName = this.props.dark ? 'clock-dark' : 'clock';
    const width = 20;
    return (
      <div className='timed-elements'>
        <div className={clockClassName}>
          <span>{date.toLocaleTimeString()}</span>
        </div>
        {loading &&
          <div className='cache-progress-container'>
            <CircularProgress className='cache-progress' size={width} thickness={5} style={{position: 'fixed', bottom: width * 0.5, right: width * 0.5}}/>
          </div>
        }
      </div>
    )
  };
}
