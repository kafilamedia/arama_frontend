
import Filter from '../models/commons/Filter';
import WebRequest from '../models/commons/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls, commonAjaxPostCallsWithBlob } from './Promises';
import ApplicationProfile from './../models/ApplicationProfile';

export default class MasterDataService { 
    private static instance?: MasterDataService;

    static getInstance(): MasterDataService {
        if (this.instance == null) {
            this.instance = new MasterDataService();
        }
        return this.instance;
    }
    getById = (request:WebRequest) => {
        const endpoint: string = contextPath().concat("api/masterdata/getbyid");
        return commonAjaxPostCalls(endpoint, request);
    }
    delete = (request:WebRequest) => {
        const endpoint: string = contextPath().concat("api/masterdata/delete");
        return commonAjaxPostCalls(endpoint, request);
    }
    list = (request: WebRequest)  => {
        const endpoint: string = contextPath().concat("api/masterdata/list");
        return commonAjaxPostCalls(endpoint, request);

    }

    update = (request: WebRequest) => {
        const endpoint: string = contextPath().concat("api/masterdata/update");
        return commonAjaxPostCalls(endpoint, request);
    }
   
    updateApplicationProfile = (applicationProfile: ApplicationProfile) => {
        const request: WebRequest = {
            profile: applicationProfile
        }
        const endpoint = contextPath().concat("api/app/setting/updateprofile");
        return commonAjaxPostCalls(endpoint, request)
    }

    generateReport(request: WebRequest) {
        const endpoint: string = contextPath().concat("api/app/report/records");
        return commonAjaxPostCallsWithBlob(endpoint, request);

    }
}