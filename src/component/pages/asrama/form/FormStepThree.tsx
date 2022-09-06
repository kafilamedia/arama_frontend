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
import { getAttachmentInfoFromFile } from '../../../../utils/ComponentUtil';
import AttachmentInfo from '../../../../models/settings/AttachmentInfo';
class State {
  pointRecord: PointRecord = new PointRecord();
}
class FormStepThree extends BaseComponent {
  state: State = new State();
  constructor(props) {
    super(props, true);
  }

  onSubmit = () => {
    this.showConfirmation("Submit Data?")
      .then(ok => {
        if (ok) {
          this.props.submit(this.state.pointRecord);
        }
      })
  }
  get rulePoint(): RulePoint {
    return this.props.rulePoint;
  }
  updatePointRecord = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { target } = e;
    const { pointRecord } = this.state;
    pointRecord[target.name] = target.value;
    this.setState({ pointRecord });

  }
  updateDate = (e: ChangeEvent<HTMLInputElement>) => {
    const date = parseDate(e.target.value);
    const { pointRecord } = this.state;
    pointRecord.time = date;
    this.setState({ pointRecord });
  }
  updateTime = (h: number, m: number, s: number) => {
    const pointRecord = this.state.pointRecord;
    pointRecord.setTime(h, m, s);
    this.setState({ pointRecord: pointRecord });
  }
  setAttachment = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    getAttachmentInfoFromFile(target).then((attachment: AttachmentInfo) => {
      this.props.setAttachment(attachment);
    });
  }
  removeAttachment = () => {
    this.props.removeAttachment();
  }
  getAttachment = (): AttachmentInfo | undefined => {
    return this.props.attachmentInfo;
  }
  render() {
    const { rulePoint } = this;
    const { pointRecord } = this.state;
    const attachment = this.getAttachment();
    return (
      <form onSubmit={(e) => { e.preventDefault(); this.onSubmit() }}>
        <FormGroup label="Category">{rulePoint.ruleCategoryName} - {rulePoint.name} <span className="badge badge-dark">{rulePoint.point}</span></FormGroup>
        <FormGroup label="Date">
          <input type="date" className="form-control" onChange={this.updateDate} name="date" value={pointRecord.dateString()} />
        </FormGroup>
        <FormGroup label="Time">
          <InputTime onChange={this.updateTime} value={pointRecord.timeString} />
        </FormGroup>
        <FormGroup label="Location">
          <input className="form-control" onChange={this.updatePointRecord} name="location" value={pointRecord.location ?? ""} />
        </FormGroup>
        <FormGroup label="Picture">
          {attachment ?
            <>
              <img style={{ marginRight: 10 }} className="border border-dark" src={attachment.url} width={100} height={100} />
              <AnchorWithIcon iconClassName="fas fa-times" className="btn btn-danger" onClick={this.removeAttachment}></AnchorWithIcon>
            </>
            : <input type="file" accept={"image/*"} className="form-control" onChange={this.setAttachment} name="attachment" />
          }
        </FormGroup>
        <FormGroup label="Description">
          <textarea value={pointRecord.description ?? ''} onChange={this.updatePointRecord} name="description" className="form-control"></textarea>
        </FormGroup>
        <AnchorWithIcon className="btn btn-secondary float-left" iconClassName="fas fa-arrow-left" onClick={this.props.onBack} >Back</AnchorWithIcon>
        <button className="btn btn-success float-right" >Submit</button>
      </form>
    )
  }
}

export default withRouter(
  connect(
    mapCommonUserStateToProps
  )(FormStepThree)
)