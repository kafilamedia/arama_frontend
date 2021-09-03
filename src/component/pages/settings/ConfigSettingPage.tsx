import React, { FormEvent } from 'react'
import BasePage from './../BasePage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import ApplicationProfile from './../../../models/ApplicationProfile';
import FormGroup from '../../form/FormGroup';
import ConfigurationService from './../../../services/ConfigurationService';
import WebResponse from './../../../models/commons/WebResponse';
import EmployeeSearchForm from '../shared/EmployeeSearchForm';

class State {
    applicationProfile:ApplicationProfile = new ApplicationProfile();
}
class ConfigSettingPage extends BasePage
{
    state:State = new State();
    configService:ConfigurationService;
    constructor(props) {
        super(props, "Konfigurasi", true);
        this.configService = this.getServices().configurationService;
    }

    componentReady() {
        this.setState({
            applicationProfile: Object.assign(new ApplicationProfile(), this.getApplicationProfile())
        });
    }

    submit = (e:FormEvent) => {
        e.preventDefault();
        console.debug(this.state.applicationProfile)
        this.commonAjax(
            this.configService.update,
            this.configUpdated,
            this.showCommonErrorAlert,
            this.state.applicationProfile
        )
    }
    updateField = (fieldName:string, value:any) => {
        const profile = this.state.applicationProfile;
        profile[fieldName] = value;
        this.setState({applicationProfile: profile});
    }
    configUpdated = (response: WebResponse) => {
        this.showInfo("Sukses, silakan muat ulang halaman");
    }

    render() {
        const profile = this.state.applicationProfile;
        return (
            <div className="container-fluid section-body" >
                <h2>Konfigurasi</h2>
                <hr/>
                <div style={{padding:5}} className="border border-secondary rounded ">
                    <form onSubmit={this.submit}  >
                        <FormGroup>
                            <input type="submit" value="Simpan" className="btn btn-primary" />
                        </FormGroup>
                        <FormGroup label="Nama Aplikasi">
                            <input name='name' onChange={(e)=>this.handleInputChange(e, 'applicationProfile')} className="form-control" value={profile.name??""} />
                        </FormGroup>
                        <FormGroup label="Deskripsi Aplikasi">
                            <input name='description' onChange={(e)=>this.handleInputChange(e, 'applicationProfile')} className="form-control" value={profile.description??""} />
                        </FormGroup>
                        <FormGroup label="Batas Poin Peringatan">
                            <input name='warning_point' onChange={(e)=>this.handleInputChange(e, 'applicationProfile')} className="form-control" type="number" value={profile.warning_point??-30} />
                        </FormGroup>
                        <FormGroup label="Tanggal Rapor">
                            <input name='report_date' onChange={(e)=>this.handleInputChange(e, 'applicationProfile')} className="form-control" value={profile.report_date??""} />
                        </FormGroup>
                    </form>
                    <FormGroup label="Kepala Asrama">
                        <div style={{height: '80px'}}>
                            <b>{profile.division_head?.user?.name}</b>
                            <EmployeeSearchForm selectItem={(e)=>this.updateField('division_head', e)}/>
                        </div>
                    </FormGroup>
                    <FormGroup label="Direktur">
                        <div style={{height: '80px'}}>
                            <b>{profile.school_director?.user?.name}</b>
                            <EmployeeSearchForm selectItem={(e)=>this.updateField('school_director', e)}/>
                        </div>
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
)