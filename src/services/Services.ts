
import UserService from './UserService'; 
import MasterDataService from './MasterDataService';
import MusyrifManagementService from './MusyrifManagementService';
import StudentService from './StudentService';
export default interface Services {
    studentService: StudentService;
    userService: UserService,
    masterDataService:MasterDataService,
    musyrifManagementService:MusyrifManagementService
}