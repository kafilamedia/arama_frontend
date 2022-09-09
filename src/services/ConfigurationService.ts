import 'reflect-metadata';
import { injectable } from 'inversify';
import { contextPath } from './../constant/Url';
import ApplicationProfile from './../models/ApplicationProfile';
import { commonAjaxGetCalls, commonAjaxPostCalls } from './Promises';

@injectable()
export default class ConfigurationService {
  update = (appProfile: ApplicationProfile) => {
    const endpoint = contextPath().concat('api/admin/asrama/config');
    return commonAjaxPostCalls(endpoint, appProfile);
  }
  loadConfig = () => {
    const endpoint = contextPath().concat('api/admin/asrama/config');
    return commonAjaxGetCalls(endpoint);
  }
}