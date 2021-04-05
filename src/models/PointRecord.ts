
import BaseEntity from './BaseEntity';
import { parseDate } from './../utils/DateUtil';
import { twoDigits } from './../utils/StringUtil';
import RulePoint from './RulePoint';
import Student from './Student';
import Pictures from './Pictures';
import { contextPath } from './../constant/Url';
export default class PointRecord extends BaseEntity
{
    setTime(h: number, m: number, s: number) {
        this.time = [twoDigits(h), twoDigits(m), twoDigits(s)].join(":");
    }
    setDate = (date: Date) => {
        this.day = date.getDate();
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear();
    }
    dateString = () :string=>{
        return this.year+"-"+ twoDigits(this.month )+"-"+twoDigits(this.day);
    }
    location?:string;
    day:number = new Date().getDate();
    month:number = new Date().getMonth()+1;
    year:number = new Date().getFullYear();
    time:string = [twoDigits(new Date().getHours()), twoDigits(new Date().getMinutes()), twoDigits(new Date().getSeconds())].join(":");
    description?:string;
    student_id?:string;
    point_id?:number;

    rule_point?:RulePoint;
    student?:Student;
    dropped_at?:Date;

    pictures:Pictures[] = [];

    /**
     * get picture URL
     */
    getPicture = () :string|null => {
        if (this.pictures.length == 0) {
            return null;
        }
        return  contextPath()+'upload/POINT_RECORD/'+this.pictures[0].name;
    }

    getDate = ():Date => {
        return parseDate(this.dateString());
    }

    public static clone = (object:PointRecord) => {
        return Object.assign(new PointRecord(), object);
    }
}