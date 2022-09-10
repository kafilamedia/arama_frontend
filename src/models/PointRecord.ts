
import { contextPath } from './../constant/Url';
import { parseDate } from './../utils/DateUtil';
import { twoDigits as td } from './../utils/StringUtil';
import BaseEntity from './BaseEntity';
import Student from './Student';
export default class PointRecord extends BaseEntity {
  setTime = (h: number, m: number, s: number) => {
    this.time = new Date();
    this.time.setFullYear(this.year);
    this.time.setMonth(this.month - 1);
    this.time.setDate(this.day);
    this.time.setHours(h, m, s);
  }
  dateString = (): string => {
    return `${this.year}-${td(this.month)}-${td(this.day)}`;
  }
  get timeString() {
    return `${this.time.getHours()}:${this.time.getMinutes()}:${this.time.getSeconds()}`;
  }
  location?: string;
  get day() { return this.time.getDate() };
  get month() { return this.time.getMonth() + 1; }
  get year() { return this.time.getFullYear(); }
  set day(d: number) { this.time.setDate(d); }
  set month(m: number) { this.time.setMonth(m - 1); }
  set year(y: number) { this.time.setFullYear(y); }
  time = new Date();
  description?: string;
  classMemberId?: number;
  rulePointId?: number;
  ruleCategoryId?: number;

  student?: Student;
  dropped?: Date;

  // response fields
  ruleCategoryName?: string;
  ruleName?: string;
  studentName?: string;
  schoolName?: string;
  classLevel?: number;
  classLetter?: string;
  point?: number;
  droppable?: boolean;

  /**
   * get picture URL
   */
  getPicture = () => this.id ? contextPath(`api/public/asrama/broken-rule-img/${this.id}`) : undefined;

  getDate = (): Date => {
    return parseDate(this.dateString());
  }

  getTimestamp = () => {
    const d = this.getDate();
    const day = DAYS[d.getDay()];
    return day + ', ' + [
      td(d.getDate()), td(d.getMonth() + 1), d.getFullYear()
    ].join('/') + ' ' + this.time;
  }

  public static clone = (p: PointRecord) => {
    p = Object.assign(new PointRecord(), p);
    p.time = new Date(p.time);
    return p;
  }
}

const DAYS = [
  'Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
]