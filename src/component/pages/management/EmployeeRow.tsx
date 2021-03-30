
import BaseComponent from './../../BaseComponent';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Employee from './../../../models/Employee';
import { AuthorityType } from '../../../models/AuthorityType';
import MusyrifManagementService from './../../../services/MusyrifManagementService';
import ToggleButton from './../../navigation/ToggleButton';
import WebResponse from './../../../models/WebResponse';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
class EmployeeRow extends BaseComponent {
    musyrifManagementService:MusyrifManagementService;
    constructor(props) {
        super(props,true);
        this.musyrifManagementService = this.getServices().musyrifManagementService;
    }

    getEmployee = (): Employee => {
        return this.props.employee;
    }
    activeStatusUpdate = (response:WebResponse) => {
        this.showInfo("Success");
        if (this.props.onUpdated) {
            this.props.onUpdated();
        }
    }
    activateMusyrif = (active:boolean) => {
        const emp = this.getEmployee();

        this.showConfirmation((active?"Activate " : "Deactivate ")+emp.user?.name+"?").then(
            ok => {
                if (!ok) return;
                this.commonAjax(
                    this.musyrifManagementService.activate,
                    this.activeStatusUpdate,
                    this.showCommonErrorAlert,
                    emp, active);
            }
        )
       
    }
    render() {
        const props = this.props;
        const emp = this.getEmployee();
        const isMusyrif = emp.user?.hasRole(AuthorityType.musyrif_asrama);
        return (
            <tr key={emp.id} >
                <td>{props.startingNumber + 1}</td>
                <td>{emp.user?.name}</td>
                <td>{emp.user?.email}</td>
                <td>{emp.user?.nip}</td>
                <td>{isMusyrif ? "Yes" : "No"}</td>
                <td> {isMusyrif == true?
                <AnchorWithIcon className="btn btn-danger btn-sm" onClick={(e)=>this.activateMusyrif(false)} >
                    Deactivate
                </AnchorWithIcon>:
                <AnchorWithIcon className="btn btn-success btn-sm" onClick={(e)=>this.activateMusyrif(true)} >
                    Activate
                </AnchorWithIcon>
                }
                </td>
            </tr>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(EmployeeRow))