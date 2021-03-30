import { AuthorityType } from './AuthorityType';
import BaseEntity from './BaseEntity';

export default class User extends BaseEntity{
	static clone(user: User): User {
		 return Object.assign(new User(), user);
	}
    hasRole(role: AuthorityType): boolean {
        for (let i = 0; i < this.roles.length; i++) {
			const element = this.roles[i];
			if (element == role) {
				return true;
			}
		}
		return false;
    }
	nickname?:string;
	name?:string;
	password?:string;
	profileImage?:string;
	roles:AuthorityType[] = [AuthorityType.user];
	requestId?:string; 
	nip?:string;

}
