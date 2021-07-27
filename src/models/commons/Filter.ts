
export default class Filter{
    static withLimit = (arg0: number): Filter => {
		const f =new Filter();
		f.limit = arg0;
        return f;
    }
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
	fieldsFilter:Record<string, any> = {};
	dayTo?:number;
	monthTo?:number;
	yearTo?:number;
	maxValue?:number;
	availabilityCheck?:boolean;
	
	//
	useExistingFilterPage?:boolean = false; 

}
