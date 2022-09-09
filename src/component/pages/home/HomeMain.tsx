
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import { baseImageUrl } from '../../../constant/Url';
import ApplicationProfile from '../../../models/ApplicationProfile';
import BaseComponent from '../../BaseComponent';

class HomeMain extends BaseComponent<any, any> {
  constructor(props: any) {
    super(props, false);
  }
  componentDidMount() {
    document.title = "Home";
  }
  render() {
    const applicationProfile = this.getApplicationProfile();
    const imageUrl = baseImageUrl() + applicationProfile.backgroundUrl;
    return (
      <div className="section-body container-fluid" style={{ padding: 0 }}>
        <div className="jumbotron"
          style={{
            margin: '0px',
            marginTop: '20px',
            backgroundImage: 'url("' + imageUrl + '")',
            backgroundSize: 'cover',
            color: applicationProfile.fontColor ?? "rgb(0,0,0)"
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

export default withRouter(connect(mapCommonUserStateToProps)(HomeMain));
