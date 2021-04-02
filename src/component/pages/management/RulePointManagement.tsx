import React, { ChangeEvent } from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import RulePoint from './../../../models/RulePoint';
import Filter from './../../../models/Filter';
import MasterDataService from './../../../services/MasterDataService';
import Modal from './../../container/Modal';
import FormGroup from './../../form/FormGroup';
import WebRequest from './../../../models/WebRequest';
import NavigationButtons from './../../navigation/NavigationButtons';
import EditDeleteButton from './EditDeleteButton';
import { tableHeader } from './../../../utils/CollectionUtil';
import BaseManagementPage from './BaseManagementPage';
import Category from './../../../models/Category';
import WebResponse from './../../../models/WebResponse';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
class State {
    items: RulePoint[] = [];
    filter: Filter = new Filter();
    totalData: number = 0;
    record: RulePoint = new RulePoint();
    categories: Category[] = [];
    categoriesLoaded:boolean = false;

}
class RulePointManagement extends BaseManagementPage
{
    state: State = new State();
    
    constructor(props) {
        super(props, 'rulepoint');
        this.state.filter.limit = 10;
    }

    onSubmit = () => {
        console.debug("RECORD: ", this.state.record);
        this.showConfirmation("Submit Data?")
            .then(ok => {
                if (!ok) return;

                const request: WebRequest = {
                    rulePoint: this.state.record,
                    modelName: this.modelName
                }
                this.callApiSubmit(request);
            })
    }
    categoriesLoaded = (response: WebResponse) => {
        this.setState({categories:response.items, categoriesLoaded: true}, this.resetForm);
    }
    categoriesNotLoaded = (response: WebResponse) => {
        this.setState({categories: [], categoriesLoaded: true}, this.resetForm);
    }
    loadCategories = () => {
        const filter:Filter = new Filter();
        filter.limit = 0;
        const req:WebRequest = {
            filter: filter,
            modelName: 'category'
        }
        this.commonAjax(
            this.masterDataService.list,
            this.categoriesLoaded,
            this.categoriesNotLoaded,
            req
        )
    }
    componentDidMount = () => {
        super.componentDidMount();
        this.loadCategories();
    }
    emptyRecord = ():any => {
        const record = new RulePoint();
        if (this.state.categories.length > 0) {
            record.category_id = this.state.categories[0].id;
        }
        return record;
    }
    
