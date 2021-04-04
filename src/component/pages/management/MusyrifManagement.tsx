import React, { ChangeEvent } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Employee from './../../../models/Employee';
import { tableHeader } from './../../../utils/CollectionUtil';
import Filter from '../../../models/commons/Filter'; 
import FormGroup from './../../form/FormGroup';
import NavigationButtons from './../../navigation/NavigationButtons';
import EmployeeRow from './EmployeeRow';
import User from '../../../models/User';
import ToggleButton from './../../navigation/ToggleButton';
import BaseManagementPage from './BaseManagementPage';
class State {
    items:Employee[] = [];
    filter:Filter = new Filter();
    totalData:number = 0;
}
class MusyrifManagement extends BaseManagementPage{
    state:State = new State();
    constructor(props) {
        super(props, 'employee');
        this.state.filter.limit = 10;
        this.state.filter.fieldsFilter = {
            'musyrif_only':true
        }
    }
    setMusyrifOnly = (musyrifOnly:boolean) => {
        const filter = this.state.filter;
        if (!filter.fieldsFilter) {
            filter.fieldsFilter = {};
        }
        filter.fieldsFilter['musyrif_only'] = musyrifOnly;
        this.setState({filter: filter}, ()=> this.loadAtPage(0))
    }
    onEmployeeStatusUpdate = () => {
        this.loadItems();
    }
    render() {
        const filter = this.state.filter;
        const musyrifOnly :boolean = filter.fieldsFilter && filter.fieldsFilter['musyrif_only']&&filter.fieldsFilter['musyrif_only'] == true;
        return (
            <div  className="section-body container-fluid">
                <h2>Musyrif Management</h2>
                <hr/>
               
                <form onSubmit={(e)=>{e.preventDefault(); this.loadAtPage(0)}}>
                    <FormGroup label="Search">
                        <input name="name" placeholder="Search by name or email" className="form-control" value={filter.fieldsFilter?filter.fieldsFilter['name']:""} onChange={this.updateFieldsFilter} />
                    </FormGroup>
                    <FormGroup label="Record Count">
                        <input name="limit" className="form-control" value={filter.limit??5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup label="Show Option">
                        <ToggleButton active={musyrifOnly} onClick={this.setMusyrifOnly} noLabel="All Employee" yesLabel="Musyrif Only" />
                    </FormGroup>
                    <FormGroup>
                        <input className="btn btn-primary" type="submit" value="Submit"/>
                    </FormGroup>
                </form>
                <NavigationButtons activePage={filter.page??0} limit={filter.limit??5} totalData={this.state.totalData}
                    onClick={this.loadAtPage} />
                <EmployeeList onUpdated={this.onEmployeeStatusUpdate} startingNumber={(filter.page??0) *( filter.limit?? 5)} items={this.state.items} />
            </div>
        )
    }

}
const EmployeeList = (props:{onUpdated:()=>void,startingNumber:number, items:Employee[]}) => {
    const items = props.items;
    return (
        <div className="container-fluid" style={{overflow:'scroll'}}>
        <table className="table table-striped" >
            {tableHeader("No", "Name", "Email", "NIP", "Role: Musyrif", "Opsi")}
            <tbody>
                {items.map((emp,i)=>{
                    if (emp.user) {
                        emp.user = User.clone(emp.user);
                    }
                    return (
                        <EmployeeRow onUpdated={props.onUpdated} employee={emp} startingNumber={props.startingNumber+i} key={emp.id} />
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
    )(MusyrifManagement)
)