
import ApplicationProfile from '../ApplicationProfile';
import User from '../User';

export default interface WebResponse {
    code: string;
    message: string;
    percentage: number;
    user: User;
    profile: ApplicationProfile;
    loggedIn: boolean;
    //
    rawAxiosResponse: any;

    result: any;
}
