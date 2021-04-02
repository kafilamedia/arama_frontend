
import BaseEntity from './BaseEntity';
import Category from './Category';
export default class RulePoint extends BaseEntity
{
    
    category?:Category;
    category_id?:any;
    name?:string;
    description?:string;
    point:number = 1;
    droppable?:boolean = true;
}