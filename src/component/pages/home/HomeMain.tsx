

import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import ApplicationProfile from '../../../models/ApplicationProfile';
import { baseImageUrl } from '../../../constant/Url';

class HomeMain extends BaseComponent {
    constructor(props: any) {
        super(props, false);
    }

    componentDidMount() {
        document.title = "Home";
    }
    render() {
        const applicationProfile: ApplicationProfile = this.getApplicationProfile();
        const imageUrl: string = baseImageUrl() + applicationProfile.backgroundUrl;
        return (
            <div className="section-body container-fluid" style={{padding:0}}>
                <div className="jumbotron"
                    style={{
                        margin:'0px',
                        marginTop: '20px',
                        backgroundImage: 'url("' + imageUrl + '")',
                        backgroundSize: 'cover',
                        color: applicationProfile.fontColor??"rgb(0,0,0)"
                    }}
                >
                    <h1 className="display-4">{applicationProfile.appName}</h1>
                    <p className="lead">{applicationProfile.appDescription}</p>
                    <hr className="my-4" />
                    <p>{applicationProfile.welcoming_message}</p>
                    <Link className="btn btn-primary btn-lg" to="/about" role="button">About Us</Link>
                </div>
            </div>

        )
    }

} 

export default withRouter(connect(
    mapCommonUserStateToProps, 
)(HomeMain))