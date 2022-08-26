
import Filter from '../models/commons/Filter';
import WebRequest from '../models/commons/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxDeleteCalls, commonAjaxGetCalls, commonAjaxPostCalls, commonAjaxPostCallsWithBlob, commonAjaxPutCalls } from './Promises';
import ApplicationProfile from './../models/ApplicationProfile';

export default class MasterDataService {
    private static instance?: MasterDataService;

    static getInstance(): MasterDataService {
        if (this.instance == null) {
            this.instance = new MasterDataService();
        }
        return this.instance;
    }

    getOne = (menu: 'asrama' | 'management', modelName: string, id: any) => {
        const endpoint = contextPath().concat(`api/admin/${menu}/${modelName}/${id}`);
        return commonAjaxGetCalls(endpoint);
    }
    delete = (menu: 'asrama' | 'management', modelName: string, id: any) => {
        const endpoint = contextPath().concat(`api/admin/${menu}/${modelName}/${id}`);
        return commonAjaxDeleteCalls(endpoint);
    }
    list = (request: WebRequest, menu: 'asrama' | 'management') => {
        const endpoint = contextPath().concat(`api/admin/${menu}/${request.modelName}`);
        return commonAjaxGetCalls(endpoint + Filter.queryString(request.filter));
    }

    insert = (modelName: string, menu: 'asrama' | 'management', body: any) => {
        const endpoint: string = contextPath().concat(`api/admin/${menu}/${modelName}`);
        return commonAjaxPostCalls(endpoint, body);
    }
    update = (modelName: string, menu: 'asrama' | 'management', id: any, body: any) => {
        const endpoint: string = contextPath().concat(`api/admin/${menu}/${modelName}/${id}`);
        return commonAjaxPutCalls(endpoint, body);
    }
    generateReport(request: WebRequest) {
        const endpoint: string = contextPath().concat("api/app/report/records");
        return commonAjaxPostCallsWithBlob(endpoint, request);

    }
}