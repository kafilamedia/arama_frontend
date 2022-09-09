import 'reflect-metadata';
import { injectable } from 'inversify';
import Filter from '../models/commons/Filter';
import Employee from '../models/Employee';
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls } from './Promises';

@injectable()
export default class MusyrifManagementService {
  public employeeList(filter: Filter) {
    return commonAjaxPostCalls(contextPath() + '/api/musyrifmanagement/employees', { filter });
  }
  activate(emp: Employee, active: boolean) {
    const path = `api/admin/asrama/musyrif/set-active/${emp.id}/${active}`;
    return commonAjaxPostCalls(contextPath() + path);
  }
}