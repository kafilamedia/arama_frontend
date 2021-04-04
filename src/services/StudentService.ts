
import { commonAjaxPostCalls } from './Promises';
import { contextPath } from '../constant/Url';
import Filter from '../models/commons/Filter';
import PointRecord from './../models/PointRecord';
import AttachmentInfo from './../models/settings/AttachmentInfo';
import WebRequest from './../models/commons/WebRequest';
export default class StudentService {
    

    private static instance?: StudentService;

    static getInstance(): StudentService {
        if (this.instance == null) {
            this.instance = new StudentService();
        }
        return this.instance;
    }
    public submitPointRecord(pointRecord: PointRecord, attachmentInfo?:AttachmentInfo) {
        if (attachmentInfo) {
            attachmentInfo.data = "";
        }
        const req:WebRequest = {
            pointRecord: pointRecord,
            attachmentInfo: attachmentInfo
        }
        return commonAjaxPostCalls(contextPath() + "/api/dormitorymanagement/submitpointrecord", req);
    }
    public getClasses(filter: Filter) {
        return commonAjaxPostCalls(contextPath() + "/api/dormitorymanagement/classes", {});
    }

    setPointDropped = (id: number, dropped: boolean) => {
        return commonAjaxPostCalls(contextPath() + "/api/dormitorymanagement/droppoint", { 
            pointRecord : {
                id: id,
                dropped_at: dropped?new Date():null
            }
        });
    }
     
}