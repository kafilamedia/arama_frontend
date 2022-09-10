import React, { ChangeEvent, FormEvent } from 'react'
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
  pointRecord = new PointRecord();
}
class FormStepThree extends BaseComponent<any, State> {
  state = new State();
  constructor(props) {
    super(props, true);
  }

  onSubmit = (e: FormEvent) => {
    e.preventDefault();
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
    const { pointRecord } = this.state;
    pointRecord.setTime(h, m, s);
    this.setState({ pointRecord });
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
      <form onSubmit={this.onSubmit}>
        <FormGroup label="Category">
          <span>{rulePoint.ruleCategoryName} - {rulePoint.name}</span>
          <span className="badge badge-dark">{rulePoint.point}</span>
        </FormGroup>
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
              <img
                className="border border-dark mr-2"
                src={attachment.url} width={100} height={100} />
              <AnchorWithIcon
                iconClassName="fas fa-times"
                className="btn btn-danger"
                onClick={this.removeAttachment}
              />
            </>
            :
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={this.setAttachment}
              name="attachment"
            />
          }
        </FormGroup>
        <FormGroup label="Description">
          <textarea
            value={pointRecord.description ?? ''}
            onChange={this.updatePointRecord}
            name="description"
            className="form-control"
          />
        </FormGroup>
        <AnchorWithIcon
          className="btn btn-secondary float-left"
          iconClassName="fas fa-arrow-left"
          onClick={this.props.onBack}
        >
          Back
        </AnchorWithIcon>
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