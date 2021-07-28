
import BaseEntity from './BaseEntity';
import { parseDate } from './../utils/DateUtil';
import { twoDigits as td } from './../utils/StringUtil';
import RulePoint from './RulePoint';
import Student from './Student';
import Pictures from './Pictures';
import { contextPath } from './../constant/Url';
export default class PointRecord extends BaseEntity
{
    setTime(h: number, m: number, s: number) {
        this.time = [td(h), td(m), td(s)].join(":");
    }
    setDate = (d: Date) => {
        this.day = d.getDate();
        this.month = d.getMonth() + 1;
        this.year = d.getFullYear();
    }
    dateString = () :string=>{
        return `${this.year}-${td(this.month)}-${td(this.day)}`;
    }
    location?:string;
    day:number = new Date().getDate();
    month:number = new Date().getMonth()+1;
    year:number = new Date().getFullYear();
    time:string;
    description?:string;
    student_id?:string;
    point_id?:number;

    rule_point?:RulePoint;
    student?:Student;
    dropped_at?:Date;

    pictures:Pictures[] = [];

    constructor() {
        super();
        const d = new Date();
        this.time =  [td(d.getHours()), td(d.getMinutes()), td(d.getSeconds())].join(":");
    }

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

    getTimestamp = () :string => {

        const d = this.getDate();
        const day = DAYS[d.getDay()];
        return day+", "+[
            td(d.getDate()), td(d.getMonth()+1), d.getFullYear()
        ].join("/")+" "+this.time;
    }

    public static clone = (object:PointRecord) => {
        return Object.assign(new PointRecord(), object);
    }
}

const DAYS = [
    "Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
]