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
const  FilterPeriod = (props: { mode?: string, filter: Filter, onChange(e: ChangeEvent): any, }) => {
    const filter: Filter = props.filter;
    if (props.mode == "to") {
        return (
            <React.Fragment>
                <input className="form-control" value="Date To" disabled />
                <select data-type="number" className="form-control" name="dayTo" value={filter.dayTo ?? 0} onChange={props.onChange}>
                    {days().map((d) => {
                        return <option key={"f-d-" + d} value={d}>{d == 0 ? 'day' : d}</option>
                    })}
                </select>
                <select data-type="number" className="form-control" name="monthTo" value={filter.monthTo ?? 0} onChange={props.onChange}>
                    {MONTHS.map((m, i) => {
                        return <option key={"f-m-" + i} value={(i + 1)}>{m}</option>
                    })}
                </select>
                <input name="yearTo" placeholder="year" className="form-control" value={filter.yearTo ?? ""} onChange={props.onChange} />
            </React.Fragment>

        )
    }
    return (
        <React.Fragment>
            <input className="form-control" value="Date From" disabled />
            <select data-type="number" className="form-control" name="day" value={filter.day ?? 0} onChange={props.onChange}>
                {days().map((d) => {
                    return <option key={"f-d-" + d} value={d}>{d == 0 ? 'day' : d}</option>
                })}
            </select>
            <select data-type="number" className="form-control" name="month" value={filter.month ?? 0} onChange={props.onChange}>
                {MONTHS.map((m, i) => {
                    return <option key={"f-m-" + i} value={(i + 1)}>{m}</option>
                })}
            </select>
            <input name="year" placeholder="year" className="form-control" value={filter.year?? ""} onChange={props.onChange} />
        </React.Fragment>
    )
}

export default  FilterPeriod;