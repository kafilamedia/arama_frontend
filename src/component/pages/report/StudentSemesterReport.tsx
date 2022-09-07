import React from 'react'
import BasePage from './../BasePage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import StudentService from './../../../services/StudentService';
import Class from './../../../models/Class';
import WebResponse from './../../../models/commons/WebResponse';
import FormGroup from '../../form/FormGroup';
import AttachmentInfo from './../../../models/settings/AttachmentInfo';
import { tableHeader } from './../../../utils/CollectionUtil';
import { contextPath } from './../../../constant/Url';
import StudentReportSummary from './StudentReportSummary';
import './StudentSemesterReport.scss';

class State {
  classes: Class[] = [];
  items: StudentReportSummary[] = [];
}

class StudentSemesterReport extends BasePage {
  state: State = new State();
  private studentService: StudentService;
  selectClassRef = React.createRef<HTMLSelectElement>();
  constructor(props) {
    super(props, "Rapor Semester", true);
    this.studentService = this.getServices().studentService;
  }

  componentReady() {
    this.commonAjax(
      this.studentService.getClasses,
      this.classesLoaded,
      this.showCommonErrorAlert
    );
  }

  loadRaporData = (e: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!this.selectClassRef.current) {
      return;
    }
    const { value: classId } = this.selectClassRef.current;
    this.commonAjax(
      this.studentService.getRaporData,
      this.raporDataLoaded,
      this.showCommonErrorAlert,
      classId
    )
  }
  downloadData = () => {
    if (!this.selectClassRef.current) {
      return;
    }
    const { value: classId } = this.selectClassRef.current;
    this.commonAjax(
      this.studentService.downloadRaporData,
      this.reportCreated,
      this.showCommonErrorAlert,
      classId
    )
  }
  downloadRapor = () => {
    if (!this.selectClassRef.current) {
      return;
    }
    const { value: classId } = this.selectClassRef.current;
    window.open(contextPath(`pages/asrama/report/${classId}`));
  }

  reportCreated = (attachment: AttachmentInfo) => {
    this.showConfirmation(`Save File ${attachment.name}?`)
      .then((ok) => {
        if (!ok) return;
        Object.assign(document.createElement('a'), {
          target: '_blank',
          download: attachment.name,
          style: { display: 'none' },
          href: attachment.url,
        }).click();
      })

  }

  classesLoaded = (response: WebResponse) => {
    this.setState({ classes: response.result });
  }
  raporDataLoaded = (response: WebResponse) => {
    this.setState({ items: response.result });
  }
  get reportHeader() {
    const headers = ['No', 'Siswa', 'Kelas']
    const { items } = this.state;
    if (items.length == 0) return [];

    items[0].categories.forEach((cat) => {
      headers.push(cat.name);
      headers.push("Predikat");
      headers.push("Keterangan");
    });
    return headers;
  }
  render() {
    const { classes, items } = this.state;

    return (
      <div className="container-fluid section-body">
        <h2>{this.title}</h2>
        <form onSubmit={this.loadRaporData} className="mt-5">
          <FormGroup label="Kelas">
            <select ref={this.selectClassRef} className="form-control">
              {classes.map((c) => {
                const { level, letter, id, schoolName } = c;
                return <option key={`rapor_class_${id}`} value={id}>{level}{letter} {schoolName}</option>
              })}
            </select>
          </FormGroup>
          <FormGroup>
            <input type="submit" className="btn btn-success" value="Load Data" />
            <a className="btn btn-link ml-2" onClick={this.downloadData} >Download Detail Data</a>
            <a className="btn btn-link ml-2" onClick={this.downloadRapor} >Download Rapor</a>
          </FormGroup>
        </form>
        {
          items.length == 0 ?
            <div className="alert alert-warning">Tidak ada data</div> :
            <div className="mt-5 bg-white border border-secondary" style={{ overflow: 'auto' }}>
              <table id="table-report-summary" className="table table-striped">
                {tableHeader(...this.reportHeader)}
                <tbody>
                  {items.map((item, i) => {
                    const { classMember, categories } = item;
                    return (
                      <tr key={`report_sum_${classMember.id}`} >
                        <td>{i + 1}</td>
                        <td>{classMember.name}</td>
                        <td>{classMember.classLevel}{classMember.classLetter}</td>
                        {categories.map((c) => {
                          return (
                            <React.Fragment key={`cat_items_${c.categoryId}_${classMember.id}`}>
                              <td>{c.score}</td>
                              <td children={c.predicateLetter} />
                              <td children={c.predicateDescription} />
                            </React.Fragment>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
        }
      </div>
    )
  }
}

export default withRouter(
  connect(
    mapCommonUserStateToProps
  )(StudentSemesterReport)
)