
import MasterDataService from '../services/MasterDataService';
import UserService from '../services/UserService';

import Services from './../services/Services';
import MusyrifManagementService from './../services/MusyrifManagementService';
import StudentService from '../services/StudentService';
import ConfigurationService from '../services/ConfigurationService';

export const initState: { services: Services } = {
    services: {
        userService: UserService.getInstance(), 
        masterDataService: MasterDataService.getInstance(),
        musyrifManagementService: MusyrifManagementService.getInstance(),
        studentService: StudentService.getInstance(),
        configurationService: ConfigurationService.getInstance()
    }

};

export const reducer = (state = initState, action) => {

    return state;
}

export default reducer;