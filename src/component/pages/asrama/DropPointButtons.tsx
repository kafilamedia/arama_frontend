import React from 'react'
import BaseComponent from '../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import PointRecord from '../../../models/PointRecord';
import AnchorWithIcon from '../../navigation/AnchorWithIcon';
import StudentService from '../../../services/StudentService';
import { resolve } from 'inversify-react';

class State {
  loading = false;
}
class DropPointButtons extends BaseComponent {
  @resolve(StudentService)
  private studentService: StudentService;
  state: State = new State();
  constructor(props) {
    super(props, true);
  }
  startLoading = () => { this.setState({ loading: true }); }
  endLoading = () => { this.setState({ loading: false }); }
  getRecord = (): PointRecord => this.props.record;

  setDropped = (isDropped: boolean) => {
    const item = this.getRecord();
    this.commonAjax(
      this.studentService.setPointDropped,
      this.props.onUpdated,
      this.showCommonErrorAlert,
      item.id, isDropped
    );
  }
  render() {
    const item = this.getRecord();
    if (this.state.loading) {
      return (
        <button className="btn btn-info btn-sm">
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </button>
      );
    }
    return (
      item.dropped ?
        <AnchorWithIcon onClick={(e) => this.setDropped(false)} className="btn btn-secondary btn-sm" iconClassName="fas fa-arrow-up">
          Reset
        </AnchorWithIcon> :
        <AnchorWithIcon onClick={(e) => this.setDropped(true)} className="btn btn-success btn-sm" iconClassName="fas fa-arrow-down">
          Putihkan
        </AnchorWithIcon>
    )
  }
}

export default withRouter(connect(
  mapCommonUserStateToProps
)(DropPointButtons))