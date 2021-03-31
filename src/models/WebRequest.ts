 
import User from './User';
import ApplicationProfile from './ApplicationProfile';
import Filter from './Filter';
import Category from './Category';
import RulePoint from './RulePoint';

export default class WebRequest{
	 employee_id?:any;
	 active?:boolean;
	 user?:User;
	 profile?:ApplicationProfile;
	 filter?:Filter;

	 category?:Category;
	 rulePoint?:RulePoint;
	 modelName?:string;
	 record_id?:any;
}
