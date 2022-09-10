import React from 'react';
import { Component, ChangeEvent } from 'react';
import { twoDigits } from './../../utils/StringUtil';
interface Props {
  onChange(h: number, m: number, s: number): any,
  value: string,
}
class State {
  hour = new Date().getHours();
  minute = new Date().getMinutes();
  second = new Date().getSeconds();
}
const hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];
const minutesOrSeconds = () => {
  const arr: number[] = [];
  for (let i = 1; i < 60; i++) {
    arr.push(i);
  }
  return arr;
}
export default class InputTime extends Component<Props, State> {
  state = new State();
  minutes: number[];
  seconds: number[];
  constructor(props) {
    super(props);
    this.minutes = minutesOrSeconds();
    this.seconds = minutesOrSeconds();
  }
  componentDidMount() {
    this.updateFromProps();
  }
  updateFromProps = () => {
    try {
      const val = this.props.value.split(":");
      this.setState({ hour: parseInt(val[0]), minute: parseInt(val[1]), second: parseInt(val[2]) });
    } catch (error) {

    }
  }
  updateValue = (e: ChangeEvent<HTMLSelectElement>) => {
    const { target } = e;
    const { name } = target;
    this.setState({ [name]: target.value } as any, this.onChange);
  }
  setNow = () => {
    const date = new Date();
    this.setState({
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    }, this.onChange)
  }
  onChange = () => {
    this.props.onChange(this.state.hour, this.state.minute, this.state.second)
  }
  render() {

    return (<div className="form-control bg-light">
      <select name="hour" style={{ border: 'none' }} value={this.state.hour} onChange={this.updateValue} >
        {hours.map((hour) => {
          return <option key={"HOUR-" + hour} value={hour} >{twoDigits(hour)}</option>
        })}
      </select>
      <select name="minute" style={{ border: 'none' }} value={this.state.minute} onChange={this.updateValue}>
        {this.minutes.map((min) => {
          return <option key={"MIN-" + min} value={min} >{twoDigits(min)}</option>
        })}
      </select>
      <select name="second" style={{ border: 'none' }} value={this.state.second} onChange={this.updateValue}>
        {this.seconds.map((sec) => {
          return <option key={"SEC-" + sec} value={sec} >{twoDigits(sec)}</option>
        })}
      </select>
      <a style={{ marginLeft: 5 }} onClick={this.setNow} ><i className="fas fa-history" /></a>
    </div>)
  }
}