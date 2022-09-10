
import BaseEntity from './BaseEntity';
export default class RulePoint extends BaseEntity {
    ruleCategoryName?: string;
    ruleCategoryId?: number;
    name?: string;
    description?: string;
    point = 0;
    droppable = true;
}