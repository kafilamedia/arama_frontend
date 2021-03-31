import React, { ChangeEvent } from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Student from './../../../models/Student';
import StudentService from './../../../services/StudentService';
import Filter from './../../../models/Filter';
import WebResponse from './../../../models/WebResponse';
import AnchorButton from './../../navigation/AnchorButton';
import Class from './../../../models/Class';
import FormGroup from './../../form/FormGroup';
import NavigationButtons from './../../navigation/NavigationButtons';
import { tableHeader } from './../../../utils/CollectionUtil';
class State{
    items:Student[] = [];
    classes:Class[] = [];
    totalData:number = 0;
    filter:Filter = new Filter();
}
class StudentList extends BaseComponent {
    state:State = new State();
    studentService:StudentService;
    constructor(props) {
        super(props, true);
        this.studentService = this.getServices().studentService;
        this.state.filter.limit = 10;
        this.state.filter.fieldsFilter = {
            'class_id':'ALL'
        }
    }
    itemsLoaded = (response:WebResponse) => {
        this.setState({items:response.items, totalData: response.totalData});
    }
    classesLoaded = (response:WebResponse) => {
        this.setState({classes:response.items}, this.loadItems);
    }
    loadItems = () => {
        this.commonAjax(
            this.studentService.getList,
            this.itemsLoaded,
            this.showCommonErrorAlert,
            this.state.filter
        )
    }
    loadAtPage = (page:number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({filter:filter}, this.loadItems);
    }
    loadClasses = () => {
        this.commonAjax(
            this.studentService.getClasses,
            this.classesLoaded,
            this.showCommonErrorAlert,
        )
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadClasses();
    }
    updateSelectedClass = (e:ChangeEvent) => {
        const target = e.target as HTMLSelectElement;
        const filter = this.state.filter;
        if (!filter.fieldsFilter) {
            filter.fieldsFilter = {};
        }
        filter.fieldsFilter['class_id'] = target.value;
        this.setState({filter:filter});
    }
    updateFilter = (e:ChangeEvent) => {
        const filter = this.state.filter;
        const target = (e.target as any);
        filter[target.name] = target.value;
        this.setState({filter: filter})
    }
    updateFieldsFilter = (e:ChangeEvent) => {
        const filter = this.state.filter;
        const target = (e.target as any);
        if (!filter.fieldsFilter) {
            filter.fieldsFilter = {};
        }
        filter.fieldsFilter[target.name] = target.value;
        this.setState({filter: filter})
    }
    render() {
        const filter = this.state.filter;
        const classes = this.state.classes;
        const classAll:Class = { id:"ALL", level:"ALL", sekolah:{} };
        const selectedClassId = filter.fieldsFilter && filter.fieldsFilter['class_id'] ? filter.fieldsFilter['class_id'] : "ALL";
        return (
            <div className="container-fluid section-body">
                <h2>Student List</h2>
                
                <form onSubmit={(e)=>{e.preventDefault();this.loadAtPage(0)}}>
                    <FormGroup label="Search">
                        <input name="name" placeholder="Search by name" className="form-control" value={filter.fieldsFilter?filter.fieldsFilter['name']:""} onChange={this.updateFieldsFilter} />
                    </FormGroup>
                    <FormGroup label="Record Count">
                        <input name="limit" className="form-control" value={filter.limit??5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup label="Kelas" >
                        <select value={selectedClassId} onChange={this.updateFieldsFilter } className="form-control" name="class_id">
                            {[classAll,...classes].map((_class )=>{
                                return <option key={'class_'+_class.id} value={_class.id}>{_class.level}{_class.rombel} - {_class.sekolah?.nama}</option>
                            })}
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <input type="submit" className="btn btn-primary" value="Submit" />
                    </FormGroup>
                </form>
                <NavigationButtons onClick={this.loadAtPage} activePage={filter.page??0} limit={filter.limit??10} totalData={this.state.totalData} />
                <ItemsList startingNumber={(filter.page??0)*(filter.limit??10)} items={this.state.items} />
            </div>
        )
    }
}

const ItemsList = (props:{startingNumber:number, items:Student[]}) => {

    return (
        <div style={{overflow:'scroll'}}>
            <table className="table table-striped">
                {tableHeader("No", "Name", "Kelas")}
                <tbody>
                    {props.items.map((student, i)=>{

                        return (
                            <tr key={"student-"+i}>
                                <td>{i+1+props.startingNumber}</td>
                                <td>{student.user?.name}</td>
                                <td>{student.kelas?.level} {student.kelas?.rombel} {student.kelas?.sekolah?.nama}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default withRouter(connect(
    mapCommonUserStateToProps
)(StudentList))