import React, { ChangeEvent } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import Student from '../../../models/Student';
import StudentService from '../../../services/StudentService';
import Filter from '../../../models/commons/Filter';
import WebResponse from '../../../models/commons/WebResponse';
import Class from '../../../models/Class';
import FormGroup from '../../form/FormGroup';
import NavigationButtons from '../../navigation/NavigationButtons';
import { tableHeader } from '../../../utils/CollectionUtil';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import MasterDataService from '../../../services/MasterDataService';
import BaseManagementPage from '../management/BaseManagementPage';
import Spinner from '../../loader/Spinner';
import FilterPeriod from '../../form/FilterPeriod';
import { MONTHS } from '../../../utils/DateUtil';
import ToggleButton from '../../navigation/ToggleButton';
import BaseComponent from './../../BaseComponent';
class State {
  items: Student[] = [];
  classes: Class[] = [];
  totalData: number = 0;
  filter: Filter = new Filter();
  loading: boolean = false;
}
class StudentList extends BaseComponent {
  readonly state: State = new State();
  readonly studentService: StudentService;
  constructor(props) {
    super(props);
    this.studentService = this.getServices().studentService;
    this.state.filter.limit = 10;
    this.state.filter.day = this.state.filter.dayTo = new Date().getDate();
    this.state.filter.month = this.state.filter.monthTo = new Date().getMonth() + 1;
    this.state.filter.year = this.state.filter.yearTo = new Date().getFullYear();
    this.state.filter.orderBy = 'student.user.fullName';
    this.state.filter.fieldsFilter = {
      'classLevel.id=': '',
      'with_point_record': false
    }
  }
  itemsLoaded = (response: WebResponse) => {
    this.setState({ items: response.result.items, totalData: response.result.totalData });
  }
  classesLoaded = (response: WebResponse) => {
    this.setState({ classes: response.result }, this.loadItems);
  }
  loadItems = () => {
    this.commonAjax(
      this.studentService.getStudentWithPoints,
      this.itemsLoaded,
      this.showCommonErrorAlert,
      this.state.filter
    )
  }
  loadAtPage = (page: number) => {
    const { filter } = this.state;
    filter.page = page;
    this.setState({ filter }, this.loadItems);
  }
  loadClasses = () => {
    this.commonAjax(
      this.studentService.getClasses,
      this.classesLoaded,
      this.showCommonErrorAlert,
    )
  }
  componentDidMount() {
    this.validateLoginStatus(() => {
      this.scrollTop();
      this.loadClasses();
    })
  }
  updateFieldsFilter = (e: ChangeEvent<any>) => {
    const { filter } = this.state;
    const { target } = e;
    if (!filter.fieldsFilter) {
      filter.fieldsFilter = {};
    }
    filter.fieldsFilter[target.name] = target.value;
    this.setState({ filter })
  }
  updateSelectedClass = (e: ChangeEvent) => {
    const target = e.target as HTMLSelectElement;
    const { filter } = this.state;
    if (!filter.fieldsFilter) {
      filter.fieldsFilter = {};
    }
    filter.fieldsFilter['classLevel.id='] = target.value;
    this.setState({ filter });
  }
  inputPage = (type: string, s: Student) => {
    switch (type) {
      case 'pointrecord':
        this.inputPoint(s);
        break;
      default:
        break;
    }
  }
  inputPoint = (student: Student) => {
    this.props.history.push({
      pathname: "/asrama/inputpoint",
      state: { student }
    })
  }
  updateWithPointRecord = (val: boolean) => {
    const { filter } = this.state;
    if (filter.fieldsFilter) {
      filter.fieldsFilter['with_point_record'] = val;
    }
    this.setState({ filter });
  }
  updateFilter = (e: ChangeEvent<any>) => {
    const { filter } = this.state;
    const { target } = e;
    if (!target.value || target.value == "") {
      return;
    }
    let value: any;
    if (target.type == 'number' || (target.dataset && target.dataset['type'] == 'number')) {
      value = parseInt(target.value);
    } else {
      value = target.value;
    }
    filter[target.name] = value;
    this.setState({ filter })
  }
  onSubmit = (e) => { e.preventDefault(); this.loadAtPage(0) }
  render() {
    const { filter, classes, loading, totalData } = this.state;
    const defaultClass = { id: '', level: 'Semua Kelas' } as Class;
    const selectedClassId = filter.fieldsFilter && filter.fieldsFilter['classLevel.id='] ? filter.fieldsFilter['classLevel.id='] : "";
    const showPointRecord = filter.fieldsFilter && filter.fieldsFilter['with_point_record'] && filter.fieldsFilter['with_point_record'] == true;
    return (
      <div className="container-fluid section-body">
        <h2>Siswa</h2>
        <hr />
        <form onSubmit={this.onSubmit}>
          <FormGroup label="Cari">
            <div className="input-group">
              <input name="student.user.fullName" placeholder="Nama" className="form-control-sm" value={filter.fieldsFilter ? filter.fieldsFilter['student.user.fullName'] : ''} onChange={this.updateFieldsFilter} />
              <select
                value={selectedClassId}
                onChange={this.updateFieldsFilter}
                className="form-control-sm"
                name="classLevel.id="
              >
                {[defaultClass, ...classes].map((c) => {
                  return <option key={`class_${c.id}`} value={c.id}>{c.level}{c.letter} - {c.schoolName}</option>
                })}
              </select>
            </div>
          </FormGroup>
          <FormGroup label="Jumlah Tampilan">
            <input
              name="limit"
              type="number"
              className="form-control-sm"
              value={filter.limit ?? 5}
              onChange={this.updateFilter}
            />
          </FormGroup>
          <FormGroup label="Periode">
            <ToggleButton
              active={showPointRecord}
              yesLabel={"tampilkan poin"}
              noLabel="tanpa poin"
              onClick={this.updateWithPointRecord}
            />
            {
              showPointRecord &&
              <React.Fragment>
                <div className="input-group">
                  <FilterPeriod filter={filter} onChange={this.updateFilter} />
                </div>
                <div className="input-group">
                  <FilterPeriod mode={"to"} filter={filter} onChange={this.updateFilter} />
                </div>
              </React.Fragment>
            }
          </FormGroup>
          {
            showPointRecord &&
            <FormGroup>
              {filter.day} {MONTHS[(filter.month ?? 1) - 1]} {filter.year} - {filter.dayTo} {MONTHS[(filter.monthTo ?? 1) - 1]} {filter.yearTo}
            </FormGroup>
          }
          <FormGroup>
            <input type="submit" className="btn btn-primary btn-sm" value="Submit" />
          </FormGroup>

        </form>
        <p />
        <NavigationButtons onClick={this.loadAtPage} activePage={filter.page ?? 0} limit={filter.limit ?? 10} totalData={totalData} />
        <ItemsList showPointRecord={showPointRecord} loading={loading} inputPage={this.inputPage} startingNumber={(filter.page ?? 0) * (filter.limit ?? 10)} items={this.state.items} />
      </div>
    )
  }
}

