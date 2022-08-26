
import { commonAjaxPostCalls } from './Promises';
import { contextPath } from './../constant/Url';
import Filter from '../models/commons/Filter';
import Employee from '../models/Employee';
import WebRequest from '../models/commons/WebRequest';
export default class MusyrifManagementService {

  private static instance?: MusyrifManagementService;

  static getInstance(): MusyrifManagementService {
    if (this.instance == null) {
      this.instance = new MusyrifManagementService();
    }
    return this.instance;
  }
  public employeeList(filter: Filter) {
    return commonAjaxPostCalls(contextPath() + "/api/musyrifmanagement/employees", {
      filter: filter
    });
  }
  activate(emp: Employee, active: boolean) {
    const path = `api/admin/asrama/musyrif/set-active/${emp.id}/${active}`;
    return commonAjaxPostCalls(contextPath() + path);
  }
}