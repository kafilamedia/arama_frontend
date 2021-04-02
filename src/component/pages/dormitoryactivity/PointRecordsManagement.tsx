import React from 'react'
import BaseManagementPage from '../management/BaseManagementPage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import PointRecord from './../../../models/PointRecord';
import Filter from './../../../models/Filter';
import FormGroup from './../../form/FormGroup';
import NavigationButtons from './../../navigation/NavigationButtons';
import { tableHeader } from './../../../utils/CollectionUtil';
import EditDeleteButton from '../management/EditDeleteButton';
import Spinner from './../../loader/Spinner';
class State {
    items: PointRecord[] = [];
    filter: Filter = new Filter();
    totalData: number = 0;
    record: PointRecord = new PointRecord();
    loading: boolean = false;

}
const days = (): any[] => {
    const arr: any[] = ["ALL"];
    for (let i = 1; i <= 31; i++) {
        arr.push(i);
    }
    return arr;
}
const months = (): any[] => {
    const arr: any[] = ["ALL"];
    for (let i = 1; i <= 12; i++) {
        arr.push(i);
    }
    return arr;
}

class PointRecordManagement extends BaseManagementPage {
    state: State = new State();
    days: any[];
    months: any[];
    constructor(props) {
        super(props, 'pointrecord', true);
        this.days = days();
        this.months = months();
        if (!this.state.filter.fieldsFilter) {
            this.state.filter.fieldsFilter = {};
        }
        this.state.filter.limit = 10;
        this.state.filter.fieldsFilter['day'] = 'ALL';
        this.state.filter.fieldsFilter['month'] = 'ALL';
        this.state.filter.fieldsFilter['dropped'] = 'ALL';
    }

    render() {
        const filter: Filter = this.state.filter;
        const fieldsFilter = filter.fieldsFilter;
        return (
            <div className="container-fluid section-body">
                <h2>Point Record Management</h2>
                <hr />
                <form onSubmit={(e) => { e.preventDefault(); this.loadAtPage(0) }}>
                    <FormGroup label="Search">
                        <div className="input-group">
                            <input name="name" placeholder="student name" className="form-control" value={fieldsFilter ? fieldsFilter['name'] : ""} onChange={this.updateFieldsFilter} />
                            <input name="point_name" placeholder="point name" className="form-control" value={fieldsFilter ? fieldsFilter['point_name'] : ""} onChange={this.updateFieldsFilter} />
                        </div>
                        <div className="input-group">
                            <input name="category_name" placeholder="category" className="form-control" value={fieldsFilter ? fieldsFilter['category_name'] : ""} onChange={this.updateFieldsFilter} />
                            <input name="location" placeholder="location" className="form-control" value={fieldsFilter ? fieldsFilter['location'] : ""} onChange={this.updateFieldsFilter} />
                        </div>
                        <div className="input-group">
                            <input className="form-control" value="Date" disabled />
                            <select className="form-control" name="day" value={fieldsFilter ? fieldsFilter['day'] : "ALL"} onChange={this.updateFieldsFilter}>
                                {this.days.map((d) => {
                                    return <option key={"f-d-" + d} value={d}>{d == 'ALL' ? 'day' : d}</option>
                                })}
                            </select>
                            <select className="form-control" name="month" value={fieldsFilter ? fieldsFilter['month'] : "ALL"} onChange={this.updateFieldsFilter}>
                                {this.months.map((m) => {
                                    return <option key={"f-m-" + m} value={m}>{m == 'ALL' ? 'month' : m}</option>
                                })}
                            </select>
                            <input name="year" placeholder="year" className="form-control" value={fieldsFilter ? fieldsFilter['year'] : ""} onChange={this.updateFieldsFilter} />

                        </div>
                    </FormGroup>
                    <FormGroup label="Dropped">
                        <select name="dropped" className="form-control"value={fieldsFilter?fieldsFilter['dropped']:'ALL'} onChange={this.updateFieldsFilter}>
                            <option value="ALL">All</option>
                            <option value="false">Not Dropped</option>
                            <option value="true">Dropped</option>
                        </select>
                    </FormGroup>
                    <FormGroup label="Record Count">
                        <input name="limit" className="form-control" value={filter.limit ?? 5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup>
                        <input className="btn btn-primary" type="submit" value="Submit" />
                    </FormGroup>
                </form>
                <NavigationButtons activePage={filter.page ?? 0} limit={filter.limit ?? 10} totalData={this.state.totalData}
                    onClick={this.loadAtPage} />
                <ItemsList
                    loading={this.state.loading}
                    recordLoaded={this.oneRecordLoaded}
                    recordDeleted={this.loadItems}
                    startingNumber={(filter.page ?? 0) * (filter.limit ?? 10)} items={this.state.items} />
            </div>
        )
    }

}
const ItemsList = (props: { loading: boolean, startingNumber: number, items: PointRecord[], recordLoaded(item: any), recordDeleted() }) => {

    return (
        <div style={{ overflow: 'scroll' }}>
             
            <table className="table table-striped">
                {tableHeader("No", "Student", "Date", "Point Name", "Point", "Dropped", "Option")}
                <tbody>

                    {props.loading?
                    <tr><td colSpan={7}><Spinner/></td></tr>
                    :props.items.map((item, i) => {
                        item = Object.assign(new PointRecord, item);
                        return (
                            <tr key={"PointRecord-" + i}>
                                <td>{i + 1 + props.startingNumber}</td>
                                <td>{item.student?.user?.name}</td>
                                <td>{item.location} {item.getDate().toDateString()} {item.time}</td>
                                <td>{item.rule_point?.name} ({item.rule_point?.category?.name})</td>
                                <td>{item.rule_point?.point}</td>
                                <td>{item.dropped_at ??  "-"}</td>
                                <td><EditDeleteButton
                                    recordLoaded={props.recordLoaded}
                                    recordDeleted={props.recordDeleted}
                                    record={item} hideEdit modelName={'pointrecord'} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )

}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(PointRecordManagement)
)