import React from 'react'
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
import FilterPeriod from '../../form/FilterPeriod';
import PointRecordDetail from '../asrama/point-record/PointRecordDetail';
import StudentService from '../../../services/StudentService';
import WebResponse from '../../../models/commons/WebResponse';
import Category from '../../../models/Category';
import Class from '../../../models/Class';
import { MONTHS } from './../../../utils/DateUtil';
import DropPointButtons from '../asrama/DropPointButtons';
class State {
  items: PointRecord[] = [];
  filter: Filter = new Filter();
  totalData: number = 0;
  record?: PointRecord;
  loading: boolean = false;
  categories: Category[] = [];
  classes: Class[] = [];
  selectedCategory: Category | undefined;
  showFilterDetail: boolean = false;
}
const defaultFieldsFilter = { name: '', dropped: '', class_id: '', point_name: '', category_name: '', location: '' }
const MODEL_NAME = 'broken-rules';
const MENU = 'asrama';
class PointRecordSummary extends BaseManagementPage {
  state: State = new State();
  private studentService: StudentService;
  constructor(props) {
    super(props, MODEL_NAME, MENU, false);

    this.studentService = this.getServices().studentService;

    const f = new Filter();
    const d = new Date();

    f.limit = 10;
    f.day = f.dayTo = d.getDate();
    f.month = 1; //January
    f.monthTo = d.getMonth() + 1;
    f.year = f.yearTo = d.getFullYear();
    f.fieldsFilter = defaultFieldsFilter;

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
  categoriesLoaded = (response: WebResponse) => this.setState({ categories: response.items });
  classessLoaded = (response: WebResponse) => this.setState({ classes: response.items });

  setSelectedCategory = (cat: Category) => {
    const filter = this.state.filter;
    if (cat.id == "") {
      filter.fieldsFilter['point_name'] = '';
    }
    this.setState({ filter: filter, selectedCategory: cat });
  }

  showDetail = (item: PointRecord) => this.setState({ record: item });
  hideDetail = () => this.setState({ record: undefined }, this.scrollTop);
  showFilterDetail = () => this.setState({ showFilterDetail: true });
  hideFilterDetail = () => this.setState({ showFilterDetail: false });

  openEditPage = (p: PointRecord) => {
    this.props.history.push({
      pathname: '/asrama/pointrecordedit',
      state: { record: p }
    })
  }

  resetFilter = () => {
    const f = this.state.filter;
    this.setState({ filter: Filter.resetFieldsFilter(f) });
  }
  followUp = (p: PointRecord) => {
    this.commonAjax(
      this.studentService.followUp,
      this.showCommonSuccessAlert,
      this.showCommonErrorAlert,
      p.id
    )
  }
  dropAll = (e) => {
    this.showConfirmation("Putihkan " + this.state.items.length + " data?")
      .then(ok => {
        if (ok) {
          this.commonAjax(
            this.studentService.dropAll,
            this.reload,
            this.showCommonErrorAlert,
            this.itemIdArray
          )
        }
      })
  }
  undropAll = (e) => {
    this.showConfirmation("Reset pemutihan " + this.state.items.length + " data?")
      .then(ok => {
        if (ok) {
          this.commonAjax(
            this.studentService.undropAll,
            this.reload,
            this.showCommonErrorAlert,
            this.itemIdArray
          )
        }
      })
  }

  get itemIdArray() {
    const arr: any[] = [];
    this.state.items.forEach((item: PointRecord) => {
      if (item.id)
        arr.push(item.id);
    })
    return arr;
  }

  render() {
    const filter = this.state.filter;
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
    const defaultClass: Class = { id: "", level: "Semua Kelas", sekolah: {} };
    const selectedClassId = filter.fieldsFilter['class_id'] ? filter.fieldsFilter['class_id'] : "";

    return (
      <div className="container-fluid section-body">
        <h2>{title}</h2>
        <hr />
        <form className="form-filter" onSubmit={this.reload}>
          <FormGroup label="Cari">
            <div className="input-group">
              <input autoComplete="off" name="name" placeholder="Nama siswa" className="form-control-sm" value={fieldsFilter['name'] ?? ""} onChange={this.updateFieldsFilter} />
              <select autoComplete="off" value={selectedClassId} onChange={this.updateFieldsFilter} className="form-control-sm" name="class_id">
                {[defaultClass, ...this.state.classes].map((c) => {
                  return <option key={`class_${c.id}`} value={c.id}>{c.level}{c.rombel} - {c.sekolah?.nama}</option>
                })}
              </select>
            </div>
          </FormGroup>
          {this.state.showFilterDetail ?
            <><div className="filter-sticky bg-white border border-gray pt-3 pb-3 pl-3 pr-3">
              <FormGroup label="Kategori">
                <select value={fieldsFilter['category_name']} onChange={this.updateFieldsFilter} className="form-control-sm" name="category_name">
                  {[Category.clone({ id: "", name: "Semua" }), ...this.state.categories].map((c) => {
                    return <option onClick={() => this.setSelectedCategory(c)} key={`cat_${c.id}`} value={c.id == "" ? c.id : c.name}>{c.name}</option>
                  })}
                </select>
              </FormGroup>
              {this.state.selectedCategory && this.state.selectedCategory.points ?
                <FormGroup label="Pelanggaran">
                  <select value={fieldsFilter['point_name']} onChange={this.updateFieldsFilter} className="form-control-sm" name="point_name">
                    {[{ id: "", name: "Semua" }, ...this.state.selectedCategory.points].map((c) => {
                      return <option key={`rp_${c.id}`} value={c.id == "" ? c.id : c.name}>{c.name}</option>
                    })}
                  </select>
                </FormGroup> :
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
                <select name="dropped" className="form-control-sm" value={fieldsFilter['dropped'] ?? ''} onChange={this.updateFieldsFilter}>
                  <option value="">Semua</option>
                  <option value="false">Belum</option>
                  <option value="true">Sudah</option>
                </select>
              </FormGroup>
              <FormGroup label="Lokasi">
                <input name="location" placeholder="Lokasi" className="form-control-sm" value={fieldsFilter['location'] ?? ""} onChange={this.updateFieldsFilter} />
              </FormGroup>
              <FormGroup label="Jumlah Tampilan">
                <input type="number" name="limit" className="form-control-sm" value={filter.limit ?? 5} onChange={this.updateFilter} />
              </FormGroup>
              <FormGroup label="">
                <a className="btn btn-dark btn-sm" onClick={this.hideFilterDetail}>Tutup</a>
                <input className="ml-3 btn btn-primary btn-sm" type="submit" value="Cari" />
              </FormGroup>
            </div>
              <FormGroup label="">
                <a className="btn btn-dark btn-sm" onClick={this.hideFilterDetail}>Tutup Detail Filter</a>
              </FormGroup>
            </>
            : <FormGroup label="">
              <a className="btn btn-dark btn-sm" onClick={this.showFilterDetail}>Tampil Detail Filter</a>
            </FormGroup>}
          <FormGroup label="Periode">
            {filter.day} {MONTHS[(filter.month ?? 1) - 1]} {filter.year} - {filter.dayTo} {MONTHS[(filter.monthTo ?? 1) - 1]} {filter.yearTo}
          </FormGroup>
          <FormGroup>
            <input className="btn btn-primary btn-sm" type="submit" value="Submit" />
            <a className="btn btn-secondary btn-sm ml-2" onClick={this.resetFilter}>Reset</a>
            <a onClick={this.dropAll} className="ml-2 btn btn-info btn-sm" >Putihkan Semua</a>
            <a onClick={this.undropAll} className="ml-2 btn btn-warning btn-sm" >Reset Pemutihan Semua</a>
          </FormGroup>
        </form>
        <NavigationButtons activePage={filter.page ?? 0} limit={filter.limit ?? 10} totalData={this.state.totalData}
          onClick={this.loadAtPage} />
        <ItemsList isAdmin={this.isAdmin()} startingNumber={(filter.page ?? 0) * (filter.limit ?? 10)}
          recordLoadedForDetail={this.showDetail}
          recordLoadedForEdit={this.openEditPage}
          recordUpdated={this.loadItems} followUp={this.followUp}
          items={this.state.items} />
      </div>
    )
  }
}
interface ItemProps {
  isAdmin: boolean, startingNumber: number,
  items: PointRecord[], recordLoadedForDetail(p: PointRecord): any,
  recordLoadedForEdit(p: PointRecord): any, recordUpdated(): any, followUp(p: PointRecord): any
}
const ItemsList = (props: ItemProps) => {

  return (
    <div style={{ overflow: 'scroll' }}>
      <table className="table ">
        {tableHeader("No", "Siswa", "Kelas", "Tanggal", "Pelanggaran", "Poin", "Lokasi", "Gambar", "Pemutihan", "Opsi")}
        <tbody>
          {props.items.map((item, i) => {
            item = PointRecord.clone(item);
            const student = item.student;
            const optionTypes = props.isAdmin ?
              ['detail', 'delete'] :
              [(item.dropped_at ? null : 'edit'), 'detail'];
            return (
              <tr key={"PointRecord-" + i} className={item.dropped_at ? "alert alert-success" : ""}>
                <td>{i + 1 + props.startingNumber}</td>
                <td>{student?.user?.fullName}</td>
                <td>{Class.studentClassString(student)}</td>
                <td>{item.getTimestamp()}</td>
                <td>{item.rule_point?.name} ({item.rule_point?.ruleCategoryName})</td>
                <td>{item.rule_point?.point}</td>
                <td>{item.location}</td>
                <td>{item.getPicture() ?
                  <img src={item.getPicture() ?? ""} width={50} height={50} /> : null}</td>
                <td>{item.dropped_at ? <i className="fas fa-check" /> : "-"} </td>
                <td>
                  <div style={{ width: 'max-content' }}>
                    {item.rule_point?.droppable == true ?
                      <><DropPointButtons record={item} onUpdated={props.recordUpdated} /><p /></>
                      :
                      <p><i>Tidak ada pemutihan</i></p>
                    }
                    {/* {props.isAdmin? <><DropPointButtons record={item} onUpdated={props.recordUpdated} /><p/></> : 
                                            <a className="btn btn-dark btn-sm" onClick={()=>props.followUp(item)}>Follow Up</a>} */}
                    <EditDeleteButton
                      record={item}
                      types={optionTypes}
                      recordLoadedForDetail={props.recordLoadedForDetail}
                      recordLoaded={props.recordLoadedForEdit}
                      modelName={MODEL_NAME}
                      menu={MENU}
                    />
                  </div>

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