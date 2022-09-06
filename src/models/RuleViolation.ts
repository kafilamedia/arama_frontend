
import BaseEntity from './BaseEntity';
import Student from './Student';
export default class RuleViolation extends BaseEntity {
    name: string = "";
    description: string | undefined;
    student: Student | undefined;
    classMemberId?: number;

    classMemberName?: string;
    classLevel?: number;
    classLetter?: string;
    schoolName?: string;
    point: number = 0;

}