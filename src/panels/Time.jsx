import React, {Component} from 'react';
import ReactSlider from 'react-slider';
import dayjs from 'dayjs';


class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moment: this.getCurrentMoment(props)
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      moment: this.getCurrentMoment(props)
    });
  }

  getCurrentMoment = (props) => {
    const {range, rangeAt} = props;
    let result = props.moment;

    if (result) {
      if (range) {
        result = result[rangeAt] || dayjs().hours(0).minutes(0);
      }
    } else {
      result = dayjs().hours(0).minutes(0);
    }

    return result;
  }

  handleChange = (type, value) => {
    const {onChange, range, rangeAt} = this.props;
    const _moment = this.state.moment.clone();
    let selected = this.props.moment;

    const newTime = _moment[type](value);

    if (range) {
      const copyed = selected ? Object.assign(selected, {}) : {};

      copyed[rangeAt] = newTime;
    } else {
      selected = newTime;
    }

    this.setState({
      moment: newTime
    });
    onChange && onChange(selected);
  }

  render() {
    const _moment = this.state.moment;
    const {style} = this.props;

    return (
      <div style={style}>
        <div className="time">
          <div className="show-time">
            <span className="text">{_moment.format('HH')}</span>
            <span className="separater">:</span>
            <span className="text">{_moment.format('mm')}</span>
          </div>
          <div className="sliders">
            <span className="slider-text">Hours:</span>
            <ReactSlider min={0} max={23} value={_moment.hour()} onChange={this.handleChange.bind(this, 'hour')} withBars />
            <span className="slider-text">Minutes:</span>
            <ReactSlider min={0} max={59} value={_moment.minute()} onChange={this.handleChange.bind(this, 'minute')} withBars />
          </div>
        </div>
      </div>
    );
  }
}


export default Time;
