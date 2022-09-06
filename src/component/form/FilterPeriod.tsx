import React, { ChangeEvent } from 'react';
import Filter from '../../models/commons/Filter';
import { MONTHS } from './../../utils/DateUtil';

const days = (): number[] => {
  const arr: number[] = [];
  for (let i = 1; i <= 31; i++) {
    arr.push(i);
  }
  return arr;
}
const FilterPeriod = (props: {
  date: Date,
  onChange(e: ChangeEvent<HTMLSelectElement | HTMLInputElement>): any,
  disableDay?: boolean,
}) => {
  const { date, disableDay } = props;
  return (
    <React.Fragment>
      {
        disableDay !== true &&
        <select data-type="number" className="form-control-sm" name="day" value={date.getDate()} onChange={props.onChange}>
          {days().map((d) => {
            return <option key={`td-${d}`} value={d}>{d == 0 ? 'day' : d}</option>
          })}
        </select>
      }
      <select data-type="number" className="form-control-sm" name="month" value={date.getMonth()} onChange={props.onChange}>
        {MONTHS.map((m, i) => {
          return <option key={`tm-${i}`} value={i}>{m}</option>
        })}
      </select>
      <input name="year" placeholder="year" className="form-control-sm" value={date.getFullYear()} onChange={props.onChange} />
    </React.Fragment>
  )
}

export default FilterPeriod;