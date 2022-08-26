
import Filter from '../models/commons/Filter';
import WebRequest from '../models/commons/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxGetCalls, commonAjaxPostCalls, commonAjaxPostCallsWithBlob } from './Promises';
import ApplicationProfile from './../models/ApplicationProfile';

export default class MasterDataService { 
    private static instance?: MasterDataService;

    static getInstance(): MasterDataService {
        if (this.instance == null) {
            this.instance = new MasterDataService();
        }
        return this.instance;
    }
    /**
     * Get one by ID
     * @param request 
     */
    getOne = (request:WebRequest) => {
        const endpoint: string = contextPath().concat("api/masterdata/getbyid");
        return commonAjaxPostCalls(endpoint, request);
    }
    delete = (request:WebRequest) => {
        const endpoint: string = contextPath().concat("api/masterdata/delete");
        return commonAjaxPostCalls(endpoint, request);
    }
    list = (request: WebRequest)  => {
        const endpoint: string = contextPath().concat("api/admin/management/" + request.modelName);
        return commonAjaxGetCalls(endpoint + Filter.queryString(request.filter));
    }

    update = (request: WebRequest) => {
        const endpoint: string = contextPath().concat("api/masterdata/update");
        return commonAjaxPostCalls(endpoint, request);
    }
    generateReport(request: WebRequest) {
        const endpoint: string = contextPath().concat("api/app/report/records");
        return commonAjaxPostCallsWithBlob(endpoint, request);

    }
}