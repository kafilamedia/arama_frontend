
import BaseEntity from './BaseEntity';
import Student from './Student';
export default class WarningAction extends BaseEntity
{
    name:string = "SP1";
    description:string|undefined;
    student:Student|undefined;
    student_id:string| undefined;
    
}