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
                <form>
                    <FormGroup label="Show Record">
                        <input name="limit" className="form-control" value={filter.limit??5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup>
                        <AnchorWithIcon iconClassName="fas fa-redo" onClick={this.loadItems} >Reload</AnchorWithIcon>
                    </FormGroup>
                </form>
                <NavigationButtons
                 activePage={filter.page??0} limit={filter.limit??5} totalData={this.state.totalData}
                 onClick={this.updatePage} />
                <EmployeeList items={this.state.items} />
            </div>
        )
    }

}
const EmployeeList = (props:{items:Employee[]}) => {
    const items = props.items;
    return (
        <table className="table striped">
            {tableHeader("No", "Name", "NIP", "Musyrif")}
            {items.map((emp,i)=>{

                return (
                    <tr key={emp.id} >
                        <td>{i+1}</td>
                        <td>{emp.user?.name}</td>
                        <td>{emp.user?.nip}</td>
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