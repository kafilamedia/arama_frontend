
import { commonAjaxPostCalls } from './Promises';
import { contextPath } from '../constant/Url';
import Filter from '../models/Filter';
export default class StudentService {

    private static instance?: StudentService;

    static getInstance(): StudentService {
        if (this.instance == null) {
            this.instance = new StudentService();
        }
        return this.instance;
    }
    public getList(filter: Filter) {
        return commonAjaxPostCalls(contextPath() + "/api/dormitorymanagement/studentlist", {
            filter: filter
        });
    }
    public getClasses(filter: Filter) {
        return commonAjaxPostCalls(contextPath() + "/api/dormitorymanagement/classes", {});
    }
     
}