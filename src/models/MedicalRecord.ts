
import BaseEntity from './BaseEntity';
import Student from './Student';
export default class MedicalRecord extends BaseEntity {
  day: number = new Date().getDate();
  month: number = new Date().getMonth();
  year: number = new Date().getFullYear();
  temperature_morning?: number;
  temperature_afternoon?: number;
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  medicine_consumption: boolean = false;
  genose_test?: boolean;
  antigen_test?: boolean;
  pcr_test?: boolean;
  description?: string
  student_id;
  student?: Student;

  public static clone = (obj: MedicalRecord): MedicalRecord => {
    return Object.assign(new MedicalRecord(), obj);
  }
  public static instance = (student_id: number, d: number, m: number, y: number): MedicalRecord => {
    const obj = new MedicalRecord();
    obj.day = d;
    obj.month = m;
    obj.year = y;
    obj.student_id = student_id;
    return obj;
  }
}