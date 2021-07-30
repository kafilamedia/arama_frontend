import BaseEntity from './BaseEntity';

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

}
