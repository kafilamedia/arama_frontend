import BaseEntity from './BaseEntity';
import Employee from './Employee';
import AttachmentInfo from './settings/AttachmentInfo';
import { contextPath } from './../constant/Url';

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
	division_head_signature?:string;

	school_director_id?:string;
	school_director?:Employee;
	school_director_signature?:string;

	report_date?:string;

	semester?:number;
	tahun_ajaran?:string;

	stamp?:string;

	divisionHeadSignatureAttachment?:AttachmentInfo;
	directorSignatureAttachment?:AttachmentInfo;
	stampAttachment?:AttachmentInfo;

	get stampURL(){
		if (this.stampAttachment) {
			return this.stampAttachment.url;
		}
		return contextPath()+'upload/PROFILE/'+this.stamp;
	}
	get divisionHeadSignatureURL(){
		if (this.divisionHeadSignatureAttachment) {
			return this.divisionHeadSignatureAttachment.url;
		}
		return contextPath()+'upload/PROFILE/'+this.division_head_signature;
		
	}
	get directorSignatureURL(){
		if (this.directorSignatureAttachment) {
			return this.directorSignatureAttachment.url;
		}
		return contextPath()+'upload/PROFILE/'+this.school_director_signature;
	}

	validateField() {
        if (this.division_head) {
			this.division_head_id = this.division_head.id;
		}
		if (this.school_director) {
			this.school_director_id = this.school_director.id;
		}
    }
}
