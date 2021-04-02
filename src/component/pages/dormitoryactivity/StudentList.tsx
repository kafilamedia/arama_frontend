import React, { ChangeEvent } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import Student from '../../../models/Student';
import StudentService from '../../../services/StudentService';
import Filter from '../../../models/Filter';
import WebResponse from '../../../models/WebResponse';
import Class from '../../../models/Class';
import FormGroup from '../../form/FormGroup';
import NavigationButtons from '../../navigation/NavigationButtons';
import { tableHeader } from '../../../utils/CollectionUtil';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import MasterDataService from '../../../services/MasterDataService';
import BaseManagementPage from '../management/BaseManagementPage';
import Spinner from '../../loader/Spinner';
class State {
    items: Student[] = [];
    classes: Class[] = [];
    totalData: number = 0;
    filter: Filter = new Filter();
    loading:boolean = false;
}
class StudentList extends BaseManagementPage {
    state: State = new State();
    studentService: StudentService;
    masterDataService: MasterDataService;
    constructor(props) {
        super(props);
        this.studentService = this.getServices().studentService;
        this.masterDataService = this.getServices().masterDataService;
        this.state.filter.limit = 10;
        this.state.filter.fieldsFilter = {
            'class_id': 'ALL'
        }
    }
    startLoading = () => this.setState({ loading: true });
    endLoading = () => this.setState({ loading: false });
    itemsLoaded = (response: WebResponse) => {
        this.setState({ items: response.items, totalData: response.totalData });
    }
    classesLoaded = (response: WebResponse) => {
        this.setState({ classes: response.items }, this.loadItems);
    }
    loadItems = () => {
        this.commonAjax(
            this.masterDataService.list,
            this.itemsLoaded,
            this.showCommonErrorAlert,
            {
                modelName:'student',
                filter:this.state.filter
            }
        )
    }
    loadAtPage = (page: number) => {
        const filter = this.state.filter;
        filter.page = page;
        this.setState({ filter: filter }, this.loadItems);
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
    updateSelectedClass = (e: ChangeEvent) => {
        const target = e.target as HTMLSelectElement;
        const filter = this.state.filter;
        if (!filter.fieldsFilter) {
            filter.fieldsFilter = {};
        }
        filter.fieldsFilter['class_id'] = target.value;
        this.setState({ filter: filter });
    } 
    inputPoint = (student: Student) => {
        this.props.history.push({
            pathname: "/dormitoryactivity/inputpoint",
            state: { student: student }
        })
    }
    render() {
        const filter = this.state.filter;
        const classes = this.state.classes;
        const classAll: Class = { id: "ALL", level: "ALL", sekolah: {} };
        const selectedClassId = filter.fieldsFilter && filter.fieldsFilter['class_id'] ? filter.fieldsFilter['class_id'] : "ALL";
        return (
            <div className="container-fluid section-body">
                <h2>Student List</h2>
                <hr />
                <form onSubmit={(e) => { e.preventDefault(); this.loadAtPage(0) }}>

                    <FormGroup label="Search">
                        <input name="name" placeholder="Search by name" className="form-control" value={filter.fieldsFilter ? filter.fieldsFilter['name'] : ""} onChange={this.updateFieldsFilter} />
                    </FormGroup>
                    <FormGroup label="Record Count">
                        <input name="limit" className="form-control" value={filter.limit ?? 5} onChange={this.updateFilter} />
                    </FormGroup>
                    <FormGroup label="Kelas" >
                        <select value={selectedClassId} onChange={this.updateFieldsFilter} className="form-control" name="class_id">
                            {[classAll, ...classes].map((_class) => {
                                return <option key={'class_' + _class.id} value={_class.id}>{_class.level}{_class.rombel} - {_class.sekolah?.nama}</option>
                            })}
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <input type="submit" className="btn btn-primary" value="Submit" />
                    </FormGroup>

                </form>
                <p />
                <NavigationButtons onClick={this.loadAtPage} activePage={filter.page ?? 0} limit={filter.limit ?? 10} totalData={this.state.totalData} />
                <ItemsList loading={this.state.loading} inputPoint={this.inputPoint} startingNumber={(filter.page ?? 0) * (filter.limit ?? 10)} items={this.state.items} />
            </div>
        )
    }
}

const ItemsList = (props: { loading:boolean, startingNumber: number, inputPoint(s: Student): any, items: Student[] }) => {

    return (
        <div style={{ overflow: 'scroll' }}>
            <table className="table table-striped">
                {tableHeader("No", "", "Name", "Kelas" )}
                <tbody>
                    {props.loading?
                    <tr>
                       <td colSpan={4}>
                           <Spinner/>
                        </td> 
                    </tr>
                    
                    :props.items.map((student, i) => {

                        return (
                            <tr key={"student-" + i}>
                                <td>{i + 1 + props.startingNumber}</td>
                                <td><AnchorWithIcon className="btn" onClick={(e) => props.inputPoint(student)} iconClassName="far fa-edit" /></td>
                                <td>
                                {student.user?.name}</td>
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