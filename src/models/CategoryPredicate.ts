
import BaseEntity from './BaseEntity';
import Category from './Category';
export default class CategoryPredicate extends BaseEntity
{
    name:string | undefined;
    description:string | undefined;
    category:Category | undefined;
    category_id: number | undefined;
}