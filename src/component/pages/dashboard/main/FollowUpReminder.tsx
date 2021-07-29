import React from 'react' 
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import BasePage from './../../BasePage';
import StudentService from './../../../../services/StudentService';
import Student from './../../../../models/Student';
import { tableHeader } from './../../../../utils/CollectionUtil';
import WebResponse from './../../../../models/commons/WebResponse';
import Class from './../../../../models/Class';
interface FollowUpInfo {
    student:Student,
    TOTAL_POINT:any,
    FOLLOW_UP_COUNT:number,
}
class State {
    followUpInfos:FollowUpInfo[] = [];
}
class FollowUpReminder extends BasePage
{
    state:State = new State();
    private studentService:StudentService;
    constructor(props) {
        super(props, "Follow Up Pelanggaran",true);
        this.studentService = this.getServices().studentService;
    }
    componentReady(){
        if (this.isAdmin()) return;
        this.commonAjax(
            this.studentService.getFollowUpReminders,
            this.recordsLoaded,
            console.error
        )
    }
    recordsLoaded = (r:WebResponse) => {
        this.setState({followUpInfos:r.items});
    }

    render(){

        return (
            <div className="section-body container-fluid">
                <h2>Follow Up Pelanggaran</h2>
                <p>Pelanggaran dengan point {"< -50"}</p>
                <table className="table">
                    {tableHeader("No", "Siswa", "Kelas", "Poin", "Penanganan", "Opsi")}
                    <tbody>
                        {this.state.followUpInfos.map((info, i)=>{
                            return (
                                <tr key={`f-i-${i}`}>
                                    <td>{i+1}</td>
                                    <td>{info.student.user?.name}</td>
                                    <td>{Class.studentClassString(info.student)}</td>
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