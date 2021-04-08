 
import User from '../User';
import ApplicationProfile from '../ApplicationProfile';
import Filter from './Filter';
import Category from '../Category';
import RulePoint from '../RulePoint';
import PointRecord from '../PointRecord';
import AttachmentInfo from './../settings/AttachmentInfo';
import MedicalRecord from './../MedicalRecord';

export default class WebRequest{
	 employee_id?:any;
	 active?:boolean;
	 user?:User;
	 profile?:ApplicationProfile;
	 filter?:Filter;

	 category?:Category;
	 rulePoint?:RulePoint;
	 pointRecord?:PointRecord;
	 modelName?:string;
	 record_id?:any;
	 medicalRecord?:MedicalRecord;

	 attachmentInfo?:AttachmentInfo;
}
