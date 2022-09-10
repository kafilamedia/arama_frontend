
import BaseEntity from './BaseEntity';

export default class WarningAction extends BaseEntity {
    name: string = 'SP1';
    description: string | undefined;
    classMemberId?: number;
    classLevel?: number;
    classLetter?: string;
    // time?: Date;
    // location?: string;

    classMemberName?: string;
    schoolName?: string;
}