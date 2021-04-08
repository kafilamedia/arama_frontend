import React, { ChangeEvent, Component, FormEvent } from 'react'
import BaseComponent from './../../../BaseComponent';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import MedicalRecord from './../../../../models/MedicalRecord';
import StudentService from './../../../../services/StudentService';
import WebResponse from './../../../../models/commons/WebResponse';
class State {
    record: MedicalRecord = new MedicalRecord();
}
class MedicalRecordDailyInput extends BaseComponent {
    state: State = new State();
    studentService:StudentService;
    constructor(props) {
        super(props, true);
        this.studentService = this.getServices().studentService;
        this.state.record = MedicalRecord.instance(props.student.id, props.day, props.month, props.year);
    }
    reset = () => {
        const props = this.props;
        this.setState({record:  MedicalRecord.instance(props.student.id, props.day, props.month, props.year)});
    }
    setRecord = (record:MedicalRecord) => {
        this.setState({record: MedicalRecord.clone(record)});
    }

    onChange = (e: ChangeEvent) => {
        const record = this.state.record;
        const target = e.target as HTMLInputElement;
        record[target.name] = target.type == 'checkbox' ? target.checked : target.value;
        this.setState({ record: MedicalRecord.clone(record) });
    }

    recordSubmitted = (response:WebResponse) => {
        this.showInfo("Data has been submitted");
    }

    onSubmit = (e:FormEvent) => {
        e.preventDefault();
        const record:MedicalRecord =  this.state.record;
        record.student_id = this.props.student.id;
        this.commonAjax(
            this.studentService.submitMedicalRecord,
            this.recordSubmitted,
            this.showCommonErrorAlert,
            record
        )
    }

    render() {
        const props = this.props;
        const record = this.state.record;
        return (
            <form onSubmit={this.onSubmit}>
                <table className="table table-bordered table-striped" style={{ fontSize: '0.8em' }}>
                    <tbody>
                        <SingleRow><p className='text-center'> {record.day}/{record.month}</p></SingleRow>
                        <SingleRow>
                            <input type='number' onChange={this.onChange} className="form-control" name="temperature_morning" value={record.temperature_morning ?? ""} />
                        </SingleRow>
                        <SingleRow>
                            <input type='number' onChange={this.onChange} className="form-control" name="temperature_afternoon" value={record.temperature_afternoon ?? ""} />
                        </SingleRow>
                        <SingleRow>
                            <input style={{ marginRight: 5 }} onChange={this.onChange} type="checkbox" name="breakfast" checked={record.breakfast ?? false} />
                            {record.breakfast ? "yes" : "no"}
                        </SingleRow>
                        <SingleRow>
                            <input style={{ marginRight: 5 }} onChange={this.onChange} type="checkbox" name="lunch" checked={record.lunch ?? false} />
                            {record.lunch ? "yes" : "no"}
                        </SingleRow>
                        <SingleRow>
                            <input style={{ marginRight: 5 }} onChange={this.onChange} type="checkbox" name="dinner" checked={record.dinner ?? false} />
                            {record.dinner ? "yes" : "no"}
                        </SingleRow>
                        <SingleRow>
                            <input style={{ marginRight: 5 }} onChange={this.onChange} type="checkbox" name="medicine_consumption" checked={record.medicine_consumption ?? false} />
                            {record.medicine_consumption ? "yes" : "no"}
                        </SingleRow>
                        <SingleRow>
                            <input style={{ marginRight: 5 }} onChange={this.onChange} type="checkbox" name="genose_test" checked={record.genose_test ?? false} />
                            {record.genose_test ? "yes" : "no"}
                        </SingleRow>
                        <SingleRow>
                            <input style={{ marginRight: 5 }} onChange={this.onChange} type="checkbox" name="antigen_test" checked={record.antigen_test ?? false} />
                            {record.antigen_test ? "yes" : "no"}
                        </SingleRow>
                        <SingleRow>
                            <input style={{ marginRight: 5 }} onChange={this.onChange} type="checkbox" name="pcr_test" checked={record.pcr_test ?? false} />
                            {record.pcr_test ? "yes" : "no"}
                        </SingleRow>
                        <SingleRow>
                            <input onChange={this.onChange} type="text" name="description" value={record.description ?? ""} className="form-control" />
                        </SingleRow>
                        <SingleRow>
                            <button className="btn btn-success" type="submit">
                                <i className="fas fa-save" />
                            </button>
                            <br/>
                            <p className='text-center'> {record.day}/{record.month}</p>
                        </SingleRow>
                    </tbody>
                </table>
            </form>
        )
    }
}


const SingleRow = (props: { children: any }) => {
    return (
        <tr><td>
            <div className="text-center" style={{minHeight:40}}>{props.children}</div></td></tr>
    )
}

export default 
   connect(
        mapCommonUserStateToProps, null, null,    { forwardRef: true }
    )(MedicalRecordDailyInput)
