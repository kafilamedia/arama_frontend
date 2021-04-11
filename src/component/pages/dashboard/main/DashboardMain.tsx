

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores'; 
import User from './../../../../models/User';
import BasePage from './../../BasePage';


class DashboardMain extends BasePage {
    constructor(props: any) {
        super(props, "Dashboard", true);
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
                    <p className="badge badge-dark">{(user.roles).join(", ")}</p>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(DashboardMain))