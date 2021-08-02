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

class State {
    classes:Class [] = [];
    items:ReportItem[] = [];
}
interface ReportItem {
    name:string, class:string,
    categories:CategoryResult[]
}
interface CategoryResult {
    name:string, total_point:number, predicate_letter:string, predicate_desc:string
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
            this.raporDataLoaded,
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
    raporDataLoaded = (response:WebResponse) => {
        this.setState({items: response.items});
    }
    get reportHeader() {
        const headers = ['No', 'Siswa', 'Kelas']
        const items = this.state.items;
        if (items.length == 0) return [];

        items[0].categories.forEach((cat)=>{
            headers.push(cat.name);
            headers.push("Predikat");
            headers.push("Keterangan");
        });
        return headers;
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
                {this.state.items.length == 0?
                <div className="alert alert-warning">Tidak ada data</div>:
                <div className="mt-5 bg-white border border-secondary" style={{overflow: 'scroll'}}>
                    <table className="table table-striped">
                        {tableHeader(...this.reportHeader)}
                        <tbody>
                            {this.state.items.map((item:ReportItem, i:number) => {

                                return (
                                    <tr key={`r_i_${item.name}`} >
                                        <td>{i+1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.class}</td>
                                        {item.categories.map((c:CategoryResult, ci:number)=>{
                                            return (
                                                <React.Fragment key={"F"+ci+i}>
                                                    <td>{c.total_point}</td>
                                                    <td children={c.predicate_letter}/>
                                                    <td children={c.predicate_desc} />
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