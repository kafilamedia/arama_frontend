import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import RuleViolation from '../../../models/RuleViolation';
import ClassMemberSearchForm from '../shared/ClassMemberSearchForm';
import BaseEntity from './../../../models/BaseEntity';
import Class from './../../../models/Class';
import Filter from './../../../models/commons/Filter';
import Student from './../../../models/Student';
import { tableHeader } from './../../../utils/CollectionUtil';
import Modal from './../../container/Modal';
import FormGroup from './../../form/FormGroup';
import NavigationButtons from './../../navigation/NavigationButtons';
import BaseManagementPage from './BaseManagementPage';
import EditDeleteButton from './EditDeleteButton';

class State {
  items: RuleViolation[] = [];
  filter: Filter = new Filter();
  totalData: number = 0;
  record: RuleViolation = new RuleViolation();
}

const MODEL_NAME = 'general-broken-rules';
const MENU = 'asrama';

class RuleViolationManagement extends BaseManagementPage {

  state: State = new State();
  constructor(props) {
    super(props, MODEL_NAME, MENU);
    this.state.filter = new Filter();
    this.state.filter.orderBy = 'classMember.student.user.fullName';
  }
  setStudent = (s: Student) => {
    const record = this.state.record;
    record.student = s;
    record.classMemberId = s.id;
    record.classMemberName = s.name;
    record.classLetter = s.classLetter;
    record.classLevel = s.classLevel;
    record.schoolName = s.schoolName;
    this.setState({ record });
  }
  emptyRecord = (): BaseEntity => {
    return new RuleViolation();
  }
  onSubmit = () => {
    if (!this.state.record.classMemberId) {
      this.showError("Input tidak lengkap");
      return;
    }
    this.showConfirmation("Submit Data?")
      .then(ok => {
        if (!ok) return;
        if (this.state.record.id ?? 0 > 0) {
          this.callApiUpdate(this.state.record.id, this.state.record);
        } else {
          this.callApiInsert(this.state.record);
        }
      })
  }
  render() {
    const filter: Filter = this.state.filter;
    return (
      <div className="container-fluid section-body">
        <h2>Pelanggaran Umum</h2>
        <hr />
        <RecordForm formRef={this.formRef} setStudent={this.setStudent} resetForm={this.resetForm} onSubmit={this.onSubmit} record={this.state.record} updateRecordProp={this.updateRecordProp} />
        <form onSubmit={this.reload}>
          <FormGroup label="Cari">
            <input name="name" placeholder="nama pelanggaran" className="form-control-sm" value={filter.fieldsFilter['name'] ?? ""} onChange={this.updateFieldsFilter} />
            <input name="classMember.student.user.fullName" placeholder="nama siswa" className="form-control-sm" value={filter.fieldsFilter['classMember.student.user.fullName'] ?? ""} onChange={this.updateFieldsFilter} />
          </FormGroup>
          <FormGroup label="Jumlah Tampilan">
            <input name="limit" type="number" className="form-control-sm" value={filter.limit ?? 5} onChange={this.updateFilter} />
          </FormGroup>
          <FormGroup>
            <input className="btn btn-primary btn-sm" type="submit" value="Submit" />
          </FormGroup>
        </form>
        <NavigationButtons
          activePage={filter.page ?? 0}
          limit={filter.limit ?? 10}
          totalData={this.state.totalData}
          onClick={this.loadAtPage}
        />
        <ItemsList
          items={this.state.items}
          isAdmin={this.isAdmin()}
          recordLoaded={this.oneRecordLoaded}
          recordDeleted={this.loadItems}
          startingNumber={(filter.page ?? 0) * (filter.limit ?? 10)}
        />
      </div>
    )
  }

}
interface ItemProps { isAdmin: boolean, startingNumber: number, items: RuleViolation[], recordLoaded(item: any), recordDeleted() }
const ItemsList = (props: ItemProps) => {

  return (
    <div style={{ overflow: 'auto' }}>
      <table className="table table-striped">
        {tableHeader("No", "Siswa", "Kelas", "Nama", "Deskripsi", "Poin", "Opsi")}
        <tbody>
          {props.items.map((item: RuleViolation, i) => {

            return (
              <tr key={"category-" + i}>
                <td>{i + 1 + props.startingNumber}</td>
                <td>{item.classMemberName}</td>
                <td>{item.classLevel}{item.classLetter} {item.schoolName}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.point}</td>
                <td>
                  <EditDeleteButton
                    recordLoaded={props.recordLoaded}
                    recordDeleted={props.recordDeleted}
                    record={item}
                    menu={MENU}
                    modelName={MODEL_NAME} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
const RecordForm = (props: { formRef: React.RefObject<Modal>, setStudent(s: Student), updateRecordProp(e: ChangeEvent): any, resetForm(): any, onSubmit(): any, record: RuleViolation }) => {
  const record = props.record;
  return (
    <div className="record-form mb-3" >
      <Modal show={false} ref={props.formRef} toggleable={true} title="Record Form" >
        <FormGroup label="Siswa">
          <ClassMemberSearchForm selectItem={props.setStudent} />
        </FormGroup>
        <FormGroup>
          {record.classMemberName} - {record.classLevel}{record.classLetter} {record.schoolName}
        </FormGroup>
        <form onSubmit={(e) => { e.preventDefault(); props.onSubmit() }}>
          <FormGroup label="Pelanggaran">
            <input required value={record.name} onChange={props.updateRecordProp} className="form-control" name="name" />
          </FormGroup>
          <FormGroup label="Deskripsi">
            <textarea required className="form-control" name="description" onChange={props.updateRecordProp} value={record.description ?? ""} />
          </FormGroup>
          <FormGroup label="Poin">
            <input required className="form-control" name="point" onChange={props.updateRecordProp} value={record.point} />
          </FormGroup>
          <FormGroup>
            <input type="submit" value="Submit" className="btn btn-primary btn-sm" />
            &nbsp;
            <input type="reset" className="btn btn-secondary btn-sm" onClick={(e) => props.resetForm()} />
          </FormGroup>
        </form>
      </Modal>
    </div>
  )
}

export default withRouter(
  connect(
    mapCommonUserStateToProps
  )(RuleViolationManagement)
)