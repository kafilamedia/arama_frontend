
import Student from './../../../models/Student';

export default interface StudentReportSummary {
    classMember: Student;
    categories: ReportCategorySummary[];
    generalIndiscipliner: GeneralIndiscipliner[];
    average: number;
    averageStatus: string;
    totalReducePoint: number;
}

type ReportCategorySummary = {
    categoryId: number;
    name: string;
    initialPoint: number;
    score: number;
    predicateLetter: string;
    predicateName: string;
    predicateStatus: string;
    predicateDescription: string;
}

type GeneralIndiscipliner = {
    name: string;
    description: string;
    point: number;
}
