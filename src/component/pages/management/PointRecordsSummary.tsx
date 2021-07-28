import React, { ChangeEvent } from 'react'
import BaseManagementPage from './BaseManagementPage';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import EditDeleteButton from './EditDeleteButton'
import PointRecord from '../../../models/PointRecord';
import Filter from '../../../models/commons/Filter';
import FormGroup from '../../form/FormGroup';
import NavigationButtons from '../../navigation/NavigationButtons';
import { tableHeader } from '../../../utils/CollectionUtil';
import Spinner from '../../loader/Spinner';
import FilterPeriod from '../../form/FilterPeriod';
import PointRecordDetail from '../dormitoryactivity/point-record/PointRecordDetail';
import StudentService from '../../../services/StudentService';
import WebResponse from '../../../models/commons/WebResponse';
import Category from '../../../models/Category';
import Class from '../../../models/Class';
import { MONTHS } from './../../../utils/DateUtil';
class State {
    items: PointRecord[] = [];
    filter: Filter = new Filter();
    totalData: number = 0;
    record?: PointRecord;
    loading: boolean = false;
    categories: Category[] = [];
    classes: Class[] = [];
    selectedCategory:Category| undefined;
    showFilterDetail:boolean = false;
}

class PointRecordSummary extends BaseManagementPage {
    state: State = new State();
    private studentService:StudentService;
    constructor(props) {
        super(props, 'pointrecord', false);
         
        this.studentService = this.getServices().studentService;

        const f = new Filter();
        const d = new Date();
        
        f.limit = 10;
        f.day = f.dayTo = d.getDate();
        f.month = 1; //January
        f.monthTo = d.getMonth() + 1;
        f.year = f.yearTo = d.getFullYear();
        f.fieldsFilter =  {dropped : 'ALL',  class_id : 'ALL', point_name : '', category_name:''  };

        this.state.filter = f;
                                
    }
 
    componentDidMount() {
        super.componentDidMount();
        this.loadCategories();
        this.loadClasses();
    }
    loadClasses = () => {
        this.commonAjax(this.studentService.getClasses,
            this.classessLoaded, console.error)
    }
    loadCategories = () => {
        this.commonAjax(this.studentService.getCategories,
            this.categoriesLoaded, console.error);
    }
    categoriesLoaded = (response:WebResponse) => {
        this.setState({categories: response.items});
    }
    classessLoaded = (response:WebResponse) => {
        this.setState({classes: response.items});
    }
    setSelectedCategory = (cat:Category) => {
        const filter = this.state.filter;
        if (cat.id == "") {
            filter.fieldsFilter['point_name'] = '';
        }
        this.setState({filter: filter, selectedCategory:cat});
    }
    showDetail = (item:PointRecord) => this.setState({record: item}); 
    hideDetail = () => this.setState({record: undefined}, this.scrollTop);
    showFilterDetail = () =>  this.setState({showFilterDetail: true}); 
    hideFilterDetail = () =>  this.setState({showFilterDetail: false}); 
    
    openEditPage = (item:PointRecord) => {
        this.props.history.push({
            pathname: '/dormitoryactivity/pointrecordedit',
              state: {record: item // your data array of objects
              }
         })
        
    }

