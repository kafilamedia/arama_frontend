import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FormGroup from '../../form/FormGroup';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import ApplicationProfile from './../../../models/ApplicationProfile';
import ConfigurationService from './../../../services/ConfigurationService';
import BasePage from './../BasePage';
import { resolve } from 'inversify-react';

class State {
  applicationProfile: ApplicationProfile = {}
}
class ConfigSettingPage extends BasePage<any, State> {
  readonly state = new State();
  @resolve(ConfigurationService)
  readonly configService: ConfigurationService;
  constructor(props) {
    super(props, "Konfigurasi", true);
  }

  componentReady() {
    const applicationProfile = Object.assign({}, this.getApplicationProfile());
    this.setState({ applicationProfile });
  }

  submit = () => {
    this.commonAjax(
      this.configService.update,
      this.configUpdated,
      this.showCommonErrorAlert,
      this.state.applicationProfile
    )
  }
  updateField = (e: ChangeEvent<HTMLInputElement>) => {
    const { applicationProfile } = this.state;
    applicationProfile[e.target.name] = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    this.setState({ applicationProfile });
  }
  configUpdated = () => {
    this.showInfo("Sukses, silakan muat ulang halaman");
  }
  render() {
    const {applicationProfile: profile} = this.state;
    return (
      <div className="container-fluid section-body" >
        <h2>Konfigurasi</h2>
        <hr />
        <div style={{ padding: 20 }} className="border border-secondary rounded">
          <form>
            <FormGroup label="Nama Aplikasi">
              <input name='appName' onChange={this.updateField} className="form-control" value={profile.appName ?? ""} required />
            </FormGroup>
            <FormGroup label="Deskripsi Aplikasi">
              <input name='appDescription' onChange={this.updateField} className="form-control" value={profile.appDescription ?? ""} />
            </FormGroup>
            <FormGroup label="Batas Poin Peringatan">
              <input name='warningPointLimit' onChange={this.updateField} className="form-control" type="number" value={profile.warningPointLimit ?? -30} required />
            </FormGroup>
            <FormGroup label="Tanggal Rapor">
              <input name='reportDate' onChange={this.updateField} className="form-control" value={profile.reportDate ?? ''} required />
            </FormGroup>
          </form>
          <FormGroup>
            <button className="btn btn-primary" onClick={this.submit} >
              Simpan
            </button>
          </FormGroup>
        </div>
      </div>
    )
  }
}

export default withRouter(
  connect(
    mapCommonUserStateToProps
  )(ConfigSettingPage)
);