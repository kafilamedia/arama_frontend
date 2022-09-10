
import AttachmentInfo from './../settings/AttachmentInfo';
import Filter from './Filter';

export default class WebRequest {
	record_id?: any;
	filter?: Filter;
	payload?: any;
	modelName?: string;
	attachmentInfo?: AttachmentInfo;
	items?: any[]
}
