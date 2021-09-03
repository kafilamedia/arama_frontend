import BaseEntity from './BaseEntity';
import Employee from './Employee';

export default class ApplicationProfile extends BaseEntity{
    
	name?:string;
	code?:string;
	description?:string;
	about?:string;
	welcoming_message?:string;
	iconUrl?:string;
	pageIcon?:string;
	backgroundUrl?:string;
	color?:string;
	fontColor?:string;
	contact?:string;
	address?:string;
	warning_point: number|undefined;
	
	division_head_id?:string;
	division_head?:Employee;

	school_director_id?:string;
	school_director?:Employee;
	report_date?:string;

	semester?:number;
	tahun_ajaran?:string;

	validateField() {
        if (this.division_head) {
			this.division_head_id = this.division_head.id;
		}
		if (this.school_director) {
			this.school_director_id = this.school_director.id;
		}
    }
}
