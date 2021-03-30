
export default class Filter{
	limit? :number = 5; 
	page? :number = 0;
	orderType?:string;
	orderBy?:string;
	contains?:boolean; 
	exacts?:boolean;
	day?:number;
	year?:number;
	month?:number;
	module?:string;
	fieldsFilter?:{};
	monthTo?:number;
	yearTo?:number;
	maxValue?:number;
	availabilityCheck?:boolean;
	
	//
	useExistingFilterPage?:boolean = false; 

}
