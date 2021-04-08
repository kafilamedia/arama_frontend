
import BaseEntity from './BaseEntity';
import Student from './Student';
export default class MedicalRecord extends BaseEntity{
      day:number = new Date().getDate();
     month:number = new Date().getMonth();
     year:number = new Date().getFullYear();
     temperature_morning?:number;
     temperature_afternoon?:number;
     breakfast?:boolean;
     lunch?:boolean;
     dinner?:boolean;
     medicine_consumption:boolean = false;
     genose_test?:boolean;
     antigen_test?:boolean;
     pcr_test?:boolean;
     description?:string
     student_id;
     student?:Student;
}