import React, { ChangeEvent } from 'react'
import BaseComponent from './../../BaseComponent';
import Modal from './../../container/Modal';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from '../../../models/commons/WebResponse';
import WebRequest from '../../../models/commons/WebRequest';
import BasePage from './../BasePage';
import './Management.css'
import BaseEntity from './../../../models/BaseEntity';
import { resolve } from 'inversify-react';

export default abstract class BaseManagementPage extends BasePage {
  @resolve(MasterDataService)
  protected masterDataService: MasterDataService;
  protected formRef: React.RefObject<Modal> = React.createRef();

  emptyRecord = (): BaseEntity => {
    throw new Error("Empty Record Method is Not Implemented....");
  }

  constructor(props,
              protected modelName: string,
              protected menu: 'asrama' | 'management' | 'school-data',
              protected overrideLoading: boolean = false) {
    super(props, "Asrama KIIS", true);
    this.modelName = modelName ?? this.modelName;
  }
  startLoading = (withProgress: boolean = false) => {
    if (this.overrideLoading) {
      this.setState({ loading: true });
    } else {
      super.startLoading(withProgress);
    }
  }
  endLoading = () => {
    if (this.overrideLoading) {
      this.setState({ loading: false });
    } else {
      super.endLoading();
    }
  }
  loadItems = () => {
    const request: WebRequest = {
      filter: this.state.filter,
      modelName: this.modelName
    }
    this.commonAjax(
      this.masterDataService.list,
      this.itemsLoaded,
      this.showCommonErrorAlert,
      request,
      this.menu
    )
  }
  itemsLoaded = (response: WebResponse) => {
    this.setState({ items: response.result.items, totalData: response.result.totalData });
  }

  updateFilter = (e: ChangeEvent<any>) => {
    const { filter } = this.state;
    const { target } = e;
    if (!target.value || target.value == "") {
      return;
    }
    let value: any;
    if (target.type == 'number' || (target.dataset && target.dataset['type'] == 'number')) {
      value = parseInt(target.value);
    } else {
      value = target.value;
    }
    filter[target.name] = value;
    this.setState({ filter })
  }
  updateFieldsFilter = (e: ChangeEvent) => {
    const { filter } = this.state;
    const target = (e.target as any);
    if (!filter.fieldsFilter) {
      filter.fieldsFilter = {};
    }
    filter.fieldsFilter[target.name] = target.value;
    this.setState({ filter })
  }
  loadAtPage = (page: number) => {
    const filter = this.state.filter;
    filter.page = page;
    this.setState({ filter: filter }, this.loadItems);
  }
  updateRecordProp = (e: ChangeEvent) => {
    const target = e.target as any;
    const dataset = target.dataset;
    let value: any;
    if (dataset['type'] && dataset['type'] == 'boolean') {
      value = target.value == "true" ? true : false;
    } else {
      value = target.value;
    }
    const record = this.state.record;
    record[target.name] = value;
    this.setState({ record: record });
  }
  resetForm = (callback?: () => any) => {
    this.setState({ record: this.emptyRecord() }, callback);
  }
  oneRecordLoaded = (item: any) => {
    this.setState({ record: item }, () => {
      if (this.formRef.current) {
        this.formRef.current.showModal();
      }
      this.scrollTop();
    });
  }
  componentDidMount() {
    super.componentDidMount();
    this.scrollTop();
    this.loadItems();
  }
  recordUpdated = (response: WebResponse) => {
    this.resetForm(() => {
      if (this.formRef.current) {
        this.formRef.current.hideModal();
      }
      this.showInfo("Success Update");
      this.loadItems();
    });
  }
  protected callApiInsert = (body: any) => {
    this.commonAjax(
      this.masterDataService.insert,
      this.recordUpdated,
      this.showCommonErrorAlert,
      this.modelName,
      this.menu,
      body
    )
  }
  protected callApiUpdate = (id: any, body: any) => {
    this.commonAjax(
      this.masterDataService.update,
      this.recordUpdated,
      this.showCommonErrorAlert,
      this.modelName,
      this.menu,
      id,
      body
    )
  }

  reload = (e: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    this.loadAtPage(0);
  }
}