const ItemsList = (props: { showPointRecord: boolean, loading: boolean, startingNumber: number, inputPage(type: string, s: Student): any, items: Student[] }) => {

  return (
    <div style={{ overflow: 'auto' }}>
      <table className="table table-striped">
        {props.showPointRecord ? tableHeader("No", "", "Name", "Kelas", "Point") : tableHeader("No", "", "Name", "Kelas")}
        <tbody>
          {props.loading ?
            <tr>
              <td colSpan={5}><Spinner /></td>
            </tr>

            : props.items.map((student, i) => {
              return (
                <tr key={student.id}>
                  <td>{i + 1 + props.startingNumber}</td>
                  <td>
                    <div style={{ width: '100px' }}>
                      <AnchorWithIcon className="btn" onClick={(e) => props.inputPage('pointrecord', student)} iconClassName="far fa-edit" />
                      {/* <AnchorWithIcon className="btn" onClick={(e) => props.inputPage('medicalrecord', student)} iconClassName="fas fa-notes-medical" /> */}
                    </div>
                  </td>
                  <td>
                    {student.name}
                  </td>
                  <td>
                    {student.classLevel}{student.classLetter} {student.schoolName}
                  </td>
                  {props.showPointRecord && <td>{student.point}</td>}
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

export default withRouter(connect(
  mapCommonUserStateToProps
)(StudentList));
