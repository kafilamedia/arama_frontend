import React from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import BaseEntity from './../../../models/BaseEntity';
import MasterDataService from './../../../services/MasterDataService';
import WebRequest from '../../../models/commons/WebRequest';
import WebResponse from '../../../models/commons/WebResponse';
import { resolve } from 'inversify-react';

class EditDeleteButton extends BaseComponent<any, any> {
  @resolve(MasterDataService)
  private masterDataService: MasterDataService;
  constructor(props) {
    super(props, true);
  }

  get modelName() { return this.props.modelName as string; }
  getRecord = () => {
    const rec = this.props.record as BaseEntity;
    if (!rec) {
      alert("this.props.record undefined");
      return {};
    }
    return rec;
  }
  recordLoaded = (response: WebResponse) => {
    if (this.props.recordLoaded) {
      this.props.recordLoaded(response.result);
    }
  }
  recordLoadedForDetail = (response: WebResponse) => {
    if (this.props.recordLoadedForDetail) {
      this.props.recordLoadedForDetail(response.result);
    }
  }
  recordDeleted = (response: WebResponse) => {
    this.showInfo("Record has been deleted");
    if (this.props.recordDeleted) {
      this.props.recordDeleted(response.result);
    }
  }
  get loadRecordRequest() {
    const req: WebRequest = {
      record_id: this.getRecord().id,
      modelName: this.modelName
    }
    return req;
  }
  loadRecord = () => {
    this.commonAjax(
      this.masterDataService.getOne,
      this.recordLoaded,
      this.showCommonErrorAlert,
      this.props.menu,
      this.props.modelName,
      this.loadRecordRequest.record_id
    )
  }
  loadRecordForDetail = () => {
    this.commonAjax(
      this.masterDataService.getOne,
      this.recordLoadedForDetail,
      this.showCommonErrorAlert,
      this.props.menu,
      this.props.modelName,
      this.loadRecordRequest.record_id
    )
  }
  deleteRecord = () => {
    this.showConfirmationDanger("Delete record?")
      .then(ok => {
        if (!ok) return;
        this.commonAjax(
          this.masterDataService.delete,
          this.recordDeleted,
          this.showCommonErrorAlert,
          this.props.menu,
          this.props.modelName,
          this.loadRecordRequest.record_id
        )
      })
  }
  hasType = (type: string) => {
    if (!this.props.types) return false;
    return (this.props.types as string[]).indexOf(type) >= 0;
  }
  render() {
    const types: string[] | undefined = this.props.types ?? undefined;
    return (
      <div className="btn-group">
        {
          this.hasType('detail') &&
          <AnchorWithIcon onClick={this.loadRecordForDetail} iconClassName="fas fa-info-circle" className="btn btn-info btn-sm" />
        }
        {
          types === undefined || this.hasType('edit') &&
          <AnchorWithIcon onClick={this.loadRecord} iconClassName="fas fa-edit" className="btn btn-warning btn-sm" />
        }
        {
          types === undefined || this.hasType('delete') &&
          <AnchorWithIcon onClick={this.deleteRecord} iconClassName="fas fa-times" className="btn btn-danger btn-sm" />
        }

      </div>
    )
  }
}

export default withRouter(
  connect(
    mapCommonUserStateToProps
  )(EditDeleteButton)
)