
import BaseEntity from './BaseEntity';
import Category from './Category';
export default class RulePoint extends BaseEntity {
    ruleCategoryName?: string;
    ruleCategoryId?: any;
    name?: string;
    description?: string;
    point: number = 1;
    droppable?: boolean = true;
}