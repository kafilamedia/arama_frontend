
import React, { ChangeEvent } from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Filter from './../../../models/Filter';
import Category from './../../../models/Category';
import MasterDataService from './../../../services/MasterDataService';
import WebResponse from './../../../models/WebResponse';
import WebRequest from './../../../models/WebRequest';
import FormGroup from './../../form/FormGroup';
import NavigationButtons from './../../navigation/NavigationButtons';
import Modal from './../../container/Modal';
import EditDeleteButton from './EditDeleteButton'
import { tableHeader } from './../../../utils/CollectionUtil';
class State {
    items: Category[] = [];
    filter: Filter = new Filter();
    totalData: number = 0;
    record: Category = new Category();

}
class CategoryManagement extends BaseComponent {
    state: State = new State();
    masterDataService: MasterDataService;
    formRef:React.RefObject<Modal> = React.createRef();
    constructor(props) {
        super(props, true);
        this.state.filter.limit = 10;
        this.masterDataService = this.getServices().masterDataService;
    }
    itemsLoaded = (response: WebResponse) => {
        this.setState({ items: response.items, totalData: response.totalData });
    }
    updateFilter = (e: ChangeEvent) => {
        const filter = this.state.filter;
        const target = (e.target as any);
        filter[target.name] = target.value;
        this.setState({ filter: filter })
    }
    updateFieldsFilter = (e: ChangeEvent) => {
        const filter = this.state.filter;
        const target = (e.target as any);
        if (!filter.fieldsFilter) {
            filter.fieldsFilter = {};
        }
        filter.fieldsFilter[target.name] = target.value;
        this.setState({ filter: filter })
    }
    loadAtPage = (page: number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter }, this.loadItems);
    }
    loadItems = () => {
        const request: WebRequest = {
            filter: this.state.filter,
            modelName: 'category'
        }
        this.commonAjax(
            this.masterDataService.list,
            this.itemsLoaded,
            this.showCommonErrorAlert,
            request
        )
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadItems();
    }
    updateRecordProp = (e: ChangeEvent) => {
        const target = e.target as any;
        const record = this.state.record;
        record[target.name] = target.value;
        this.setState({ record: record });
    }
    recordUpdated = (response: WebResponse) => {
        this.setState({ record: new Category() }, () => {
            if (this.formRef.current) {
                this.formRef.current.hideModal();
            }
            this.showInfo("Success Update");
            this.loadItems();
        });
    }
    onSubmit = () => {
        console.debug("RECORD: ", this.state.record);
        this.showConfirmation("Submit Data?")
            .then(ok => {
                if (!ok) return;

                const request: WebRequest = {
                    category: this.state.record,
                    modelName: 'category'
                }
                this.commonAjax(
                    this.masterDataService.update,
                    this.recordUpdated,
                    this.showCommonErrorAlert,
                    request
                )
            })
    }
    oneRecordLoaded = (item:any) => {
        this.setState({record:item}, ()=>{
            if (this.formRef.current) {
                this.formRef.current.showModal();
            }
        })
    }
    resetForm = () => {
        this.setState({record:new Category()});
    }
    render() {
        const filter: Filter = this.state.filter;
        return (
            <div className="container-fluid section-body">
                <h2>Category Management</h2>
                <hr />
                <RecordForm formRef={this.formRef} resetForm={this.resetForm} onSubmit={this.onSubmit} record={this.state.record} updateRecordProp={this.updateRecordProp} />
                <form onSubmit={(e) => { e.preventDefault(); this.loadAtPage(0) }}>
                    <FormGroup label="Search">
                        <input name="name" placeholder="Search by name" className="form-control" value={filter.fieldsFilter ? filter.fieldsFilter['name'] : ""} onChange={this.updateFieldsFilter} />
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
const ItemsList = (props: {startingNumber:number, items:Category[], recordLoaded(item:any), recordDeleted()}) => {

    return (
        <div style={{overflow:'scroll'}}>
        <table className="table table-striped">
            {tableHeader("No", "Name", "Description", "Option")}
            <tbody>
                    {props.items.map((item, i)=>{

                        return (
                            <tr key={"category-"+i}>
                                <td>{i+1+props.startingNumber}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td><EditDeleteButton 
                                    recordLoaded={props.recordLoaded}
                                    recordDeleted={props.recordDeleted}
                                    record={item} modelName={'category'}/></td>
                            </tr>
                        )
                    })}
                </tbody>
        </table>
        </div>
    )
}
const RecordForm = (props: { formRef:React.RefObject<Modal>, updateRecordProp(e: ChangeEvent): any, resetForm():any, onSubmit(): any, record: Category }) => {

    return (
        <form onSubmit={(e) => { e.preventDefault(); props.onSubmit() }}>
            <Modal show={false} ref={props.formRef} toggleable={true} title="Record Form" >
                <FormGroup label="Name"><input value={props.record.name ?? ""} onChange={props.updateRecordProp} className="form-control" name="name" /></FormGroup>
                <FormGroup label="Description">
                    <textarea className="form-control" name="description" onChange={props.updateRecordProp} value={props.record.description ?? ""} />
                </FormGroup>
                <FormGroup>
                    <input type="submit" className="btn btn-primary" />
                    &nbsp;
                    <input type="reset" className="btn btn-secondary" onClick={props.resetForm} />
                </FormGroup>
            </Modal>
        </form>
    )
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(CategoryManagement)
)