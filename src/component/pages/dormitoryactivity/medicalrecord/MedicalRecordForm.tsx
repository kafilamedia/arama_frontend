import React from 'react'
import BaseComponent from '../../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import StudentForm from './StudentForm';
import Student from './../../../../models/Student';
import FilterPeriod from './../../../form/FilterPeriod';
import Filter from './../../../../models/commons/Filter';
import FormGroup from './../../../form/FormGroup';
import { getMonthDays, MONTHS } from './../../../../utils/DateUtil';
import Card from './../../../container/Card';
import MedicalRecord from './../../../../models/MedicalRecord';
import MedicalRecordDailyInput from './MedicalRecordDailyInput';
import StudentService from './../../../../services/StudentService';
import WebResponse from './../../../../models/commons/WebResponse';
import AnchorWithIcon from './../../../navigation/AnchorWithIcon';
import { doItLater } from './../../../../utils/EventUtil';
import { compose } from 'redux';
import BasePage from './../../BasePage';
class State {
    student?: Student;
    month: number = new Date().getMonth() + 1;
    year: number = new Date().getFullYear();
    mappedItems: Map<number, MedicalRecord> = new Map()
}
class MedicalRecordForm extends BasePage {
    state: State = new State();
    studentService: StudentService;
    inputRefs: Map<number, any> = new Map();
    constructor(props) {
        super(props, "Medical Record", true);
        this.studentService = this.getServices().studentService;
    }
    setStudent = (student: Student | undefined) => {
        if (student) {
            student = Object.assign(new Student(), student);
        }
        this.setState({ student: student }, this.reset);
    }
    validateStudentData = () => {
        const student = this.props.location.state?this.props.location.state.student : undefined;
        if (student) {
            this.setStudent(student);
        }
    }
    
    reset = () => {
        doItLater(() => {
            if (this.state.student)
            this.inputRefs.forEach((ref: any, day: number) => {
                if (ref) {
                    ref.reset();
                }
            })
        }, 100);
    }
    recordsLoaded = (response: WebResponse) => {

        let mappedItems = this.toMap(response.items);

        this.setState({ mappedItems: mappedItems }, () => {
            doItLater(() => {
                this.inputRefs.forEach((ref: any, day: number) => {
                    let record = this.state.mappedItems.get(day);
                    if (!record) {
                        record = MedicalRecord.instance(this.state.student?.id,day, this.state.month, this.state.year);
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


    toMap = (items: MedicalRecord[]): Map<number, MedicalRecord> => {
        const map: Map<number, MedicalRecord> = new Map();
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
        return { month: this.state.month, year: this.state.year }
    }

    componentDidMount() {
        this.validateLoginStatus(()=>{
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
        const mappedRecord = this.state.mappedItems;
        const dayCount = this.dayCount();
        const days: number[] = [];
        for (let i = 1; i <= dayCount; i++) {
            days.push(i);
        }
        const gridTemplateColumns = ('150px ').repeat(dayCount);

        return (
            <div className="container-fluid section-body">
                <h2>Medical Record Form {student ? student.user?.name : ""}</h2>
                <StudentForm setItem={this.setStudent} />
                <p />
                {student ?
                    <Card>
                        <FormGroup label={"Period (" + MONTHS[(filter.month ?? 1) - 1] + " " + filter.year + ")"}>
                            <div className="input-group">
                                <FilterPeriod filter={filter} hideDay onChange={this.handleInputChange} />
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <AnchorWithIcon iconClassName="fas fa-redo" onClick={this.loadMonthlyRecord}>Load Data</AnchorWithIcon>
                        </FormGroup>

                        <div className="container-fluid  row">
                            <div className="col-md-3">
                                <LeftLabel />
                            </div>
                            <div className="col-md-9" style={{ overflow: 'scroll' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>

                                    {days.map(day =>
                                        <MedicalRecordDailyInput key={"record-input-" + day} student={student}
                                            ref={ref => {
                                                this.inputRefs.set(day, ref)
                                            }}
                                            year={this.state.year}
                                            month={this.state.month} day={day} />)}
                                </div>
                            </div>
                        </div>
                    </Card>
                    : null}
            </div>
        )
    }

}

const LeftLabel = (props: {}) => {
    const labels = [
        //temp
        "Pengukuran suhu badan pagi hari", "Pengukuran suhu badan sore hari",
        // constumption
        "Makan pagi", "Makan siang", "Makan malam",
        "Konsumsi vitamin / Obat pribadi",
        //test
        "Genose test", "Swab antigen", "PCR test",
        //
        "Kesimpulan sementara"
    ]

    return (
        <table className="table table-bordered table-striped" style={{ fontSize: '0.7em' }}>
            <tbody>
                <tr><td><div style={{ minHeight: 40 }}>Pengukuran</div></td></tr>
                {labels.map((label, i) => {
                    return (<tr key={"label-" + i}>
                        <td><div style={{ minHeight: 40 }}>{i + 1}. {label}</div></td>
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(MedicalRecordForm)
)