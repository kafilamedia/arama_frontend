import 'reflect-metadata';
import { injectable } from 'inversify';
import { contextPath } from '../constant/Url';
import WebResponse from '../models/commons/WebResponse';
import Filter from './../models/commons/Filter';
import WebRequest from './../models/commons/WebRequest';
import MedicalRecord from './../models/MedicalRecord';
import PointRecord from './../models/PointRecord';
import AttachmentInfo from './../models/settings/AttachmentInfo';
import { commonAjaxGetCalls, commonAjaxGetCallsWithBlob, commonAjaxPostCalls } from './Promises';

@injectable()
export default class StudentService {
  public updatePointRecord(req: PointRecord, attachmentInfo?: AttachmentInfo, removeImage = false) {
    if (attachmentInfo) {
      attachmentInfo.data = '';
    }
    const data = new FormData();
    data.append('id', req.id?.toString() ?? '');
    data.append('day', req.day?.toString() ?? '');
    data.append('month', req.month?.toString() ?? '');
    data.append('year', req.year?.toString() ?? '');
    data.append('time', new Date(req.time ?? new Date()).getTime().toString());
    data.append('description', req.description ?? '');
    data.append('location', req.location ?? '');
    data.append('rulePointId', req.rulePointId?.toString() ?? '');
    data.append('classMemberId', req.classMemberId?.toString() ?? '');
    data.append('removeImage', removeImage ? 'true' : 'false');
    const imgFile = attachmentInfo?.file;
    if (imgFile)
      data.append('image', imgFile);
    return commonAjaxPostCalls(contextPath('api/asrama/student-points/update'), data, 'multipart/form-data');
  }
  public insertPointRecord(req: PointRecord, attachmentInfo?: AttachmentInfo) {
    if (attachmentInfo) {
      attachmentInfo.data = '';
    }
    const data = new FormData();
    data.append('day', req.day?.toString() ?? '');
    data.append('month', req.month?.toString() ?? '');
    data.append('year', req.year?.toString() ?? '');
    data.append('time', new Date(req.time ?? new Date()).getTime().toString());
    data.append('description', req.description ?? '');
    data.append('location', req.location ?? '');
    data.append('rulePointId', req.rulePointId?.toString() ?? '');
    data.append('classMemberId', req.classMemberId?.toString() ?? '');
    const imgFile = attachmentInfo?.file;
    if (imgFile)
      data.append('image', imgFile);
    return commonAjaxPostCalls(contextPath('api/asrama/student-points/insert'), data, 'multipart/form-data');
  }
  public getClasses() {
    return commonAjaxGetCalls(contextPath('api/admin/school-data/classlevels'));
  }
  public getStudentWithPoints(filter: Filter) {
    const q = Filter.queryString(filter);
    return commonAjaxGetCalls(contextPath(`api/asrama/student-points${q}`));
  }
  public getCategories() {
    return commonAjaxGetCalls(contextPath('api/admin/asrama/rule-categories?order=name'));
  }
  public followUp = (pointRecordId: number): Promise<WebResponse> => {
    return commonAjaxPostCalls(contextPath('api/dormitorymanagement/followup'), {
      record_id: pointRecordId
    });
  }
  public getFollowUpReminders = (): Promise<WebResponse> => {
    return commonAjaxPostCalls(contextPath('api/dormitorymanagement/followupreminders'), {});
  }
  public getRaporData = (classId: string): Promise<WebResponse> => {
    return commonAjaxGetCalls(contextPath(`api/asrama/report/load-data/${classId}`));
  }
  public downloadRaporData = (classId: string): Promise<any> => {
    // return commonAjaxPostCallsWithBlob(endpoint, request);
    return commonAjaxGetCallsWithBlob(contextPath(`api/asrama/report/load-data-xls/${classId}`));
  }


  public submitMedicalRecord = (record: MedicalRecord) => {
    return commonAjaxPostCalls(contextPath('api/dormitorymanagement/submitmedicalrecord'), record)
  }
  public loadMonthlyMedicalRecord = (studentId: number, month: number, year: number) => {
    const req: WebRequest = {
      filter: {
        fieldsFilter: { student_id: studentId }
      }
    }
    return commonAjaxPostCalls(contextPath('api/dormitorymanagement/monthlymedicalrecord'), req)
  }

  public setPointDropped = (id: number, dropped: boolean) => {
    const path = dropped ? contextPath('api/asrama/student-points/drop-points') : contextPath('api/asrama/student-points/undrop-points');
    return commonAjaxPostCalls(`${path}?id=${id}`);
  }

  /**
   * pemutihan
   * @param ids 
   */
  public dropAll = (ids: number[]) => {
    const path = contextPath('api/asrama/student-points/drop-points');
    const q = '?' + ids.map(id => `id=${id}`).join('&');
    return commonAjaxPostCalls(path + q);
  }
  /**
   * reset pemutihan
   * @param ids 
   */
  public undropAll = (ids: number[]) => {
    const path = contextPath('api/asrama/student-points/undrop-points');
    const q = '?' + ids.map(id => `id=${id}`).join('&');
    return commonAjaxPostCalls(path + q);
  }
}
