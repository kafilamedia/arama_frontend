 
import User from './User';
import ApplicationProfile from './ApplicationProfile';
import Filter from './Filter';
import Category from './Category';

export default class WebRequest{
	 employee_id?:any;
	 active?:boolean;
	 user?:User;
	 profile?:ApplicationProfile;
	 filter?:Filter;

	 category?:Category;

	 modelName?:string;
	 record_id?:any;
}
