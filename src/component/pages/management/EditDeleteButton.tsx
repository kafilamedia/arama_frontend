import React from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import BaseEntity from './../../../models/BaseEntity';
import MasterDataService from './../../../services/MasterDataService';
import WebRequest from './../../../models/WebRequest';
import WebResponse from './../../../models/WebResponse';
class EditDeleteButton extends BaseComponent
{
    masterDataService:MasterDataService;
    constructor(props) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
    }

    getModelName = () : string => {
        return this.props.modelName;
    }
    getRecord = () : BaseEntity => {
        const rec = this.props.record;
        if (!rec) {
            alert("this.props.record undefined");
            return {};
        }
        return rec;
    }
    recordLoaded = (response:WebResponse) => {
        if (this.props.recordLoaded) {
            this.props.recordLoaded(response.item);
        }
    }
    recordDeleted = (response:WebResponse) => {
        this.showInfo("Record has been deleted");
        if (this.props.recordDeleted) {
            this.props.recordDeleted(response.item);
        }
    }
    loadRecord = () => {
        const req :WebRequest = {
            record_id : this.getRecord().id,
            modelName : this.getModelName()
        }
        this.commonAjax(
            this.masterDataService.getById,
            this.recordLoaded,
            this.showCommonErrorAlert,
            req
        )
    }
    deleteRecord = () => {
        const req :WebRequest = {
            record_id : this.getRecord().id,
            modelName : this.getModelName()
        }
        this.showConfirmationDanger("Delete record?")
        .then(ok=>{
            if (!ok) return;
            this.commonAjax(
                this.masterDataService.delete,
                this.recordDeleted,
                this.showCommonErrorAlert,
                req
            )
        })
    }

    render() {

        return (
            <div className="btn-group">
                {this.props.hideEdit == true? null: <AnchorWithIcon onClick={this.loadRecord} iconClassName="fas fa-edit" className="btn btn-warning btn-sm"/>}
                <AnchorWithIcon onClick={this.deleteRecord} iconClassName="fas fa-times" className="btn btn-danger btn-sm"/>
            </div>
        )
    }
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(EditDeleteButton)
)