import React, { ChangeEvent } from 'react'
import BaseManagementPage from '../management/BaseManagementPage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import EditDeleteButton from '../management/EditDeleteButton'
import PointRecord from './../../../models/PointRecord';
import Filter from '../../../models/commons/Filter';
import FormGroup from './../../form/FormGroup';
import NavigationButtons from './../../navigation/NavigationButtons';
import { tableHeader } from './../../../utils/CollectionUtil';
import DropPointButtons from './DropPointButtons';
import Spinner from './../../loader/Spinner';
import { MONTHS } from './../../../utils/DateUtil';
import FilterPeriod from './../../form/FilterPeriod';
import PointRecordDetail from './PointRecordDetail';
class State {
    items: PointRecord[] = [];
    filter: Filter = new Filter();
    totalData: number = 0;
    record?: PointRecord;
    loading: boolean = false;

}


class PointRecordManagement extends BaseManagementPage {
    state: State = new State();

    constructor(props) {
        super(props, 'pointrecord', false);
        if (!this.state.filter.fieldsFilter) {
            this.state.filter.fieldsFilter = {};
        }

        this.state.filter.limit = 10;
        this.state.filter.day = this.state.filter.dayTo = new Date().getDate();
        this.state.filter.month = this.state.filter.monthTo = new Date().getMonth() + 1;
        this.state.filter.year = this.state.filter.yearTo = new Date().getFullYear();
        this.state.filter.fieldsFilter['dropped'] = 'ALL';
    }

    // oneRecordLoaded = (item:any) => {
    //     window.scrollTo(0, 0);
    //     super.oneRecordLoaded(item);
    // }

    render() {
        const filter: Filter = this.state.filter;
        const fieldsFilter = filter.fieldsFilter;
        if (this.state.record) {
            return (
                <div className="container-fluid section-body">
                    <h2>Point Record Management</h2>
                    <PointRecordDetail record={this.state.record} close={() => this.oneRecordLoaded(undefined)} />
                </div>
            )
        }
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
                            <FilterPeriod filter={filter} onChange={this.updateFilter} />
                        </div>
                        <div className="input-group">
                            <FilterPeriod mode={"to"} filter={filter} onChange={this.updateFilter} />
                        </div>
                    </FormGroup>
                    <FormGroup label="Dropped">
                        <select name="dropped" className="form-control" value={fieldsFilter ? fieldsFilter['dropped'] : 'ALL'} onChange={this.updateFieldsFilter}>
                            <option value="ALL">All</option>
                            <option value="false">Not Dropped</option>
                            <option value="true">Dropped</option>
                        </select>
                    </FormGroup>
                    <FormGroup label="Record Count">
                        <input name="limit" className="form-control" value={filter.limit ?? 5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup label="Period">
                        {filter.day} {MONTHS[(filter.month ?? 1) - 1]} {filter.year} - {filter.dayTo} {MONTHS[(filter.monthTo ?? 1) - 1]} {filter.yearTo}
                    </FormGroup>
                    <FormGroup>
                        <input className="btn btn-primary" type="submit" value="Submit" />
                    </FormGroup>
                </form>
                <NavigationButtons activePage={filter.page ?? 0} limit={filter.limit ?? 10} totalData={this.state.totalData}
                    onClick={this.loadAtPage} />
                <ItemsList startingNumber={(filter.page ?? 0) * (filter.limit ?? 10)} loading={this.state.loading}
                    recordLoaded={this.oneRecordLoaded}
                    recordUpdated={this.loadItems}
                    items={this.state.items} />
            </div>
        )
    }

}

const ItemsList = (props: { loading: boolean, startingNumber: number, items: PointRecord[], recordLoaded(item: PointRecord), recordUpdated() }) => {

    return (
        <div style={{ overflow: 'scroll' }}>

            <table className="table table-striped">
                {tableHeader("No", "Student", "Date", "Point Name", "Point", "Picture", "Dropped", "Option")}
                <tbody>

                    {props.loading ?
                        <tr><td colSpan={7}><Spinner /></td></tr>
                        : props.items.map((item, i) => {
                            item = PointRecord.clone(item);
                            return (
                                <tr key={"PointRecord-" + i}>
                                    <td>{i + 1 + props.startingNumber}</td>
                                    <td>{item.student?.user?.name}</td>
                                    <td>{item.location} {item.getDate().toDateString()} {item.time}</td>
                                    <td>{item.rule_point?.name} ({item.rule_point?.category?.name})</td>
                                    <td>{item.rule_point?.point}</td>
                                    <td>{item.getPicture() ?
                                        <img src={item.getPicture() ?? ""} width={50} height={50} />
                                        : null}</td>
                                    <td>{item.dropped_at ?? "-"}</td>
                                    <td>
                                        <div style={{ width: '200px' }}>
                                            <DropPointButtons record={item} onUpdated={props.recordUpdated} />
                                            <EditDeleteButton record={item}
                                                recordLoaded={props.recordLoaded}
                                                recordDeleted={props.recordUpdated}
                                                modelName={'pointrecord'} />
                                        </div>
                                    </td>
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