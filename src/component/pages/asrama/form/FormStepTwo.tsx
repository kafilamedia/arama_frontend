
import React, { ChangeEvent } from 'react'
import { resolve } from 'inversify-react';
import BaseComponent from '../../../BaseComponent';
import MasterDataService from '../../../../services/MasterDataService';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import FormGroup from '../../../form/FormGroup';
import Category from '../../../../models/Category';
import RulePoint from '../../../../models/RulePoint';
import WebRequest from '../../../../models/commons/WebRequest';
import WebResponse from '../../../../models/commons/WebResponse';
import Spinner from '../../../loader/Spinner';
import SimpleError from '../../../alert/SimpleError';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
class State {
  rulePoints: RulePoint[] = [];
  loading = false;
}
class FormStepTwo extends BaseComponent {
  @resolve(MasterDataService)
  private masterDataService: MasterDataService;
  state = new State();
  constructor(props) {
    super(props, true);
  }
  startLoading = () => this.setState({ loading: true });
  endLoading = () => this.setState({ loading: false });
  rulePointsLoaded = (response: WebResponse) => {
    this.setState({ rulePoints: response.result.items }, () => {
      if (this.state.rulePoints.length > 0) {
        if (!this.props.rulePoint) {
          this.setRulePoint(this.state.rulePoints[0]);
        }
      }
    });
  }

  loadRulePoints = () => {
    if (null == this.getCategory()) return;
    const req: WebRequest = {
      filter: { limit: 0, fieldsFilter: { 'category.id=': this.getCategory().id } },
      modelName: 'rule-points',
    }
    this.commonAjax(
      this.masterDataService.list,
      this.rulePointsLoaded,
      this.showCommonErrorAlert,
      req,
      'asrama'
    )
  }
  getCategory = (): Category => {
    return this.props.category;
  }
  componentDidMount() {
    super.componentDidMount();
    this.loadRulePoints();
  }
  onSubmit = () => {
    this.props.onSubmit();
  }
  setRulePoint = (r: RulePoint) => {
    this.props.setRulePoint(r);
  }
  updateRulePoint = (e: ChangeEvent) => {
    const select = (e.target as HTMLSelectElement);
    const filtered = this.state.rulePoints.filter((r) => r.id?.toString() == select.value)
    if (filtered.length == 0) return;
    this.setRulePoint(filtered[0]);
  }
  render() {
    const category = this.getCategory();

    const { rulePoints, loading } = this.state;

    if (null == category) {
      return <SimpleError>Category not found</SimpleError>
    }
    if (loading) {
      return <Spinner />
    }
    if (rulePoints.length == 0) {
      return <SimpleError>Rule Points for {category.name} not found</SimpleError>
    }
    return (
      <form onSubmit={e => { e.preventDefault(); this.onSubmit() }} >
        <FormGroup label="Category" children={category.name} />
        <FormGroup label="Name">
          <select className="form-control" onChange={this.updateRulePoint} value={this.props.rulePoint ? this.props.rulePoint.id : null} >
            {rulePoints.map((r: RulePoint) => {
              return <option key={`select-rulePoint-${r.id}`} value={r.id}>{r.name}</option>
            })}
          </select>
        </FormGroup>
        <FormGroup label="Point" children={this.props.rulePoint?.point} />
        <hr />
        <AnchorWithIcon className="btn btn-secondary float-left" iconClassName="fas fa-arrow-left" onClick={this.props.onBack} >Back</AnchorWithIcon>
        <AnchorWithIcon className="btn btn-info float-right" iconClassName="fas fa-arrow-right" onClick={this.onSubmit} >Next</AnchorWithIcon>
      </form>
    );
  }
}

export default withRouter(
  connect(
    mapCommonUserStateToProps
  )(FormStepTwo)
)