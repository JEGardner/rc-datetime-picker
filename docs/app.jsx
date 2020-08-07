import React, {Component} from 'react';
import {render} from 'react-dom';
import dayjs from 'dayjs';

import {DatetimePicker, DatetimePickerTrigger} from '../dist/rc-datetime-picker';
import './app.less';


class InlinePicker extends Component {
  constructor() {
    super();
    this.state = {
      moment: dayjs()
    };
  }

  handleChange = (moment) => {
    this.setState({
      moment
    });
  }

  render() {
    const {moment} = this.state;

    return (
      <div>
        <span className="text">Datetime: {moment.format('YYYY/MM/DD HH:mm')}</span>
        <DatetimePicker
          moment={moment}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

class PopupPicker extends Component {
  constructor() {
    super();
    this.state = {
      datetime: dayjs()
    };
  }

  handleChange = (moment) => {
    this.setState({
      datetime: moment
    });
  }

  render() {
    const shortcuts = {
      'Today': dayjs(),
      'Yesterday': dayjs().subtract(1, 'days'),
      'Clear': ''
    };
    const {datetime} = this.state;
    const value = datetime ? datetime.format('YYYY/MM/DD HH:mm') : '';
    
    return (
      <DatetimePickerTrigger 
        shortcuts={shortcuts} 
        moment={datetime} 
        onChange={this.handleChange} 
      >
        <input type="text" value={value} readOnly />
        <span className="fa fa-calendar-o"></span>
      </DatetimePickerTrigger>
    );
  }
}

render(
  <InlinePicker />,
  document.getElementById('inline-picker')
);

render(
  <PopupPicker />,
  document.getElementById('popup-picker')
);

