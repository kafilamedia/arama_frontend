import React from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import MusyrifManagementService from './../../../services/MusyrifManagementService';
import Employee from './../../../models/Employee';
import WebResponse from './../../../models/WebResponse';
import { tableHeader } from './../../../utils/CollectionUtil';
class State {
    items:Employee[] = [];
}
class MusyrifManagement extends BaseComponent{
    state:State = new State();
    musyrifManagementService:MusyrifManagementService;
    constructor(props) {
        super(props,true);
        this.musyrifManagementService = this.getServices().musyrifManagementService;
    }
    itemsLoaded = (response:WebResponse) => {
        this.setState({items:response.items});
    }
    loadItems = () => {
        this.commonAjax(
            this.musyrifManagementService.employeeList,
            this.itemsLoaded,
            this.showCommonErrorAlert,
        )
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadItems();
    }
    render() {
        return (
            <div  className="section-body container-fluid">
                <h2>Musyrif Management</h2>
                <hr/>
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