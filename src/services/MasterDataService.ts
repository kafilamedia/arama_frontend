
import Filter from './../models/Filter';
import WebRequest from './../models/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls, commonAjaxPostCallsWithBlob } from './Promises';
import BaseEntity from './../models/BaseEntity';
import ManagementProperty from '../models/ManagementProperty';
import EntityProperty from '../models/settings/EntityProperty';
import ApplicationProfile from './../models/ApplicationProfile';

export default class MasterDataService {
    managementProperties: ManagementProperty[] = [];
    private entityPropertyMap: Map<string, EntityProperty> = new Map();
    private static instance?: MasterDataService;

    static getInstance(): MasterDataService {
        if (this.instance == null) {
            this.instance = new MasterDataService();
        }
        return this.instance;
    }

    setEntityProperty(code: string, data?: EntityProperty) {
        if (!data) {
            return;
        }
        this.entityPropertyMap.set(code, data);
    }
    getEntityProperty(code?: string): EntityProperty | undefined {
        if (code == undefined) {
            return undefined;
        }
        return this.entityPropertyMap.get(code);
    }

    loadManagementProperties(req?: any) {
        const endpoint: string = contextPath().concat("api/app/entity/managementpages");
        return commonAjaxPostCalls(endpoint, {});

    }
    
    loadEntities(request: WebRequest) {
        const endpoint: string = contextPath().concat("api/app/entity/get");
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