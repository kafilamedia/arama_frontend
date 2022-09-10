
import BaseEntity from './BaseEntity';
export default class CategoryPredicate extends BaseEntity {
    name: string | undefined;
    code = 'A';
    description: string | undefined;
    ruleCategoryName: string;
    ruleCategoryId: number | undefined;
}