import 'reflect-metadata';
import { injectable } from 'inversify';
import Filter from '../models/commons/Filter';
import WebRequest from '../models/commons/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxDeleteCalls, commonAjaxGetCalls, commonAjaxPostCalls, commonAjaxPostCallsWithBlob, commonAjaxPutCalls } from './Promises';
type Menus = 'asrama' | 'management' | 'school-data';

@injectable()
export default class MasterDataService {
  getOne = (menu: Menus, modelName: string, id: any) => {
    const endpoint = contextPath().concat(`api/admin/${menu}/${modelName}/${id}`);
    return commonAjaxGetCalls(endpoint);
  }
  delete = (menu: Menus, modelName: string, id: any) => {
    const endpoint = contextPath().concat(`api/admin/${menu}/${modelName}/${id}`);
    return commonAjaxDeleteCalls(endpoint);
  }
  list = (request: WebRequest, menu: Menus) => {
    console.log('filter', request.filter);
    const endpoint = contextPath().concat(`api/admin/${menu}/${request.modelName}`);
    return commonAjaxGetCalls(endpoint + Filter.queryString(request.filter));
  }

  insert = (modelName: string, menu: Menus, body: any) => {
    const endpoint = contextPath().concat(`api/admin/${menu}/${modelName}`);
    return commonAjaxPostCalls(endpoint, body);
  }
  update = (modelName: string, menu: Menus, id: any, body: any) => {
    const endpoint = contextPath().concat(`api/admin/${menu}/${modelName}/${id}`);
    return commonAjaxPutCalls(endpoint, body);
  }
  generateReport(request: WebRequest) {
    const endpoint = contextPath().concat('api/app/report/records');
    return commonAjaxPostCallsWithBlob(endpoint, request);
  }
}