import React, {Component} from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames/bind';

import {MONTHS} from '../constants';
import {chunk} from '../utils';


class Month extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moment: props.moment
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      moment: props.moment
    });
  }

  changeYear = (dir) => {
    const _moment = this.state.moment.clone();

    this.setState({
      moment: _moment[dir === 'prev' ? 'subtract' : 'add'](1, 'year')
    });
  }

  select = (month, isDisabled) => {
    if (isDisabled) return;
    const {onSelect} = this.props;
    const _moment = this.state.moment.clone();

    const newMonth = _moment.month(month);

    this.setState({
      moment: newMonth
    });
    onSelect(newMonth);
  }

  _renderMonth = (row, month, idx) => {
    const now = dayjs();
    const _moment = this.state.moment;
    const {maxDate, minDate, months, selected, range, rangeAt, dateLimit} = this.props;
    const currentMonth = _moment.clone().month(month);
    const start = selected && range 
      ? (selected.start ? currentMonth.isSame(selected.start, 'month') : false) 
      : false; 
    const end = selected && range
      ? (selected.end ? currentMonth.isSame(selected.end, 'month') : false) 
      : false; 
    const between = selected && range 
      ? (selected.start && selected.end 
        ? currentMonth.isBetween(selected.start, selected.end, 'month') 
        : false) 
      : false;
    const isSelected = selected 
      ? range 
        ? selected[rangeAt] ? currentMonth.isSame(selected[rangeAt], 'month') : false
        : currentMonth.isSame(selected, 'day')
      : false;
    const disabledMax = maxDate ? currentMonth.isAfter(maxDate, 'month') : false;
    const disabledMin = minDate ? currentMonth.isBefore(minDate, 'month') : false;
    let disabled = false;
    let limited = false;

    if (range) {
      if (rangeAt === 'start' && selected && selected.end) {
        disabled = selected.end && currentMonth.isAfter(selected.end, 'day');
      } else if (rangeAt === 'end' && selected && selected.start) {
        disabled = selected.start && currentMonth.isBefore(selected.start, 'day');
      }
    }

    if (dateLimit && range) {
      const limitKey = Object.keys(dateLimit)[0];
      const limitValue = dateLimit[limitKey];
      let minLimitedDate, maxLimitedDate;

      if (selected) {

        if (rangeAt === 'start' && selected.start && selected.end) {
          maxLimitedDate = selected.end.clone();
          minLimitedDate = maxLimitedDate.clone().subtract(limitValue, limitKey);
        } else if (rangeAt === 'end' && selected.start && selected.end) {
          minLimitedDate = selected.start.clone();
          maxLimitedDate = minLimitedDate.clone().add(limitValue, limitKey);
        }

        if (minLimitedDate && maxLimitedDate) {
          limited = !currentMonth.isBetween(minLimitedDate, maxLimitedDate, 'day', rangeAt === 'start' ? '(]' : '[)');
        }
      }
    }

    const isDisabled = disabledMax || disabledMin || disabled || limited;
    const className = classNames({
      selected: isSelected,
      now: now.isSame(currentMonth, 'month'),
      disabled: isDisabled,
      start,
      end,
      between
    });

    return (
      <td 
        key={month} 
        className={className} 
        onClick={this.select.bind(this, month, isDisabled)}>
        {months ? months[idx + row * 3] : month}
      </td>
    );
  }

  render() {
    const _moment = this.state.moment;
    const months = MONTHS;
    const {changePanel, style, leftIcon, rightIcon} = this.props;

    return (
      <div className="calendar-months" style={style}>
        <div className="calendar-nav">
          <button type="button" className="prev-month" onClick={this.changeYear.bind(this, 'prev')}>
            {leftIcon || <i className="fa fa-angle-left"/>}
          </button>
          <span className="current-date" onClick={changePanel.bind(this, 'year', _moment)}>{_moment.format('YYYY')}</span>
          <button type="button" className="next-month" onClick={this.changeYear.bind(this, 'next')}>
            {rightIcon || <i className="fa fa-angle-right"/>}
          </button>
        </div>
        <table>
          <tbody>
            {chunk(months, 3).map((_months, idx) => {
              return (
                <tr key={idx}>
                  {_months.map(this._renderMonth.bind(this, idx))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}


export default Month;
