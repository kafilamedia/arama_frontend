 
import User from '../User';
import ApplicationProfile from '../ApplicationProfile';
import Filter from './Filter';
import Category from '../Category';
import RulePoint from '../RulePoint';
import PointRecord from '../PointRecord';
import AttachmentInfo from './../settings/AttachmentInfo';
import MedicalRecord from './../MedicalRecord';
import WarningAction from '../WarningAction';
import CategoryPredicate from './../CategoryPredicate';
import RuleViolation from './../RuleViolation';

export default class WebRequest{
	 employee_id?:any;
	 active?:boolean;
	 user?:User;
	 applicationProfile?:ApplicationProfile;
	 filter?:Filter;

	 category?:Category;
	 rulePoint?:RulePoint;
	 pointRecord?:PointRecord;
	 modelName?:string;
	 record_id?:any;
	 medicalRecord?:MedicalRecord;
	 warningAction?:WarningAction;
	 categoryPredicate?:CategoryPredicate;
	 ruleViolation?:RuleViolation;

	 attachmentInfo?:AttachmentInfo;
	 attachmentInfo2?:AttachmentInfo;
	 attachmentInfo3?:AttachmentInfo;
	 attachmentInfo4?:AttachmentInfo;

	 items?:any[]
}
