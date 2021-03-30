 
import User from './User';
import ApplicationProfile from './ApplicationProfile';
import Filter from './Filter';

export default class WebRequest{
	 employee_id?:any;
	 active?:boolean;
	 user?:User;
	 profile?:ApplicationProfile;
	 filter?:Filter;
}
