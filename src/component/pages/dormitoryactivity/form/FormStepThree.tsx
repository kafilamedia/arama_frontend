import React, { ChangeEvent } from 'react'
import BaseComponent from '../../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import RulePoint from '../../../../models/RulePoint';
import FormGroup from '../../../form/FormGroup';
import PointRecord from '../../../../models/PointRecord';
import { parseDate } from '../../../../utils/DateUtil';
import InputTime from '../../../form/InputTime';
class State {
    pointRecord:PointRecord = new PointRecord();
}
class FormStepThree extends BaseComponent {
    state: State = new State();
    constructor(props) {
        super(props, true);
    }

    onSubmit = () => {
        this.showConfirmation("Submit Data?")
        .then(ok=>{
            if (!ok) {
                return;
            }
            this.props.submit(this.state.pointRecord);
        })
    }
    rulePoint = () :RulePoint => {
        return this.props.rulePoint;
    }
    updatePointRecord = (e:ChangeEvent) => {
        const target = e.target as any;
        const pointRecord= this.state.pointRecord;
        pointRecord[target.name] = target.value;
        this.setState({pointRecord: pointRecord});
        
    }
    updateDate = (e:ChangeEvent) => {
        const date:Date = parseDate((e.target as HTMLInputElement).value);
        const pointRecord= this.state.pointRecord;
        pointRecord.setDate(date);
        this.setState({pointRecord: pointRecord});
    }
    updateTime = (h:number, m:number, s:number) => {
        const pointRecord= this.state.pointRecord;
        pointRecord.setTime(h, m, s);
        this.setState({pointRecord: pointRecord});
    }
    render() {
        const rulePoint:RulePoint = this.rulePoint();
        const pointRecord:PointRecord = this.state.pointRecord;
        return (
            <form onSubmit={(e)=>{e.preventDefault();this.onSubmit()}}>
                <FormGroup label="Category">{rulePoint.category?.name}</FormGroup>
                <FormGroup label="Name">{rulePoint.name}</FormGroup>
                <FormGroup label="Point">{rulePoint.point}</FormGroup>
                <FormGroup label="Date">
                    <input type="date" className="form-control" onChange={this.updateDate} name="date" value={pointRecord.dateString()} />
                </FormGroup>
                <FormGroup label="Time">
                    <InputTime onChange={this.updateTime} value={pointRecord.time}/>
                </FormGroup>
                <FormGroup label="Location">
                    <input className="form-control" onChange={this.updatePointRecord} name="location" value={pointRecord.location??""} />
                </FormGroup>
                <FormGroup label="Description">
                    <textarea value={pointRecord.description??""} onChange={this.updatePointRecord} name="description" className="form-control"></textarea>
                </FormGroup>
                <AnchorWithIcon className="btn btn-secondary float-left" iconClassName="fas fa-arrow-left" onClick={this.props.onBack} >Back</AnchorWithIcon>
                <button className="btn btn-info float-right" >Submit</button>
            </form>
        )
    }
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(FormStepThree)
)