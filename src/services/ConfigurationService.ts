
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls } from './Promises';
import ApplicationProfile from './../models/ApplicationProfile';
export default class ConfigurationService { 
    private static instance?: ConfigurationService;
    static getInstance(): ConfigurationService {
        if (this.instance == null) {
            this.instance = new ConfigurationService();
        }
        return this.instance;
    }
    update = (appProfile:ApplicationProfile) => {
        const endpoint: string = contextPath().concat("api/setting/updateconfig");
        return commonAjaxPostCalls(endpoint, {applicationProfile: appProfile });
    }
}