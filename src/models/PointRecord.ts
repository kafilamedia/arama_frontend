
import BaseEntity from './BaseEntity';
import { parseDate, twoDigits } from './../utils/DateUtil';
import RulePoint from './RulePoint';
import Student from './Student';
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

    getDate = ():Date => {
        return parseDate(this.dateString());
    }

    public static clone = (object:PointRecord) => {
        return Object.assign(new PointRecord(), object);
    }
}