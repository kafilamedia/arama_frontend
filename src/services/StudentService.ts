
import { commonAjaxPostCalls } from './Promises';
import { contextPath } from '../constant/Url';
import Filter from '../models/Filter';
import PointRecord from './../models/PointRecord';
export default class StudentService {

    private static instance?: StudentService;

    static getInstance(): StudentService {
        if (this.instance == null) {
            this.instance = new StudentService();
        }
        return this.instance;
    }
    public submitPointRecord(pointRecord: PointRecord) {
        return commonAjaxPostCalls(contextPath() + "/api/dormitorymanagement/submitpointrecord", {
            pointRecord: pointRecord
        });
    }
    public getClasses(filter: Filter) {
        return commonAjaxPostCalls(contextPath() + "/api/dormitorymanagement/classes", {});
    }
     
}