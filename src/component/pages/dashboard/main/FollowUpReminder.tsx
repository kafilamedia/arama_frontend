import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import BasePage from './../../BasePage';
import StudentService from './../../../../services/StudentService';
import Student from './../../../../models/Student';
import { tableHeader } from './../../../../utils/CollectionUtil';
import WebResponse from './../../../../models/commons/WebResponse';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import { resolve } from 'inversify-react';

interface FollowUpInfo {
  student: Student,
  TOTAL_POINT: any,
  FOLLOW_UP_COUNT: number,
}
class State {
  followUpInfos: FollowUpInfo[] = [];
}
class FollowUpReminder extends BasePage<any, State> {
  state = new State();
  @resolve(StudentService)
  private studentService: StudentService;
  constructor(props) {
    super(props, "Follow Up Pelanggaran", true);
  }
  componentReady() {
    this.loadReminder();
  }
  loadReminder = () => {
    this.commonAjax(
      this.studentService.getFollowUpReminders,
      this.recordsLoaded,
      console.error
    )
  }
  recordsLoaded = (resp: WebResponse) => {
    this.setState({ followUpInfos: resp.result.items });
  }

  render() {

    return (
      <div className="section-body container-fluid">
        <h2>Follow Up Pelanggaran</h2>
        <p>Pelanggaran dengan poin di bawah {this.getApplicationProfile().warningPointLimit}</p>
        <AnchorWithIcon iconClassName="fas fa-redo" onClick={this.loadReminder} children="Reload" />
        <table className="table">
          {tableHeader("No", "Siswa", "Kelas", "Poin", "Penanganan", "Opsi")}
          <tbody>
            {this.state.followUpInfos.map((info, i) => {
              const { student } = info;
              return (
                <tr key={`f-i-${i}`}>
                  <td>{i + 1}</td>
                  <td>{info.student.user?.fullName}</td>
                  <td>{student.classLevel}{student.classLetter} {student.schoolName}</td>
                  <td>{info.TOTAL_POINT}</td>
                  <td>{info.FOLLOW_UP_COUNT}</td>
                  <td>
                    <a className="btn btn-info btn-sm" >
                      Follow Up
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default withRouter(
  connect(
    mapCommonUserStateToProps
  )(FollowUpReminder)
)