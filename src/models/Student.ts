
import BaseEntity from './BaseEntity';
import User from './User';
import Class from './Class';
export default class Student extends BaseEntity
{
    nis?:string;
    kelas?:Class;
    user?:User;

    point?:number;
    name?: string;
    classLetter?: string;
    classLevel?: number;
    schoolName?: string;
}