
import UserService from './UserService'; 
import MasterDataService from './MasterDataService';
import MusyrifManagementService from './MusyrifManagementService';
export default interface Services {
    userService: UserService,
    masterDataService:MasterDataService,
    musyrifManagementService:MusyrifManagementService
}