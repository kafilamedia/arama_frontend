
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

export default class WebRequest {
	record_id?: any;
	employee_id?: any;
	active?: boolean;
	applicationProfile?: ApplicationProfile;
	filter?: Filter;

	payload?: any;
	modelName?: string;

	attachmentInfo?: AttachmentInfo;
	attachmentInfo2?: AttachmentInfo;
	attachmentInfo3?: AttachmentInfo;
	attachmentInfo4?: AttachmentInfo;

	items?: any[]
}
