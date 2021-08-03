

import React, { ChangeEvent, FormEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores'; 
import User from './../../../../models/User';
import BasePage from './../../BasePage';
import AttachmentInfo from './../../../../models/settings/AttachmentInfo';
import { getAttachmentInfoFromFile } from './../../../../utils/ComponentUtil';
import StudentService from './../../../../services/StudentService';
import { AuthorityType } from '../../../../models/AuthorityType';

class State {
    attachment:AttachmentInfo | undefined;
}
class DashboardMain extends BasePage {
    state:State = new State();
    studentService:StudentService;
    constructor(props: any) {
        super(props, "Dashboard", true);
        this.studentService = this.getServices().studentService;
    }

    addPointRecord = (e:FormEvent) => {
        e.preventDefault();
        if (!this.state.attachment) return;
        
        this.props.history.push({
            pathname: '/asrama/pointrecordedit',
              state: {attachment: this.state.attachment }
         })
    }
    updateImage = (e:ChangeEvent) => {
        getAttachmentInfoFromFile(e.target as HTMLInputElement) 
            .then(attachment=>{
                this.setState({attachment:attachment});
            }).catch(console.error)
    }
    render() {
        const user: User | undefined = this.getLoggedUser();
        if (!user) return null;
        return (
            <div  className=" section-body container-fluid">
                <h2>Dashboard</h2>
                <div className="alert alert-info">
                    Welcome, <strong>{user.name}  </strong>
                    <hr/>
                    {/* <p className="badge badge-dark text-capitalize">{(user.roles).join(", ")}</p> */}
                   
                </div>
                { !this.getLoggedUser()?.hasRole(AuthorityType.musyrif_asrama) ? null :
                    <form className="mt-10 text-center" onSubmit={this.addPointRecord}>
                        <h1><i className="fas fa-camera" /></h1>
                        <h3> Input Pelanggaran</h3>
                        <input onChange={this.updateImage} type="file" accept="image/*" className="form-control mt-3" />
                        <p/>
                        {this.state.attachment?
                        <div>
                            <input type="submit" className="btn btn-dark btn-large" value="Selanjutnya" />
                            <img className="w-100 mt-5" src={this.state.attachment.url}/>
                            
                        </div>
                        : null}
                    </form>
                }
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(DashboardMain))