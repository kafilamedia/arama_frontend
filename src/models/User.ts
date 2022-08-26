import Authority from './Authority';
import { AuthorityType } from './AuthorityType';
import BaseEntity from './BaseEntity';

export default class User extends BaseEntity {
  static clone(user: User): User {
    return Object.assign(new User(), user);
  }
  hasRole(role: AuthorityType): boolean {
    for (let i = 0; i < this.authorities.length; i++) {
      const element = this.authorities[i];
      if (element.name == role) {
        return true;
      }
    }
    return false;
  }
  displayName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  profileImage?: string;
  authorities: Authority[] = [ { name: AuthorityType.ROLE_EMPLOYEE } ];
  requestId?: string;

}
