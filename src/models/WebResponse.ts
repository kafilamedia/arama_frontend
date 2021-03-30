
import ApplicationProfile from './ApplicationProfile';
import User from './User';
import Filter from './Filter';

export default class WebResponse{
	
	code?:string;
    message?:string;
    items?:any[];
    item?:any;
    percentage?:number;
    filter?:Filter;
    user?:User;
    profile?:ApplicationProfile;
    loggedIn?:boolean;
	//
	rawAxiosResponse?:any;
}
