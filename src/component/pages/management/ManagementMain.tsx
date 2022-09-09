import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BasePage from './../BasePage';

class ManagementMain extends BasePage<any, any> {
  constructor(props) {
    super(props, "Management", true);
  }
  render() {
    return (
      <div className="container-fluid section-body">
        <h2>Halaman Manajemen</h2>
        <div className="alert alert-info">
          Welcome, <strong>{this.getLoggedUser()?.fullName}</strong>
          <hr />
        </div>
      </div>
    )
  }
}

export default withRouter(
  connect(
    mapCommonUserStateToProps
  )(ManagementMain)
)