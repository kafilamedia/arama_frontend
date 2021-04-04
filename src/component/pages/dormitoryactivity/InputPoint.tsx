
import React from 'react'
import BaseComponent from '../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import Student from '../../../models/Student';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import Modal from '../../container/Modal';
import MasterDataService from '../../../services/MasterDataService';
import FormStepThree from './form/FormStepThree';
import FormStepTwo from './form/FormStepTwo';
import FormStepOne from './form/FormStepOne';
import Category from '../../../models/Category';
import RulePoint from '../../../models/RulePoint';
import SimpleError from '../../alert/SimpleError';
import PointRecord from '../../../models/PointRecord';
import StudentService from '../../../services/StudentService';
import WebResponse from '../../../models/commons/WebResponse';
import FormGroup from '../../form/FormGroup';
import { parseDate } from '../../../utils/DateUtil';
class State {
    student?: Student
    category?: Category;
    rulePoint?: RulePoint;
    formStep: number = 1;
    savedRecord?: PointRecord
}
class InputPoint extends BaseComponent {
    state: State = new State();
    studentService: StudentService;
    totalStep: number = 4;
    constructor(props) {
        super(props, true);
        this.studentService = this.getServices().studentService;
    }
    validateStudentData = () => {
        if (!this.props.location.state) {
            return;
        }
        const student = this.props.location.state.student;

        if (student) {
            this.setState({ student: Object.assign(new Student(), student) });
        }
    }
    componentDidMount() {
        super.componentDidMount();
        this.validateStudentData();
    }
    setCategory = (c: Category) => {
        this.setState({ category: c });
    }
    setRulePoint = (r: RulePoint) => {
        this.setState({ rulePoint: r });
    }
    nextStep = (step: number) => {
        this.setState({ formStep: step });
    }
    submitRecord = (record: PointRecord) => {
        console.debug("RECORD: ", record);
        if (!this.state.student || !this.state.rulePoint) {
            alert("ERROR: student or rulePoint missing!");
            return;
        }
        record.student_id = this.state.student?.id;
        record.point_id = this.state.rulePoint?.id;
        this.commonAjax(
            this.studentService.submitPointRecord,
            this.recordSubmitted,
            this.showCommonErrorAlert,
            record
        )
    }
    recordSubmitted = (response: WebResponse) => {
        this.setState({ savedRecord: response.item, formStep: 4 });
    }
    render() {
        const student: Student | undefined = this.state.student;
        if (!student) {
            return <Warning />
        }

        return (
            <div className="container-fluid section-body">
                <h2>Input Point</h2>
                <Modal title={student.user?.name + " - " + student.kelas?.level + student.kelas?.rombel + " " + student.kelas?.sekolah?.nama}>

                    <Progress step={this.state.formStep} totalStep={this.totalStep} />
                    {this.state.formStep == 1 ? <FormStepOne category={this.state.category} setSelectedCategory={this.setCategory}
                        onSubmit={() => { this.nextStep(2) }} />
                        : null}
                    {this.state.formStep == 2 && this.state.category ?
                        <FormStepTwo
                            rulePoint={this.state.rulePoint}
                            setRulePoint={this.setRulePoint}
                            category={this.state.category} onBack={() => this.nextStep(1)} onSubmit={() => { this.nextStep(3) }}
                        /> : null}
                    {this.state.formStep == 3 && this.state.category && this.state.rulePoint ?
                        <FormStepThree
                            submit={this.submitRecord}
                            rulePoint={this.state.rulePoint}
                            onBack={() => this.nextStep(2)}
                        /> : null}
                    {this.state.formStep == 4 && this.state.savedRecord ?
                        <Detail back={() => this.setState({ student: null })} record={this.state.savedRecord} />
                        : null
                    }
                </Modal>
            </div>
        )
    }
}

const Progress = (props: { step: number, totalStep: number }) => {
    return (
        <div className="progress" style={{ height:'5px', marginBottom: 10}}>
            <div className="bg-success" style={{transitionDuration: '500ms', width: (props.step / props.totalStep * 100) + '%' }}  ></div>
        </div>
    )
}

const Detail = (props: { record: PointRecord, back(): any }) => {
    const record = PointRecord.clone(props.record);
    const date = record.getDate();
    return (
        <div>
            <h4 className="text-center text-success"><i className="fas fa-check" style={{ marginRight: 5 }} />Record saved</h4>
            <p />
            <FormGroup label="Date">{date.toDateString()} {record.time}</FormGroup>
            <FormGroup label="Category">{record.rule_point?.category?.name}</FormGroup>
            <FormGroup label="Name">{record.rule_point?.name}</FormGroup>
            <FormGroup label="Point">{record.rule_point?.point}</FormGroup>
            <FormGroup label="Location">{record.location}</FormGroup>
            <hr />
            <FormGroup><a onClick={props.back} className="btn btn-dark">Ok</a></FormGroup>
        </div>
    )
}

const Warning = () => {
    return (
        <div className="container-fluid section-body">
            <h2>Input Point</h2>
            <SimpleError>
                <i className="fas fa-exclamation-circle" />&nbsp;Please select student <hr />
                <AnchorWithIcon to={"/dormitoryactivity/studentlist"} iconClassName="fas fa-list">Student List</AnchorWithIcon>
            </SimpleError>
        </div>
    )
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(InputPoint)
)