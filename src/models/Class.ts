
import School from './School';
import Student from './Student';

export default class Class {
    static studentClassString(student: Student| undefined): string {
        return (student?.kelas?.level??"") +(student?.kelas?.rombel??"") + " " + (student?.kelas?.sekolah?.nama??"");
    }
    id?:string;
    name?:string;
    level?:string;
    rombel?:string;
    sekolah?:School;
    //
    letter?:string;
    schoolName?:string;
}