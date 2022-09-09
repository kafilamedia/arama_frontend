
import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Filter from '../../../models/commons/Filter';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BaseEntity from './../../../models/BaseEntity';
import Category from './../../../models/Category';
import { tableHeader } from './../../../utils/CollectionUtil';
import Modal from './../../container/Modal';
import FormGroup from './../../form/FormGroup';
import NavigationButtons from './../../navigation/NavigationButtons';
import BaseManagementPage from './BaseManagementPage';
import EditDeleteButton from './EditDeleteButton';
class State {
  items: Category[] = [];
  filter: Filter = new Filter();
  totalData: number = 0;
  record: Category = new Category();
}
const MODEL_NAME = 'rule-categories';
const MENU = 'asrama';
class CategoryManagement extends BaseManagementPage<any, State> {
  state = new State();
  constructor(props) {
    super(props, MODEL_NAME, MENU);
    this.state.filter.limit = 10;
    this.state.filter.orderBy = 'name';
  }

  onSubmit = () => {
    // console.debug("RECORD: ", this.state.record);
    this.showConfirmation("Submit Data?")
      .then(ok => {
        if (!ok) return;
        if (this.state.record.id ?? 0 > 0) {
          this.callApiUpdate(this.state.record.id, this.state.record);
        } else {
          this.callApiInsert(this.state.record);
        }
      })
  }

  emptyRecord = (): BaseEntity => new Category();
  render() {
    const filter: Filter = this.state.filter;
    return (
      <div className="container-fluid section-body">
        <h2>Kategori Pelanggaran</h2>
        <hr />
        <RecordForm formRef={this.formRef} resetForm={this.resetForm} onSubmit={this.onSubmit} record={this.state.record} updateRecordProp={this.updateRecordProp} />
        <form onSubmit={this.reload}>
          <FormGroup label="Cari">
            <input name="name" placeholder="nama" className="form-control-sm" value={filter.fieldsFilter ? filter.fieldsFilter['name'] : ""} onChange={this.updateFieldsFilter} />
          </FormGroup>
          <FormGroup label="Jumlah Tampilan">
            <input name="limit" type="number" className="form-control-sm" value={filter.limit ?? 5} onChange={this.updateFilter} />
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
          startingNumber={(filter.page ?? 0) * (filter.limit ?? 10)} items={this.state.items} />
      </div>
    )
  }

}
const ItemsList = (props: { startingNumber: number, items: Category[], recordLoaded(item: any), recordDeleted() }) => {

  return (
    <div style={{ overflow: 'auto' }}>
      <table className="table table-striped">
        {tableHeader("No", "Nama", "Deskripsi", "Opsi")}
        <tbody>
          {props.items.map((item, i) => {

            return (
              <tr key={"category-" + i}>
                <td>{i + 1 + props.startingNumber}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>
                  <EditDeleteButton
                    recordLoaded={props.recordLoaded}
                    recordDeleted={props.recordDeleted}
                    record={item}
                    modelName={MODEL_NAME}
                    menu={MENU}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
const RecordForm = (props: { formRef: React.RefObject<Modal>, updateRecordProp(e: ChangeEvent): any, resetForm(): any, onSubmit(): any, record: Category }) => {

  return (
    <form className="record-form mb-3" onSubmit={(e) => { e.preventDefault(); props.onSubmit() }}>
      <Modal show={false} ref={props.formRef} toggleable={true} title="Record Form" >
        <FormGroup label="Nama"><input required value={props.record.name ?? ""} onChange={props.updateRecordProp} className="form-control" name="name" /></FormGroup>
        <FormGroup label="Deskripsi">
          <textarea required className="form-control" name="description" onChange={props.updateRecordProp} value={props.record.description ?? ""} />
        </FormGroup>
        <FormGroup>
          <input type="submit" value="Submit" className="btn btn-primary btn-sm mr-2" />
          <input type="reset" className="btn btn-secondary btn-sm" onClick={(e) => props.resetForm()} />
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