
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls, commonAjaxGetCalls } from './Promises';
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
    update = (appProfile: ApplicationProfile) => {
        const endpoint = contextPath().concat("api/admin/asrama/config");
        return commonAjaxPostCalls(endpoint, appProfile);
    }
    loadConfig = () => {
        const endpoint = contextPath().concat("api/admin/asrama/config");
        return commonAjaxGetCalls(endpoint);
    }
}