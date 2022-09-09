import React, { FormEvent } from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import MasterDataService from './../../../services/MasterDataService';
import Student from './../../../models/Student';
import WebRequest from './../../../models/commons/WebRequest';
import Filter from '../../../models/commons/Filter';
import WebResponse from './../../../models/commons/WebResponse';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import './style.css'
import Class from './../../../models/Class';
import { resolve } from 'inversify-react';

class State {
  items: Student[] = [];
  keyword: string = "";
}
class StudentSearchForm extends BaseComponent<any, State> {
  state = new State();
  @resolve(MasterDataService)
  private masterDataService: MasterDataService;
  constructor(props) {
    super(props, true);
  }
  itemsLoaded = (response: WebResponse) => {
    this.setState({ items: response.items });
  }

  loadItems = (e: FormEvent) => {
    e.preventDefault();
    if ("" == this.state.keyword) return;
    const req: WebRequest = {
      filter: new Filter(),
      modelName: 'student',
    }
    if (req.filter)
      req.filter.fieldsFilter = {
        'name': this.state.keyword
      }
    this.commonAjax(
      this.masterDataService.list,
      this.itemsLoaded, this.showCommonErrorAlert,
      req
    )
  }
  select = (s: Student) => {
    this.props.selectItem(s);
    this.setState({ items: [], keyword: "" });
  }
  reset = () => this.setState({ items: [] });

  render() {

    return (
      <form id="form-search-student" onSubmit={this.loadItems}>
        <div className="mb-3" style={{ position: 'absolute' }}>
          <div className="input-group">
            <input name="keyword" className="form-control" onChange={this.handleInputChange} value={this.state.keyword}
              placeholder="Cari Nama" />
            <input type="submit" value="Cari" className="btn btn-secondary" />
          </div>
          {this.state.items.length > 0 ?
            <div className="bg-light border rounded border-secondary" style={{ position: 'relative', zIndex: 10, padding: 3 }}>
              {this.state.items.map(s => {
                return (
                  <div onClick={() => this.select(s)} className="option-item" key={`s_form_${s.id}`}>
                    {s.user?.fullName} {Class.studentClassString(s)}
                  </div>
                )
              })}
              <AnchorWithIcon iconClassName="fas fa-times" className="btn btn-dark w-100" onClick={this.reset} >Tutup</AnchorWithIcon>
            </div>
            : null}
        </div>
      </form>
    )
  }

}

export default withRouter(
  connect(
    mapCommonUserStateToProps
  )(StudentSearchForm)
)