import React, { ChangeEvent } from 'react'
import BaseComponent from './../../BaseComponent';
import Modal from './../../container/Modal';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from './../../../models/WebResponse';
import WebRequest from './../../../models/WebRequest';

export default class BaseManagementPage extends BaseComponent {
    protected masterDataService: MasterDataService;
    protected modelName: string = "undefined";
    protected formRef: React.RefObject<Modal> = React.createRef();
    protected overrideLoading: boolean;
    constructor(props, modelName?: string, overrideLoading: boolean = false) {
        super(props, true);
        if (modelName) {
            this.modelName = modelName;
        }
        this.overrideLoading = overrideLoading;
        this.masterDataService = this.getServices().masterDataService;
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
            request
        )
    }
    itemsLoaded = (response: WebResponse) => {
        this.setState({ items: response.items, totalData: response.totalData });
    }
    emptyRecord = (): any => {
        throw new Error("Not Implemented");
    }
    updateFilter = (e: ChangeEvent) => {
        const filter = this.state.filter;
        const target = (e.target as any);

        if (!target.value || target.value == "") {
            return;
        }

        let value:any;
        if (target.type == 'number' || (target.dataset && target.dataset['type'] == 'number')) {
            value = parseInt(target.value);
        } else {
            value = target.value;
        }
        filter[target.name] = value;
        this.setState({ filter: filter })
    }
    updateFieldsFilter = (e: ChangeEvent) => {
        const filter = this.state.filter;
        const target = (e.target as any);
        if (!filter.fieldsFilter) {
            filter.fieldsFilter = {};
        }
        filter.fieldsFilter[target.name] = target.value;
        this.setState({ filter: filter })
    }
    loadAtPage = (page: number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter }, this.loadItems);
    }
    updateRecordProp = (e: ChangeEvent) => {
        const target = e.target as any;
        const dataset = target.dataset;
        let value:any;
        if (dataset['type'] && dataset['type'] == 'boolean') {
            value = target.value == "true" ? true : false;
        } else {
            value =  target.value;
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
        })
    }
    componentDidMount() {
        super.componentDidMount();
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
    protected callApiSubmit = (request: WebRequest) => {
        this.commonAjax(
            this.masterDataService.update,
            this.recordUpdated,
            this.showCommonErrorAlert,
            request
        )
    }
}