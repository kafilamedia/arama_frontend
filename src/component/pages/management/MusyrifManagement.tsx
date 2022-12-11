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
import { AuthorityType } from '../../../models/AuthorityType';
class State {
  items: Employee[] = [];
  filter: Filter = new Filter();
  totalData: number = 0;
}
class MusyrifManagement extends BaseManagementPage<any, State> {
  state = new State();
  constructor(props) {
    super(props, 'musyrif', 'asrama');
    this.state.filter.limit = 10;
    this.state.filter.orderBy = 'user.fullName';
    this.state.filter.fieldsFilter = {}
  }
  emptyRecord = () => new Employee();
  setMusyrifOnly = (musyrifOnly: boolean) => {
    const filter = this.state.filter;
    if (!filter.fieldsFilter) {
      filter.fieldsFilter = {};
    }
    filter.fieldsFilter['user.authorities.name'] = musyrifOnly ? AuthorityType.ROLE_ASRAMA_MUSYRIF : AuthorityType.ROLE_EMPLOYEE;
    this.setState({ filter: filter }, () => this.loadAtPage(0))
  }
  onEmployeeStatusUpdate = () => {
    this.loadItems();
  }
  render() {
    const { filter } = this.state;
    const musyrifOnly = filter?.fieldsFilter && filter.fieldsFilter['user.authorities.name'] === AuthorityType.ROLE_ASRAMA_MUSYRIF;
    return (
      <div className="section-body container-fluid">
        <h2>Musyrif</h2>
        <hr />
        <form onSubmit={this.reload}>
          <FormGroup label="Cari">
            <input name="user.fullName" placeholder="Nama" className="form-control-sm" value={filter.fieldsFilter ? filter.fieldsFilter['user.fullName'] : ''} onChange={this.updateFieldsFilter} />
          </FormGroup>
          <FormGroup label="Jumlah Tampilan">
            <input name="limit" type="number" className="form-control-sm" value={filter.limit ?? 5} onChange={this.updateFilter} />
          </FormGroup>
          <FormGroup label="Opsi">
            <ToggleButton active={musyrifOnly} onClick={this.setMusyrifOnly} noLabel="Semua pegawai" yesLabel="Hanya musyrif" />
          </FormGroup>
          <FormGroup>
            <input className="btn btn-primary btn-sm" type="submit" value="Submit" />
          </FormGroup>
        </form>
        <NavigationButtons activePage={filter.page ?? 0} limit={filter.limit ?? 5} totalData={this.state.totalData}
          onClick={this.loadAtPage} />
        <EmployeeList onUpdated={this.onEmployeeStatusUpdate} startingNumber={(filter.page ?? 0) * (filter.limit ?? 5)} items={this.state.items} />
      </div>
    )
  }

}
const EmployeeList = (props: { onUpdated: () => void, startingNumber: number, items: Employee[] }) => {
  const items = props.items;
  return (
    <div className="container-fluid" style={{ overflow: 'auto' }}>
      <table className="table table-striped" >
        {tableHeader("No", "Nama", "Email", "NIP", "Role: Musyrif", "Opsi")}
        <tbody>
          {items.map((emp, i) => {
            if (emp.user) {
              emp.user = User.clone(emp.user);
            }
            return (
              <EmployeeRow onUpdated={props.onUpdated} employee={emp} startingNumber={props.startingNumber + i} key={emp.id} />
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