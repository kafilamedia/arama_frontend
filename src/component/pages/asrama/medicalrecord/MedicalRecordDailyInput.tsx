import React, { ChangeEvent, Component, FormEvent } from 'react'
import BaseComponent from '../../../BaseComponent';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import MedicalRecord from '../../../../models/MedicalRecord';
import StudentService from '../../../../services/StudentService';
import WebResponse from '../../../../models/commons/WebResponse';
import { twoDigits, monthName } from '../../../../utils/StringUtil';
import { resolve } from 'inversify-react';

class State {
  record: MedicalRecord = new MedicalRecord();
}
class MedicalRecordDailyInput extends BaseComponent<any, State> {
  state = new State();
  @resolve(StudentService)
  private studentService: StudentService;
  constructor(props) {
    super(props, true);
    this.state.record = MedicalRecord.instance(props.student.id, props.day, props.month, props.year);
  }
  reset = () => {
    const props = this.props;
    this.setState({ record: MedicalRecord.instance(props.student.id, props.day, props.month, props.year) });
  }
  setRecord = (record: MedicalRecord) => {
    this.setState({ record: MedicalRecord.clone(record) });
  }

  onChange = (e: ChangeEvent) => {
    const record = this.state.record;
    const target = e.target as HTMLInputElement;
    record[target.name] = target.type == 'checkbox' ? target.checked : target.value;
    this.setState({ record: MedicalRecord.clone(record) });
  }

  recordSubmitted = (response: WebResponse) => {
    this.showInfo("Data has been submitted");
  }

  onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const record: MedicalRecord = this.state.record;
    record.student_id = this.props.student.id;
    this.commonAjax(
      this.studentService.submitMedicalRecord,
      this.recordSubmitted,
      this.showCommonErrorAlert,
      record
    )
  }

  render() {
    const record = this.state.record;
    const period = twoDigits(record.day) + " " + monthName(record.month - 1);
    return (
      <form onSubmit={this.onSubmit}>
        <table className="table table-bordered table-striped" style={{ fontSize: '0.8em' }}>
          <tbody>
            <SingleRow><h5 className='text-center'> {period}</h5></SingleRow>
            <SingleRow>
              <input type='number' onChange={this.onChange} placeholder="Suhu Pagi" className="form-control" name="temperature_morning" value={record.temperature_morning ?? ""} />
            </SingleRow>
            <SingleRow>
              <input type='number' onChange={this.onChange} placeholder="Suhu Sore" className="form-control" name="temperature_afternoon" value={record.temperature_afternoon ?? ""} />
            </SingleRow>
            <SingleRow>
              <Checkbox label="Sarapan" onChange={this.onChange} name="breakfast" checked={record.breakfast ?? false} />
            </SingleRow>
            <SingleRow>
              <Checkbox label="Makan Siang" onChange={this.onChange} name="lunch" checked={record.lunch ?? false} />
            </SingleRow>
            <SingleRow>
              <Checkbox label="Makan Malam" onChange={this.onChange} name="dinner" checked={record.dinner ?? false} />
            </SingleRow>
            <SingleRow>
              <Checkbox label="Konsumsi Obat" onChange={this.onChange} name="medicine_consumption" checked={record.medicine_consumption ?? false} />
            </SingleRow>
            <SingleRow>
              <Checkbox label="Tes Genose" onChange={this.onChange} name="genose_test" checked={record.genose_test ?? false} />
            </SingleRow>
            <SingleRow>
              <Checkbox label="Tes Antigen" onChange={this.onChange} name="antigen_test" checked={record.antigen_test ?? false} />
            </SingleRow>
            <SingleRow>
              <Checkbox label="Tes PCR" onChange={this.onChange} name="pcr_test" checked={record.pcr_test ?? false} />
            </SingleRow>
            <SingleRow>
              <textarea placeholder="Catatan" onChange={this.onChange} style={{ fontSize: '0.9em' }} name="description" value={record.description ?? ""}
                className="form-control" rows={3} />
            </SingleRow>
            <SingleRow>
              <button className="btn btn-success" type="submit">
                <i className="fas fa-save" /> {period}
              </button>
            </SingleRow>
          </tbody>
        </table>
      </form>
    )
  }
}

const Checkbox = (props: { onChange(e: ChangeEvent): any, label: string, name: string, checked: boolean }) => {

  return (
    <>{props.label}
      <input type="checkbox" style={{ marginRight: 5 }} className="form-control"
        onChange={props.onChange}
        name={props.name}
        checked={props.checked} />
    </>
  )
}
const SingleRow = (props: { children: any }) => {
  return (
    <tr><td>
      <div className="text-center" style={{ minHeight: 40 }}>{props.children}</div></td></tr>
  )
}

export default
  connect(
    mapCommonUserStateToProps, null, null, { forwardRef: true }
  )(MedicalRecordDailyInput)
