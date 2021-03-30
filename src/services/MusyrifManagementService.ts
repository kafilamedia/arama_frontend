
import { commonAjaxPostCalls } from './Promises';
import { contextPath } from './../constant/Url';
import Filter from './../models/Filter';
export default class MusyrifManagementService {
    private static instance?: MusyrifManagementService;

    static getInstance(): MusyrifManagementService {
        if (this.instance == null) {
            this.instance = new MusyrifManagementService();
        }
        return this.instance;
    }
    public employeeList(filter:Filter){
        return commonAjaxPostCalls(contextPath()+"/api/musyrifmanagement/employees", {
            filter:filter
        });
    }
    }