import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import StudentForm from './StudentForm';
import Student from '../../../../models/Student';
import FilterPeriod from '../../../form/FilterPeriod';
import Filter from '../../../../models/commons/Filter';
import { getMonthDays } from '../../../../utils/DateUtil';
import Card from '../../../container/Card';
import MedicalRecord from '../../../../models/MedicalRecord';
import MedicalRecordDailyInput from './MedicalRecordDailyInput';
import StudentService from '../../../../services/StudentService';
import WebResponse from '../../../../models/commons/WebResponse';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import { doItLater } from '../../../../utils/EventUtil';
import BasePage from '../../BasePage';
import { resolve } from 'inversify-react';
import SimpleError from '../../../alert/SimpleError';
class State {
  student?: Student;
  month: number = new Date().getMonth() + 1;
  year: number = new Date().getFullYear();
  mappedItems: Map<number, MedicalRecord> = new Map()
}
class MedicalRecordForm extends BasePage<any, State> {
  state = new State();
  @resolve(StudentService)
  private studentService: StudentService;
  private inputRefs: Map<number, any> = new Map();
  constructor(props) {
    super(props, "Medical Record", true);
  }
  setStudent = (student: Student | undefined) => {
    if (student) {
      student = Object.assign(new Student(), student);
    }
    this.setState({ student: student }, this.loadMonthlyRecord);
  }
  validateStudentData = () => {
    const student = this.props.location.state ? this.props.location.state.student : undefined;
    if (student) {
      this.setStudent(student);
    }
  }

  reset = () => {
    doItLater(() => {
      if (this.state.student)
        this.inputRefs.forEach((ref: any, day: number) => {
          if (ref) { ref.reset(); }
        })
    }, 100);
  }
  recordsLoaded = (response: WebResponse) => {

    const mappedItems: Map<number, MedicalRecord> = this.toMap(response.items);

    this.setState({ mappedItems }, () => {
      doItLater(() => {
        this.inputRefs.forEach((ref: any, day: number) => {
          let record = mappedItems.get(day);
          if (!record) {
            record = MedicalRecord.instance(this.state.student?.id ?? 0, day, this.state.month, this.state.year);
          } else {
            record = MedicalRecord.clone(record);
          }
          if (ref) {
            ref.setRecord(record);
          }
        })
      }, 100);
    });
  }


  toMap = (items: MedicalRecord[]) => {
    const map = new Map<number, MedicalRecord>();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      map.set(item.day, item);
    }
    return map;
  }

  loadMonthlyRecord = () => {
    this.commonAjax(
      this.studentService.loadMonthlyMedicalRecord,
      this.recordsLoaded, this.showCommonErrorAlert,
      this.state.student?.id, this.state.month, this.state.year
    )
  }

  getFilter = (): Filter => {
    const f = new Filter();
    // f.month = this.state.month;
    // f.year = this.state.year;
    return f;
  }

  componentDidMount() {
    this.validateLoginStatus(() => {
      this.scrollTop();
      this.validateStudentData();
    });
  }
  dayCount = () => {
    return getMonthDays(this.state.month, this.state.year);
  }
  render() {
    const student = this.state.student;
    const filter = this.getFilter();
    const dayCount = this.dayCount();
    const days: number[] = [];
    for (let i = 1; i <= dayCount; i++) {
      days.push(i);
    }
    const gridTemplateColumns = ('150px ').repeat(dayCount);

    return (
      <div className="container-fluid section-body">
        <h2> {student ? student.user?.fullName : this.title}</h2>
        <hr />
        <StudentForm setItem={this.setStudent} />
        <p />
        {student ?
          <Card>
            <div className="input-group">
              <FilterPeriod date={new Date()} disableDay onChange={this.handleInputChange} />
              <div className="input-group-append">
                <AnchorWithIcon iconClassName="fas fa-redo" onClick={this.loadMonthlyRecord}>Load Data</AnchorWithIcon>
              </div>
            </div>
            <hr />
            <div className="container-fluid  row">
              <div className="col-12" style={{ overflow: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>

                  {days.map(day =>
                    <MedicalRecordDailyInput key={"record-input-" + day} student={student}
                      ref={ref => { this.inputRefs.set(day, ref) }}
                      year={this.state.year}
                      month={this.state.month} day={day} />)}
                </div>
              </div>
            </div>
          </Card>
          : <Warning />}
      </div>
    )
  }

}


const Warning = () => {
  return (<SimpleError>
    <i className="fas fa-exclamation-circle mr-2" /><span>Please select student</span><hr />
    <AnchorWithIcon to={"/asrama/studentlist"} iconClassName="fas fa-list">Student List</AnchorWithIcon>
  </SimpleError>)
}

export default withRouter(
  connect(
    mapCommonUserStateToProps
  )(MedicalRecordForm)
)