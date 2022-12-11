import 'reflect-metadata';
import { injectable } from 'inversify';
import Employee from '../models/Employee';
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls } from './Promises';

@injectable()
export default class MusyrifManagementService {
  activate(emp: Employee, active: boolean) {
    const path = `api/admin/asrama/musyrif/set-active/${emp.id}/${active}`;
    return commonAjaxPostCalls(contextPath() + path);
  }
}