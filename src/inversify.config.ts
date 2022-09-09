import { Container } from 'inversify';
import 'reflect-metadata'; 
import ConfigurationService from './services/ConfigurationService';
import MasterDataService from './services/MasterDataService';
import StudentService from './services/StudentService';
import UserService from './services/UserService';
import MusyrifManagementService from './services/MusyrifManagementService';

let inversifyContainer = new Container();

inversifyContainer.bind(ConfigurationService).toSelf().inSingletonScope();
inversifyContainer.bind(MasterDataService).toSelf().inSingletonScope();
inversifyContainer.bind(StudentService).toSelf().inSingletonScope();
inversifyContainer.bind(UserService).toSelf().inSingletonScope();
inversifyContainer.bind(MusyrifManagementService).toSelf().inSingletonScope();

export { inversifyContainer };