    render() {
        const filter: Filter = this.state.filter;
        const categories: Category[] = this.state.categories;
        if (this.state.categoriesLoaded && categories.length == 0) {
            return (
                <div className="container-fluid section-body">
                    <h2>Please insert categories record</h2>
                </div>
            )
        }
        const selectedCategoryId = filter.fieldsFilter && filter.fieldsFilter['category_id'] ? filter.fieldsFilter['category_id'] : "ALL";
        return (
            <div className="container-fluid section-body">
                <h2>Rule Point Management</h2>
                <hr />
                <RecordForm categories={categories} reloadCategories={this.loadCategories} formRef={this.formRef} resetForm={this.resetForm} onSubmit={this.onSubmit} record={this.state.record} updateRecordProp={this.updateRecordProp} />
                <form onSubmit={(e) => { e.preventDefault(); this.loadAtPage(0) }}>
                    <FormGroup label="Search">
                        <input name="name" placeholder="Search by name" className="form-control" value={filter.fieldsFilter ? filter.fieldsFilter['name'] : ""} onChange={this.updateFieldsFilter} />
                    </FormGroup>
                    <FormGroup label="Category">
                    <div className="input-group">
                        <select value={selectedCategoryId} className="form-control" name="category_id" onChange={this.updateFieldsFilter} >
                            {[{id:"ALL", name:"ALL"},...categories].map((c)=>{

                                return <option key={"filter-cat-"+c.id} value={c.id}>{c.name}</option>
                            })}
                        </select>
                        <div className="input-group-append">
                        <AnchorWithIcon iconClassName="fas fa-redo" onClick={this.loadCategories}>Reload</AnchorWithIcon>
                        </div>
                    </div>
                </FormGroup>
                    <FormGroup label="Record Count">
                        <input name="limit" className="form-control" value={filter.limit ?? 5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup>
                        <input className="btn btn-primary" type="submit" value="Submit" />
                    </FormGroup>
                </form>
                <NavigationButtons activePage={filter.page ?? 0} limit={filter.limit ?? 5} totalData={this.state.totalData}
                    onClick={this.loadAtPage} />
                <ItemsList 
                    recordLoaded={this.oneRecordLoaded}
                    recordDeleted={this.loadItems}
                    startingNumber={(filter.page??0)*(filter.limit??10)} items={this.state.items} />
            </div>
        )
    }

}
const ItemsList = (props: {startingNumber:number, items:RulePoint[], recordLoaded(item:any), recordDeleted()}) => {

    return (
        <div style={{overflow:'scroll'}}>
        <table className="table table-striped">
            {tableHeader("No", "Name", "Point", "Description", "Category", "Droppable", "Option")}
            <tbody>
                    {props.items.map((item, i)=>{

                        return (
                            <tr key={"RulePoint-"+i}>
                                <td>{i+1+props.startingNumber}</td>
                                <td>{item.name}</td>
                                <td>{item.point}</td>
                                <td>{item.description}</td>
                                <td>{item.category?.name}</td>
                                <td>{item.droppable ? "Yes" : "No"}</td>
                                <td><EditDeleteButton 
                                    recordLoaded={props.recordLoaded}
                                    recordDeleted={props.recordDeleted}
                                    record={item} modelName={'rulepoint'}/></td>
                            </tr>
                        )
                    })}
                </tbody>
        </table>
        </div>
    )
}
const RecordForm = (props: { categories:Category[], formRef:React.RefObject<Modal>, 
    updateRecordProp(e: ChangeEvent): any, 
    resetForm():any, 
    onSubmit(): any, record: RulePoint, reloadCategories():any }) => {

    return (
        <form onSubmit={(e) => { e.preventDefault(); props.onSubmit() }}>
            <Modal show={false} ref={props.formRef} toggleable={true} title="Record Form" >
                <FormGroup label="Name"><input value={props.record.name ?? ""} onChange={props.updateRecordProp} className="form-control" name="name" /></FormGroup>
                <FormGroup label="Point"><input type="number" value={props.record.point} onChange={props.updateRecordProp} className="form-control" name="point" /></FormGroup>
                <FormGroup label="Description">
                    <textarea className="form-control" name="description" onChange={props.updateRecordProp} value={props.record.description ?? ""} />
                </FormGroup>
                <FormGroup label="Droppable">
                    <select className="form-control" data-type="boolean" name="droppable" onChange={props.updateRecordProp} value={props.record.droppable == true ? "true":"false"} >
                        <option value={"true"} >Yes</option>
                        <option value={"false"}>No</option>
                    </select>
                </FormGroup>
                <FormGroup label="Category">
                    <div className="input-group">
                        <select value={props.record.category_id} className="form-control" name="category_id" onChange={props.updateRecordProp} >
                            {props.categories.map((c)=>{

                                return <option key={"cat-"+c.id} value={c.id}>{c.name}</option>
                            })}
                        </select>
                        <div className="input-group-append">
                        <AnchorWithIcon iconClassName="fas fa-redo" onClick={props.reloadCategories}>Reload</AnchorWithIcon>
                        </div>
                    </div>
                </FormGroup>
                <FormGroup>
                    <input type="submit" className="btn btn-primary" />
                    &nbsp;
                    <input value="Reset" type="reset" className="btn btn-secondary" onClick={(e)=>props.resetForm()} />
                </FormGroup>
            </Modal>
        </form>
    )
}



export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(RulePointManagement)
)