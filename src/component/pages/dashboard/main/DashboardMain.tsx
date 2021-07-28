

import React, { ChangeEvent, FormEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores'; 
import User from './../../../../models/User';
import BasePage from './../../BasePage';
import AttachmentInfo from './../../../../models/settings/AttachmentInfo';
import { getAttachmentInfoFromFile } from './../../../../utils/ComponentUtil';

class State {
    attachment:AttachmentInfo | undefined;
}
class DashboardMain extends BasePage {
    state:State = new State();
    constructor(props: any) {
        super(props, "Dashboard", true);
    }

    addPointRecord = (e:FormEvent) => {
        e.preventDefault();
        if (!this.state.attachment) return;
        this.props.history.push({
            pathname: '/dormitoryactivity/pointrecordedit',
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
                <form className="mt-10 text-center" onSubmit={this.addPointRecord}>
                    <h3>Input Pelanggaran</h3>
                    <input onChange={this.updateImage} type="file" accept="image/*" className="form-control" />
                    <p/>
                    {this.state.attachment?
                    <div>
                        <img src={this.state.attachment.url} width={400} height={400} />
                        <p/>
                        <input type="submit" className="btn btn-dark btn-large" value="Selanjutnya" />
                    </div>
                    : null}
                </form>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(DashboardMain))