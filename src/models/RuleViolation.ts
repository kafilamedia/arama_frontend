
import BaseEntity from './BaseEntity';
import Student from './Student';
export default class RuleViolation extends BaseEntity
{
    name:string = "";
    description:string|undefined;
    student:Student|undefined;
    student_id:string| undefined;
    semester:number|undefined;
    tahun_ajaran:string|undefined;

    point:number = 0;
    
}