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
const  FilterPeriod = (props: { showlabel?:boolean, hideDay?:boolean, mode?: string, filter: Filter, onChange(e: ChangeEvent): any, }) => {
    const filter: Filter = props.filter;
    if (props.mode == "to") {
        return (
            <React.Fragment>
                {props.showlabel === true? <input className="form-control-sm" value="Sampai tanggal" disabled /> :null}
                {props.hideDay != true?
                <select data-type="number" className="form-control-sm" name="dayTo" value={filter.dayTo ?? 0} onChange={props.onChange}>
                    {days().map((d) => {
                        return <option key={"f-d-" + d} value={d}>{d == 0 ? 'day' : d}</option>
                    })}
                </select> :null}
                <select data-type="number" className="form-control-sm" name="monthTo" value={filter.monthTo ?? 0} onChange={props.onChange}>
                    {MONTHS.map((m, i) => {
                        return <option key={"f-m-" + i} value={(i + 1)}>{m}</option>
                    })}
                </select>
                <input name="yearTo" placeholder="year" className="form-control-sm" value={filter.yearTo ?? ""} onChange={props.onChange} />
            </React.Fragment>

        )
    }
    return (
        <React.Fragment>
            {props.showlabel === true?<input className="form-control-sm" value="Dari tanggal" disabled /> :null}
            {props.hideDay != true?<select data-type="number" className="form-control-sm" name="day" value={filter.day ?? 0} onChange={props.onChange}>
                {days().map((d) => {
                    return <option key={"f-d-" + d} value={d}>{d == 0 ? 'day' : d}</option>
                })}
            </select>: null}
            <select data-type="number" className="form-control-sm" name="month" value={filter.month ?? 0} onChange={props.onChange}>
                {MONTHS.map((m, i) => {
                    return <option key={"f-m-" + i} value={(i + 1)}>{m}</option>
                })}
            </select>
            <input name="year" placeholder="year" className="form-control-sm" value={filter.year?? ""} onChange={props.onChange} />
        </React.Fragment>
    )
}

export default  FilterPeriod;