import React, { FormEvent } from 'react'
import BaseComponent from '../../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import Card from '../../../container/Card';
import FormGroup from '../../../form/FormGroup';
import Student from '../../../../models/Student';
import MasterDataService from '../../../../services/MasterDataService';
import WebRequest from '../../../../models/commons/WebRequest';
import WebResponse from '../../../../models/commons/WebResponse';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import Class from '../../../../models/Class';
class State {
    studentName?:string;
    items:Student[] = [];
    item?:Student;
}
class StudentForm extends BaseComponent{

    state:State = new State();
    masterDataService:MasterDataService;
    constructor(props) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
    }

    submit = (e:FormEvent) => {
        e.preventDefault();
        this.loadStudent();
    }
    itemsLoaded = (response: WebResponse) => {
        this.setState({items: response.items});
    }
    loadStudent = () => {
        const request:WebRequest = {
            modelName:'student',
            filter:{
                limit: 15,
                fieldsFilter: {  name:this.state.studentName  }
            }
        }
        this.commonAjax(
            this.masterDataService.list,
            this.itemsLoaded,
            this.showCommonErrorAlert,
            request
        )
    }
    setSelectedItem = (item:Student) => {
        this.setState({item:item,  items:[], studentName:undefined}, ()=> {
            if (this.props.setItem) {
                this.props.setItem(item);
            }
        });
    }
    reset = () => {
        this.setState({item:undefined, items:[], studentName:undefined}, () => {
            if (this.props.setItem) {
                this.props.setItem(undefined);
            }
        });
    }
    render() {
        const items:Student[] = this.state.items;
        const selectedItem:Student | undefined = this.state.item;
        return (
            <form onReset={this.reset} onSubmit={this.submit}>
                <Card title="Select Student">
                    <FormGroup label="Search">
                        <input placeholder="Name" value={this.state.studentName??""} className="form-control" onChange={this.handleInputChange} name="studentName" />
                        {items.length > 0?<div style={{position:'absolute', zIndex: 200}} className="container-fluid bg-light rounded-sm border border-dark">
                                {items.map(item=>{
                                    return (
                                        <div className="option-item"onClick={()=>{
                                            this.setSelectedItem(item);
                                        }} style={{cursor: 'pointer'}} key={"Student-"+item.id} >{item.user?.name}</div>
                                    )
                                })}
                                <a onClick={this.reset} className="option-item"><i className="fas fa-times"/>&nbsp;close</a>
                            </div>:null}
                    </FormGroup>
                    {selectedItem?
                    <ItemDetail item={selectedItem} />
                    :null}
                    <hr/>
                    <div className="btn-group float-right">
                        <input type="submit" className="btn btn-dark" value="Search" />
                        <input type="reset" className="btn btn-secondary" value="Reset" />
                        <AnchorWithIcon to={"/asrama/studentlist"} iconClassName="fas fa-list">Student List</AnchorWithIcon>
                    </div>
                </Card>
            </form>
        )
    }
}

const ItemDetail = (props:{item:Student}) => {

    return (
        <>
            <FormGroup label="Name">{props.item.user?.name}</FormGroup>
            <FormGroup label="Kelas">{Class.studentClassString(props.item)}</FormGroup>
            
        </>
    )
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(StudentForm)
)