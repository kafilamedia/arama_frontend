import React, { ChangeEvent } from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import RulePoint from './../../../models/RulePoint';
import Filter from '../../../models/commons/Filter';
import MasterDataService from './../../../services/MasterDataService';
import Modal from './../../container/Modal';
import FormGroup from './../../form/FormGroup';
import WebRequest from '../../../models/commons/WebRequest';
import NavigationButtons from './../../navigation/NavigationButtons';
import EditDeleteButton from './EditDeleteButton';
import { tableHeader } from './../../../utils/CollectionUtil';
import BaseManagementPage from './BaseManagementPage';
import Category from './../../../models/Category';
import WebResponse from '../../../models/commons/WebResponse';
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
        // console.debug("RECORD: ", this.state.record);
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
    componentDidMount() {
        this.validateLoginStatus(()=>{
            this.scrollTop();
            this.loadCategories();
        });
    }
    categoriesLoaded = (response: WebResponse) => {
        this.setState({categories:response.items, categoriesLoaded: true}, ()=>{ this.resetForm(); this.loadItems() });
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
                    <h2>Kategori pelanggaran belum ada</h2>
                </div>
            )
        }
        const selectedCategoryId = filter.fieldsFilter && filter.fieldsFilter['category_id'] ? filter.fieldsFilter['category_id'] : "ALL";
        return (
            <div className="container-fluid section-body">
                <h2>Poin Pelanggaran</h2>
                <hr />
                <RecordForm categories={categories} reloadCategories={this.loadCategories} formRef={this.formRef} resetForm={this.resetForm} onSubmit={this.onSubmit} record={this.state.record} updateRecordProp={this.updateRecordProp} />
                <form onSubmit={this.reload}>
                <FormGroup label="Cari">
                    <div className="input-group">
                        <input name="name" placeholder="nama" className="form-control-sm" value={filter.fieldsFilter ? filter.fieldsFilter['name'] : ""} onChange={this.updateFieldsFilter} />
                        <select value={selectedCategoryId} className="form-control-sm" name="category_id" onChange={this.updateFieldsFilter} >
                            {[{id:"", name:"Semua Kategori"},...categories].map((c)=>{
                                return <option key={"filter-cat-"+c.id} value={c.id}>{c.name}</option>
                            })}
                        </select>
                        <div className="input-group-append">
                            <AnchorWithIcon className="btn btn-sm" iconClassName="fas fa-redo" onClick={this.loadCategories}>Reload</AnchorWithIcon>
                        </div>
                    </div>
                </FormGroup>
                    <FormGroup label="Jumlah Tampilan">
                        <input type="number" name="limit" className="form-control-sm" value={filter.limit ?? 5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup>
                        <input className="btn btn-primary btn-sm" type="submit" value="Submit" />
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
            {tableHeader("No", "Nama", "Poin", "Deskripsi", "Kategori", "Dapat diputihkan", "Opsi")}
            <tbody>
                    {props.items.map((item, i)=>{
                        return (
                            <tr key={`RulePoint-${i}`}>
                                <td>{i+1+props.startingNumber}</td>
                                <td>{item.name}</td>
                                <td>{item.point}</td>
                                <td>{item.description}</td>
                                <td>{item.category?.name}</td>
                                <td>{item.droppable ? "Ya" : "TIdak"}</td>
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
        <form className="record-form mb-3" onSubmit={(e) => { e.preventDefault(); props.onSubmit() }}>
            <Modal show={false} ref={props.formRef} toggleable={true} title="Record Form" >
                <FormGroup label="Nama"><input value={props.record.name ?? ""} onChange={props.updateRecordProp} className="form-control-sm" name="name" required/></FormGroup>
                <FormGroup label="Poin"><input type="number" value={props.record.point} onChange={props.updateRecordProp} className="form-control-sm" name="point" required/></FormGroup>
                <FormGroup label="Deskripsi">
                    <textarea className="form-control" name="description" onChange={props.updateRecordProp} value={props.record.description ?? ""}  />
                </FormGroup>
                <FormGroup label="Dapat diputihkan">
                    <select className="form-control-sm" data-type="boolean" name="droppable" onChange={props.updateRecordProp} value={props.record.droppable == true ? "true":"false"} required>
                        <option value={"true"} >Ya</option>
                        <option value={"false"}>Tidak</option>
                    </select>
                </FormGroup>
                <FormGroup label="Category">
                    <div className="input-group">
                        <select required value={props.record.category_id} className="form-control-sm" name="category_id" onChange={props.updateRecordProp} >
                            {props.categories.map((c)=>{

                                return <option key={"cat-"+c.id} value={c.id}>{c.name}</option>
                            })}
                        </select>
                        <div className="input-group-append">
                        <AnchorWithIcon className="btn btn-sm" iconClassName="fas fa-redo" onClick={props.reloadCategories}>Reload</AnchorWithIcon>
                        </div>
                    </div>
                </FormGroup>
                <FormGroup>
                    <input type="submit" value="Submit" className="btn btn-primary btn-sm" />
                    &nbsp;
                    <input value="Reset" type="reset" className="btn btn-secondary btn-sm" onClick={(e)=>props.resetForm()} />
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