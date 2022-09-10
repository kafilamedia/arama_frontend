
import BaseEntity from './BaseEntity';
import RulePoint from './RulePoint';
export default class Category extends BaseEntity {
    name?:string;
    description?:string;
    //TODO: remove field
    points:RulePoint[] | undefined;

    static clone = (object:any) : Category => {
        return Object.assign(new Category, object);
    }
}