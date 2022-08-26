
import ApplicationProfile from '../ApplicationProfile';
import User from '../User';
import Filter from './Filter';

export default interface WebResponse {

    code: string;
    message: string;
    items: any[];
    totalData: number;
    item: any;
    percentage: number;
    filter: Filter;
    user: User;
    profile: ApplicationProfile;
    loggedIn: boolean;
    //
    rawAxiosResponse: any;

    result: any;
}
