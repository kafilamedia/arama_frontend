

import React, { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import BaseMainMenus from '../../../layout/BaseMainMenus';
import User from './../../../../models/User';


class DashboardMain extends BaseMainMenus {
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
                    <p />
                    <p className="badge badge-dark">{JSON.stringify(user.roles)}</p>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(DashboardMain))