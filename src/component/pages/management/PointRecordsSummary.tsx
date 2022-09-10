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
import FilterPeriod from '../../form/FilterPeriod';
import PointRecordDetail from '../asrama/point-record/PointRecordDetail';
import StudentService from '../../../services/StudentService';
import WebResponse from '../../../models/commons/WebResponse';
import Category from '../../../models/Category';
import Class from '../../../models/Class';
import { MONTHS, getInputReadableDate } from './../../../utils/DateUtil';
import DropPointButtons from '../asrama/DropPointButtons';
import { resolve } from 'inversify-react';

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
const now = new Date();
const defaultFieldsFilter = {
  'classMember.student.user.fullName': '',
  dropped: '',
  'classMember.classLevel.id=': '',
  'rulePoint.name': '',
  'rulePoint.category.name': '',
  location: '',
  'time>=d': getInputReadableDate(new Date(now.getFullYear(), 0, 1)),
  'time<=d': getInputReadableDate(now),
};
const MODEL_NAME = 'broken-rules';
const MENU = 'asrama';
class PointRecordSummary extends BaseManagementPage<any, State> {
  state = new State();
  @resolve(StudentService)
  private studentService: StudentService;
  constructor(props) {
    super(props, MODEL_NAME, MENU, false);

    const filter = new Filter();
    filter.limit = 10;
    filter.fieldsFilter = defaultFieldsFilter;
    filter.orderBy = 'time';
    filter.orderType = 'desc';

    this.state.filter = filter;
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
  categoriesLoaded = (response: WebResponse) => this.setState({ categories: response.result.items });
  classessLoaded = (response: WebResponse) => this.setState({ classes: response.result });

  setSelectedCategory = (selectedCategory: Category) => {
    const { filter } = this.state;
    if (!selectedCategory.id || selectedCategory.id?.toString() === '') {
      filter.fieldsFilter['rulePoint.name'] = '';
    }
    this.setState({ filter, selectedCategory });
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
    const { filter } = this.state;
    this.setState({ filter: Filter.resetFieldsFilter(filter) });
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
            this.itemsId
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
            this.itemsId
          )
        }
      })
  }
  updatePeriodFilter = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: 'time<=d' | 'time>=d') => {
    const { filter } = this.state;
    Filter.updatePeriodFilter(filter, e, field);
    this.setState({ filter });
  }
  updateDroppedOption = (e: ChangeEvent<HTMLSelectElement>) => {
    const { filter } = this.state;
    const { fieldsFilter } = filter;
    for (const key in fieldsFilter) {
      if (key.startsWith('dropped')) {
        delete fieldsFilter[key];
      }
    }
    const split = e.target.value.split(':');
    if (split[0] === 'dropped') {
      return;
    }
    fieldsFilter[split[0]] = 'Dummy';
    this.setState({ filter });
  }

  get itemsId() { return this.state.items.map(i => i.id); }

  render() {
    const { filter, record } = this.state;;
    const { fieldsFilter } = filter;

    const title = "Rekap Pelanggaran";
    if (record) {
      return (
        <div className="container-fluid section-body">
          <h2>{title}</h2>
          <PointRecordDetail record={record} close={this.hideDetail} />
        </div>
      )
    }
    const defaultClass = { id: 0, level: 'Semua Kelas'} as Class;
    const selectedClassId = filter.fieldsFilter['classMember.classLevel.id='] ? filter.fieldsFilter['classMember.classLevel.id='] : '';

    return (
      <div className="container-fluid section-body">
        <h2>{title}</h2>
        <hr />
        <form className="form-filter" onSubmit={this.reload}>
          <FormGroup label="Cari">
            <div className="input-group">
              <input autoComplete="off" name="classMember.student.user.fullName" placeholder="Nama siswa" className="form-control-sm" value={fieldsFilter['classMember.student.user.fullName'] ?? ''} onChange={this.updateFieldsFilter} />
              <select autoComplete="off" value={selectedClassId} onChange={this.updateFieldsFilter} className="form-control-sm" name="classMember.classLevel.id=">
                {[defaultClass, ...this.state.classes].map((c) => {
                  return <option key={`class_${c.id}`} value={c.id}>{c.level}{c.letter} - {c.schoolName}</option>
                })}
              </select>
            </div>
          </FormGroup>
          {this.state.showFilterDetail ?
            <><div className="filter-sticky bg-white border border-gray pt-3 pb-3 pl-3 pr-3">
              <FormGroup label="Kategori">
                <select value={fieldsFilter['rulePoint.category.id=']} onChange={this.updateFieldsFilter} className="form-control-sm" name="rulePoint.category.id=">
                  {[Category.clone({ id: '', name: 'Semua' }), ...this.state.categories].map((c) => {
                    return <option onClick={() => this.setSelectedCategory(c)} key={`cat_${c.id}`} value={c.id}>{c.name}</option>
                  })}
                </select>
              </FormGroup>
              {
                this.state.selectedCategory && this.state.selectedCategory.points &&
                <FormGroup label="Pelanggaran">
                  <select value={fieldsFilter['rulePoint.name']} onChange={this.updateFieldsFilter} className="form-control-sm" name="rulePoint.name">
                    {[{ id: '', name: 'Semua' }, ...this.state.selectedCategory.points].map((c) => {
                      return <option key={`rp_${c.id}`} value={c.id == '' ? c.id : c.name}>{c.name}</option>
                    })}
                  </select>
                </FormGroup>
              }
              <FormGroup label="Periode">
                <div className="input-group">
                  <FilterPeriod date={new Date(fieldsFilter['time>=d'])} onChange={(e) => this.updatePeriodFilter(e, 'time>=d')} />
                </div>
                <div className="input-group">
                  <FilterPeriod date={new Date(fieldsFilter['time<=d'])} onChange={(e) => this.updatePeriodFilter(e, 'time<=d')} />
                </div>
              </FormGroup>
              <FormGroup label="Pemutihan">
                <select
                  className="form-control-sm"
                  onChange={this.updateDroppedOption}
                >
                  <option value="dropped:">Semua</option>
                  <option value="dropped=null:">Belum</option>
                  <option value="dropped!null:">Sudah</option>
                </select>
              </FormGroup>
              <FormGroup label="Lokasi">
                <input name="location" placeholder="Lokasi" className="form-control-sm" value={fieldsFilter['location'] ?? ''} onChange={this.updateFieldsFilter} />
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
            {new Date(filter.fieldsFilter['time>=d']).toDateString()} - {new Date(filter.fieldsFilter['time<=d']).toDateString()}
          </FormGroup>
          <FormGroup>
            <input className="btn btn-primary btn-sm" type="submit" value="Submit" />
            <a className="btn btn-secondary btn-sm ml-2" onClick={this.resetFilter}>Reset</a>
            <a onClick={this.dropAll} className="ml-2 btn btn-info btn-sm" >Putihkan Semua</a>
            <a onClick={this.undropAll} className="ml-2 btn btn-warning btn-sm" >Reset Pemutihan Semua</a>
          </FormGroup>
        </form>
        <NavigationButtons
          activePage={filter.page ?? 0}
          limit={filter.limit ?? 10}
          totalData={this.state.totalData}
          onClick={this.loadAtPage}
        />
        <ItemsList
          isAdmin={this.isAdmin()}
          startingNumber={(filter.page ?? 0) * (filter.limit ?? 10)}
          recordLoadedForDetail={this.showDetail}
          recordLoadedForEdit={this.openEditPage}
          recordUpdated={this.loadItems}
          followUp={this.followUp}
          items={this.state.items}
        />
      </div>
    )
  }
}
interface ItemProps {
  isAdmin: boolean,
  startingNumber: number,
  items: PointRecord[],
  recordLoadedForDetail(p: PointRecord): any,
  recordLoadedForEdit(p: PointRecord): any,
  recordUpdated(): any,
  followUp(p: PointRecord): any
}
const ItemsList = (props: ItemProps) => {
  return (
    <div style={{ overflow: 'auto' }}>
      <table className="table ">
        {tableHeader("No", "Siswa", "Kelas", "Tanggal", "Pelanggaran", "Poin", "Lokasi", "Gambar", "Pemutihan", "Opsi")}
        <tbody>
          {props.items.map((item, i) => {
            item = PointRecord.clone(item);
            const optionTypes = props.isAdmin ?
              ['detail', 'delete'] :
              [(item.dropped ? null : 'edit'), 'detail'];
            return (
              <tr key={"PointRecord-" + i} className={item.dropped ? "alert alert-success" : ''}>
                <td>{i + 1 + props.startingNumber}</td>
                <td>{item.studentName}</td>
                <td>{item.classLevel}{item.classLetter} {item.schoolName}</td>
                <td>{new Date(item.time).toLocaleDateString()}</td>
                <td>{item.ruleCategoryName} ({item.ruleName})</td>
                <td>{item.point}</td>
                <td>{item.location}</td>
                <td>
                  <img src={item.getPicture() ?? ''} width={50} height={50} />
                </td>
                <td>{item.dropped ? <i className="fas fa-check" /> : "-"} </td>
                <td>
                  <div style={{ width: 'max-content' }}>
                    {
                      item.droppable ?
                        <><DropPointButtons record={item} onUpdated={props.recordUpdated} /><p /></> :
                        <p><i>Tidak ada pemutihan</i></p>
                    }
                    {/* {
                      props.isAdmin ?
                        <><DropPointButtons record={item} onUpdated={props.recordUpdated} /><p /></> :
                        <a className="btn btn-dark btn-sm" onClick={() => props.followUp(item)}>Follow Up</a>
                    } */}
                    <EditDeleteButton
                      record={item}
                      types={optionTypes}
                      recordLoadedForDetail={props.recordLoadedForDetail}
                      recordLoaded={props.recordLoadedForEdit}
                      recordDeleted={props.recordUpdated}
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