    render() {
        const filter: Filter = this.state.filter;
        const fieldsFilter = filter.fieldsFilter;
        const title = "Rekap Pelanggaran";
        if (this.state.record) {
            return (
                <div className="container-fluid section-body">
                    <h2>{title}</h2>
                    <PointRecordDetail record={this.state.record} close={this.hideDetail} />
                </div>
            )
        }
        const defaultClass: Class = { id: "ALL", level: "Semua Kelas", sekolah: {} };
        const selectedClassId =  filter.fieldsFilter['class_id'] ? filter.fieldsFilter['class_id'] : "ALL";

        return (
            <div className="container-fluid section-body">
                <h2>{title}</h2>
                <hr />
                <form className="form-filter" onSubmit={this.reload}>
                    <FormGroup label="Cari">
                        <div className="input-group">
                            <input name="name" placeholder="Nama siswa" className="form-control-sm" value={fieldsFilter ? fieldsFilter['name'] : ""} onChange={this.updateFieldsFilter} />
                            <select value={selectedClassId} onChange={this.updateFieldsFilter} className="form-control-sm" name="class_id">
                                {[defaultClass, ...this.state.classes].map((c) => {
                                    return <option key={'class_' + c.id} value={c.id}>{c.level}{c.rombel} - {c.sekolah?.nama}</option>
                                })}
                            </select>  
                        </div>
                    </FormGroup>
                    {this.state.showFilterDetail?
                    <><div  className="filter-sticky bg-white border border-gray pt-3 pb-3 pl-3 pr-3">
                        <FormGroup label="Kategori"> 
                                <select value={filter.fieldsFilter['category_name']} onChange={this.updateFieldsFilter} className="form-control-sm" name="category_name">
                                    {[Object.assign(new Category, {id:"", name:"Semua"}), ...this.state.categories].map((c) => {
                                        return <option onClick={()=>this.setSelectedCategory(c)}  key={'cat_' + c.id} value={c.id == "" ? c.id :c.name}>{c.name}</option>
                                    })}
                                </select> 
                        </FormGroup>
                        {this.state.selectedCategory && this.state.selectedCategory.points?
                            <FormGroup label="Pelanggaran">
                                <select value={filter.fieldsFilter['point_name']} onChange={this.updateFieldsFilter} className="form-control-sm" name="point_name">
                                    {[{id:"", name:"Semua"}, ...this.state.selectedCategory.points].map((c) => {
                                        return <option key={'cat_' + c.id} value={c.id == "" ? c.id :c.name}>{c.name}</option>
                                    })}
                                </select>
                            </FormGroup>:
                        null}
                        <FormGroup label="Periode">
                            <div className="input-group">
                                <FilterPeriod filter={filter} onChange={this.updateFilter} />
                            </div>
                            <div className="input-group">
                                <FilterPeriod mode={"to"} filter={filter} onChange={this.updateFilter} />
                            </div> 
                        </FormGroup>
                        <FormGroup label="Pemutihan">
                            <select name="dropped" className="form-control-sm" value={fieldsFilter ? fieldsFilter['dropped'] : 'ALL'} onChange={this.updateFieldsFilter}>
                                <option value="ALL">All</option>
                                <option value="false">Belum</option>
                                <option value="true">Sudah</option>
                            </select>
                        </FormGroup>
                        <FormGroup label="Jumlah Tampilan">
                            <input type="number" name="limit" className="form-control-sm" value={filter.limit ?? 5} onChange={this.updateFilter} />
                        </FormGroup>
                        <FormGroup label="">
                            <a className="btn btn-dark btn-sm" onClick={this.hideFilterDetail}>Tutup</a>
                        </FormGroup>
                    </div>
                    <FormGroup label="">
                        <a className="btn btn-dark btn-sm" onClick={this.hideFilterDetail}>Tutup Detail Filter</a>
                    </FormGroup>
                    </>
                    :<FormGroup label="">
                        <a className="btn btn-dark btn-sm" onClick={this.showFilterDetail}>Tampil Detail Filter</a>
                    </FormGroup> }
                    <FormGroup label="Periode">
                        {filter.day} {MONTHS[(filter.month ?? 1) - 1]} {filter.year} - {filter.dayTo} {MONTHS[(filter.monthTo ?? 1) - 1]} {filter.yearTo}
                    </FormGroup>
                    <FormGroup>
                        <input className="btn btn-primary btn-sm" type="submit" value="Submit" />
                    </FormGroup>
                </form>

                <NavigationButtons activePage={filter.page ?? 0} limit={filter.limit ?? 10} totalData={this.state.totalData}
                    onClick={this.loadAtPage} />
                <ItemsList startingNumber={(filter.page ?? 0) * (filter.limit ?? 10)} loading={this.state.loading}
                    recordLoadedForDetail={this.showDetail}
                    recordLoadedForEdit={this.openEditPage}
                    recordUpdated={this.loadItems}
                    items={this.state.items} />
            </div>
        )
    }
}

const ItemsList = (props: { 
    loading: boolean, startingNumber: number, 
    items: PointRecord[], recordLoadedForDetail(item: PointRecord):any,
    recordLoadedForEdit(item: PointRecord):any, recordUpdated():any
}) => {

    return (
        <div style={{ overflow: 'scroll' }}>
            <table className="table ">
                {tableHeader("No", "Siswa", "Kelas", "Tanggal", "Pelanggaran", "Poin", "Lokasi", "Gambar", "Pemutihan", "Opsi")}
                <tbody>

                    {props.loading ?
                        <tr><td colSpan={7}><Spinner /></td></tr>
                        : 
                        props.items.map((item, i) => {
                            item = PointRecord.clone(item);
                            const student = item.student;
                            return (
                                <tr key={"PointRecord-" + i}  className={item.dropped_at?"alert alert-success":"" }>
                                    <td>{i + 1 + props.startingNumber}</td>
                                    <td>{item.student?.user?.name}</td>
                                    <td>{Class.studentClassString(student)}</td>
                                    <td>{item.getTimestamp()}</td>
                                    <td>{item.rule_point?.name} ({item.rule_point?.category?.name})</td>
                                    <td>{item.rule_point?.point}</td>
                                    <td>{item.location}</td>
                                    <td>{item.getPicture() ?
                                        <img src={item.getPicture() ?? ""} width={50} height={50} />
                                        : null}</td>
                                    <td>{item.dropped_at ? <i className="fas fa-check"/>  : "-"} </td>
                                    <td>
                                             
                                            {/* <DropPointButtons record={item} onUpdated={props.recordUpdated} /> */}
                                            <EditDeleteButton record={item} types={['edit', 'detail']}
                                                recordLoadedForDetail={props.recordLoadedForDetail}
                                                recordLoaded={props.recordLoadedForEdit} 
                                                modelName={'pointrecord'} />
                                    </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div>
    )
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(PointRecordSummary)
)