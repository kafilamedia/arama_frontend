import React from 'react';
import { resolve } from 'inversify-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AuthorityType } from '../../../models/AuthorityType';
import WebResponse from '../../../models/commons/WebResponse';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Employee from './../../../models/Employee';
import MusyrifManagementService from './../../../services/MusyrifManagementService';
import BaseComponent from './../../BaseComponent';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';

class EmployeeRow extends BaseComponent {
  @resolve(MusyrifManagementService)
  private musyrifManagementService: MusyrifManagementService;
  constructor(props) {
    super(props, true);
  }

  getEmployee = () => this.props.employee as Employee;
  activeStatusUpdate = (response: WebResponse) => {
    // this.showInfo("Success");
    if (this.props.onUpdated) {
      this.props.onUpdated();
    }
  }
  activateMusyrif = (active: boolean) => {
    const emp = this.getEmployee();
    this.commonAjax(
      this.musyrifManagementService.activate,
      this.activeStatusUpdate,
      this.showCommonErrorAlert,
      emp, active);

  }
  render() {
    const { props } = this;
    const emp = this.getEmployee();
    const isMusyrif = emp.user?.hasRole(AuthorityType.ROLE_ASRAMA_MUSYRIF);
    return (
      <tr key={emp.id} >
        <td>{props.startingNumber + 1}</td>
        <td>{emp.user?.fullName}</td>
        <td>{emp.user?.email}</td>
        <td>{emp.nisdm}</td>
        <td><i className={isMusyrif ? "fas fa-check text-success" : "fas fa-times"} /></td>
        <td> {isMusyrif == true ?
          <AnchorWithIcon className="btn btn-danger btn-sm" onClick={(e) => this.activateMusyrif(false)} >
            Nonaktifkan
          </AnchorWithIcon> :
          <AnchorWithIcon className="btn btn-success btn-sm" onClick={(e) => this.activateMusyrif(true)} >
            Jadikan musyrif
          </AnchorWithIcon>
        }
        </td>
      </tr>
    )
  }
}

export default withRouter(connect(mapCommonUserStateToProps)(EmployeeRow))