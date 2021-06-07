
import React from 'react'
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
    rulePoints: RulePoint[]  = []; 
    loading:boolean = false;
}
class FormStepTwo extends BaseComponent {
    masterDataService: MasterDataService;
    state:State = new State();
    constructor(props) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
    }
    startLoading = () => this.setState({loading:true});
    endLoading = () => this.setState({loading:false});
    rulePointsLoaded = (response: WebResponse) => {
        this.setState({ rulePoints: response.items }, () => {
            if (response.items.length > 0) {
                if (!this.props.rulePoint) {
                    this.setRulePoint(response.items[0]);
                }
            }
        });
    }
    
    loadRulePoints = () => {
        if (null == this.getCategory()) return;
        const req: WebRequest = {
            filter: {limit:0, fieldsFilter:{category_id:this.getCategory().id}},
            modelName: 'rulepoint',
        }
        this.commonAjax(
            this.masterDataService.list,
            this.rulePointsLoaded,
            this.showCommonErrorAlert,
            req
        )
    }
    getCategory = ()  : Category => {
        return this.props.category;
    }
    componentDidMount() {
        super.componentDidMount();
        this.loadRulePoints();
    }
    onSubmit = () => {
        this.props.onSubmit();
    }
    setRulePoint = (r:RulePoint) => {
        this.props.setRulePoint(r);
    }
    render() {
        const category = this.getCategory();

        if (null == category) {
            return <SimpleError>Category not found</SimpleError>
        }
        if (this.state.loading) {
            return <Spinner/>
        }
        if (this.state.rulePoints.length == 0) {
            return <SimpleError>Rule Points for {category.name} not found</SimpleError>
        }

        const rulePoints =this.state.rulePoints;
        return (
            <form onSubmit={e => { e.preventDefault(); this.onSubmit() }} >
                <FormGroup label="Category" children={category.name}/>
                <FormGroup label="Name">
                <select className="form-control" onChange={(e)=>e.preventDefault()} value={this.props.rulePoint ? this.props.rulePoint.id : null} >
                    {rulePoints.map((rulePoint) => {
                        return <option key={"select-rulePoint-" + rulePoint.id}
                            onClick={(e) => { this.setRulePoint(rulePoint) }}
                            value={rulePoint.id}>{rulePoint.name}</option>
                    })}
                </select>
                </FormGroup>
                <FormGroup label="Point" children={this.props.rulePoint?.point}/>
                <hr/>
                <AnchorWithIcon className="btn btn-secondary float-left"  iconClassName="fas fa-arrow-left" onClick={this.props.onBack} >Back</AnchorWithIcon>
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