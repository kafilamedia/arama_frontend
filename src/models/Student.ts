
import BaseEntity from './BaseEntity';
import User from './User';
export default class Student extends BaseEntity
{
    nis?:string;
    class_name?:string;
    school_name?:string;
    user?:User;
}