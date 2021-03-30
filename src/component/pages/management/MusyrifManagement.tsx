import React, { ChangeEvent } from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import MusyrifManagementService from './../../../services/MusyrifManagementService';
import Employee from './../../../models/Employee';
import WebResponse from './../../../models/WebResponse';
import { tableHeader } from './../../../utils/CollectionUtil';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import Filter from './../../../models/Filter'; 
import FormGroup from './../../form/FormGroup';
import NavigationButtons from './../../navigation/NavigationButtons';
import { AuthorityType } from '../../../models/AuthorityType';
import User from '../../../models/User';
class State {
    items:Employee[] = [];
    filter:Filter = new Filter();
    totalData:number = 0;
}
class MusyrifManagement extends BaseComponent{
    state:State = new State();
    musyrifManagementService:MusyrifManagementService;
    constructor(props) {
        super(props,true);
        this.state.filter.limit = 10;
        this.musyrifManagementService = this.getServices().musyrifManagementService;
    }
    itemsLoaded = (response:WebResponse) => {
        this.setState({items:response.items, totalData:response.totalData});
    }
    updateFilter = (e:ChangeEvent) => {
        const filter = this.state.filter;
        const target = (e.target as any);
        filter[target.name] = target.value;
        this.setState({filter: filter})
    }
    updateFieldsFilter = (e:ChangeEvent) => {
        const filter = this.state.filter;
        const target = (e.target as any);
        if (!filter.fieldsFilter) {
            filter.fieldsFilter = {};
        }
        filter.fieldsFilter[target.name] = target.value;
        this.setState({filter: filter})
    }
    updatePage = (page:number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({filter: filter}, this.loadItems);
    }
    loadItems = () => {
        this.commonAjax(
            this.musyrifManagementService.employeeList,
            this.itemsLoaded,
            this.showCommonErrorAlert,
            this.state.filter
        )
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadItems();
    }
    render() {
        const filter = this.state.filter;
        return (
            <div  className="section-body container-fluid">
                <h2>Musyrif Management</h2>
                <hr/>
                <form onSubmit={(e)=>{e.preventDefault(); this.loadItems()}}>
                    <FormGroup label="Search Name">
                        <input name="name" className="form-control" value={filter.fieldsFilter?filter.fieldsFilter['name']:""} onChange={this.updateFieldsFilter} />
                    </FormGroup>
                    <FormGroup label="Show Record">
                        <input name="limit" className="form-control" value={filter.limit??5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup>
                        <input className="btn btn-primary" type="submit" value="Submit"/>
                    </FormGroup>
                </form>
                <NavigationButtons activePage={filter.page??0} limit={filter.limit??5} totalData={this.state.totalData}
                    onClick={this.updatePage} />
                <EmployeeList startingNumber={(filter.page??0) *( filter.limit?? 5)} items={this.state.items} />
            </div>
        )
    }

}
const EmployeeList = (props:{startingNumber:number, items:Employee[]}) => {
    const items = props.items;
    return (
        <table className="table striped" style={{tableLayout:'fixed'}}>
            {tableHeader("No", "Name", "NIP", "Musyrif")}
            {items.map((emp,i)=>{
                if (emp.user) {
                    emp.user = User.clone(emp.user);
                }
                const isMusyrif = emp.user?.hasRole(AuthorityType.musyrif_asrama);
                return (
                    <tr key={emp.id} >
                        <td>{props.startingNumber+i+1}</td>
                        <td>{emp.user?.name}</td>
                        <td>{emp.user?.nip}</td>
                        <td>{isMusyrif?"Yes":"No"}</td>
                    </tr>
                )
            })}
        </table>
    )
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(MusyrifManagement)
)