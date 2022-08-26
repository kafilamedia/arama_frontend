
import BaseEntity from './BaseEntity';
import Category from './Category';
export default class CategoryPredicate extends BaseEntity {
    name: string | undefined;
    code = 'A';
    description: string | undefined;
    ruleCategoryName;
    ruleCategoryId: number | undefined;
}