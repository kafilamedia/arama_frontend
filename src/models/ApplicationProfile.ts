import BaseEntity from './BaseEntity';

export default interface ApplicationProfile {
    
	appName?:string;
	code?:string;
	appDescription?:string;
	about?:string;
	welcoming_message?:string;
	iconUrl?:string;
	pageIcon?:string;
	backgroundUrl?:string;
	color?:string;
	fontColor?:string;
	contact?:string;
	address?:string;

	warningPointLimit?: number;
	reportDate?:string;
	semester?:number;
	year?:string;
}
