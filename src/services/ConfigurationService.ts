
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls } from './Promises';
import ApplicationProfile from './../models/ApplicationProfile';
import WebRequest from './../models/commons/WebRequest';
export default class ConfigurationService { 
    private static instance?: ConfigurationService;
    static getInstance(): ConfigurationService {
        if (this.instance == null) {
            this.instance = new ConfigurationService();
        }
        return this.instance;
    }
    update = (appProfile:ApplicationProfile) => {
        appProfile.validateField();
        const endpoint: string = contextPath().concat("api/setting/updateconfig");
        const req:WebRequest = new WebRequest();
        req.applicationProfile = appProfile;
        req.attachmentInfo = appProfile.stampAttachment;
        req.attachmentInfo2 = appProfile.directorSignatureAttachment;
        req.attachmentInfo3 = appProfile.divisionHeadSignatureAttachment;
        return commonAjaxPostCalls(endpoint, req);
    }
}