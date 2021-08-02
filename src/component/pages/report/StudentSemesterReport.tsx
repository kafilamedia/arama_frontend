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

class State {
    classes:Class [] = [];
}
class StudentSemesterReport extends BasePage
{
    state:State = new State();
    private studentService:StudentService;
    selectClassRef:React.RefObject<HTMLSelectElement> = React.createRef();
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

    loadRaporData = (e:any) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (!this.selectClassRef.current) {
            return;
        }
        const classId = this.selectClassRef.current.value;
        this.commonAjax(
            this.studentService.getRaporData,
            console.debug,
            this.showCommonErrorAlert,
            classId
        )
    }
    downloadData = () => {
        if (!this.selectClassRef.current) {
            return;
        }
        const classId = this.selectClassRef.current.value;
        this.commonAjax(
            this.studentService.downloadRaporData,
            this.reportCreated,
            this.showCommonErrorAlert,
            classId
        )
    }

    reportCreated = (attachment: AttachmentInfo) => {
        this.showConfirmation("Save File " + attachment.name + " ?")
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

    classesLoaded = (response:WebResponse) => {
        this.setState({classes: response.items});
    }

    render() {
        const classes = this.state.classes;
        return (
            <div className="container-fluid section-body">
                <h2>{this.title}</h2>
                <form onSubmit={this.loadRaporData} className="mt-5">
                    <FormGroup label="Kelas">
                        <select ref={this.selectClassRef} className="form-control">
                            {classes.map((c:Class)=>{
                                return <option key={`rapor_class_${c.id}`} value={c.id}>{c.level}{c.rombel} {c.sekolah?.nama}</option>
                            })}
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <input type="submit" className="btn btn-success" value="Load Data" />
                        <a className="btn btn-link ml-2" onClick={this.downloadData} >Download Detail Data</a>
                    </FormGroup>
                </form>
            </div>
        )
    }
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(StudentSemesterReport)
)