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
import { getInputReadableDate, MONTHS } from '../../../utils/DateUtil';
import ToggleButton from '../../navigation/ToggleButton';
import BaseComponent from './../../BaseComponent';
class State {
  items: Student[] = [];
  classes: Class[] = [];
  totalData = 0;
  filter = new Filter();
  loading = false;
}
const now = new Date();
const defaultFieldsFilter = {
  'classLevel.id=': '',
  'with_point_record': 'false',
  'time>=d': getInputReadableDate(new Date(now.getFullYear(), 0, 1)),
  'time<=d': getInputReadableDate(now)
};
class StudentList extends BaseComponent {
  readonly state: State = new State();
  readonly studentService: StudentService;
  constructor(props) {
    super(props);
    this.studentService = this.getServices().studentService;
    this.state.filter.limit = 10;
    this.state.filter.orderBy = 'student.user.fullName';
    this.state.filter.fieldsFilter = defaultFieldsFilter;
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
  updatePeriodFilter = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: 'time<=d' | 'time>=d') => {
    const { filter } = this.state;
    Filter.updatePeriodFilter(filter, e, field);
    this.setState({ filter });
  }
  updateFieldFilter = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { filter } = this.state;
    filter.fieldsFilter[e.target.name] = e.target.value;
    this.setState({ filter });
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
  updateWithPointRecord = (enable: boolean) => {
    const { filter } = this.state;
    filter.fieldsFilter['with_point_record'] = `${enable}`;
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
    const { fieldsFilter } = filter;
    const defaultClass = { id: '', level: 'Semua Kelas' } as Class;
    const selectedClassId = fieldsFilter['classLevel.id='] ?? '';
    const showPointRecord = fieldsFilter['with_point_record'] === `${true}`;
    return (
      <div className="container-fluid section-body">
        <h2>Siswa</h2>
        <hr />
        <form onSubmit={this.onSubmit}>
          <FormGroup label="Cari">
            <div className="input-group">
              <input
                name="student.user.fullName"
                placeholder="Nama"
                className="form-control-sm"
                value={fieldsFilter['student.user.fullName'] ?? ''}
                onChange={this.updateFieldFilter}
              />
              <select
                value={selectedClassId}
                onChange={this.updateFieldFilter}
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
              yesLabel="tampilkan poin"
              noLabel="tanpa poin"
              onClick={this.updateWithPointRecord}
            />
            {
              showPointRecord &&
              <React.Fragment>
                <div className="input-group">
                  <FilterPeriod date={new Date(fieldsFilter['time>=d'])} onChange={(e) => this.updatePeriodFilter(e, 'time>=d')} />
                </div>
                <div className="input-group">
                  <FilterPeriod date={new Date(fieldsFilter['time<=d'])} onChange={(e) => this.updatePeriodFilter(e, 'time<=d')} />
                </div>
              </React.Fragment>
            }
          </FormGroup>
          {
            showPointRecord &&
            <FormGroup>
              {new Date(fieldsFilter['time>=d']).toDateString()} - {new Date(fieldsFilter['time<=d']).toDateString()}
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
