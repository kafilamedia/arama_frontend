
import BaseEntity from './BaseEntity';
import { twoDigits } from './../utils/DateUtil';
export default class PointRecord extends BaseEntity
{
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
    time?:string;
    description?:string;
    student_id?:string;
    point_id?:number;
}