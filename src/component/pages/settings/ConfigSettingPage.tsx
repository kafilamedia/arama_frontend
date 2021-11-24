import React, { ChangeEvent, FormEvent, RefObject } from 'react'
import BasePage from './../BasePage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import ApplicationProfile from './../../../models/ApplicationProfile';
import FormGroup from '../../form/FormGroup';
import ConfigurationService from './../../../services/ConfigurationService';
import WebResponse from './../../../models/commons/WebResponse';
import EmployeeSearchForm from '../shared/EmployeeSearchForm';
import { getAttachmentInfoFromFile } from './../../../utils/ComponentUtil';
import AttachmentInfo from './../../../models/settings/AttachmentInfo';

class State {
    applicationProfile:ApplicationProfile = new ApplicationProfile();
}
class ConfigSettingPage extends BasePage
{
    state:State = new State();
    configService:ConfigurationService;
    formRef:RefObject<HTMLFormElement> = React.createRef();
    constructor(props) {
        super(props, "Konfigurasi", true);
        this.configService = this.getServices().configurationService;
    }

    componentReady() {
        this.setState({
            applicationProfile: Object.assign(new ApplicationProfile(), this.getApplicationProfile())
        });
    }

    submit = () => {
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
    
    updateAttachment = (e:ChangeEvent) => {
        const name = (e.target as HTMLInputElement).name;
        getAttachmentInfoFromFile(e.target as HTMLInputElement)
        .then((attachment:AttachmentInfo)=>{
            this.updateField(name, attachment);
        })
    }
    render() {
        const profile = this.state.applicationProfile;
        return (
            <div className="container-fluid section-body" >
                <h2>Konfigurasi</h2>
                <hr/>
                <div style={{padding:20}} className="border border-secondary rounded ">
                    <form ref={this.formRef} onSubmit={this.submit}  >
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
                        <FormGroup label="TTD Kepala Asrama">
                            <img width={60} height={60}
                                src={profile.divisionHeadSignatureURL} />
                            <input accept="image/*" onChange={this.updateAttachment} type="file" className="form-control"
                                name="divisionHeadSignatureAttachment" />
                        </FormGroup>
                        <FormGroup label="TTD Direktur">
                            <img width={60} height={60}
                                    src={profile.directorSignatureURL} />
                            <input accept="image/*" onChange={this.updateAttachment} type="file" className="form-control"
                                    name="directorSignatureAttachment" />
                        </FormGroup>
                        <FormGroup label="Stempel">
                            <img width={60} height={60}
                                    src={profile.stampURL} />
                            <input accept="image/*" onChange={this.updateAttachment} type="file" className="form-control"
                                    name="stampAttachment" />
                        </FormGroup>
                        <FormGroup label="Stempel Asrama">
                            <img width={60} height={60}
                                    src={profile.dormitoryStampURL} />
                            <input accept="image/*" onChange={this.updateAttachment} type="file" className="form-control"
                                    name="dormitoryStampAttachment" />
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
)