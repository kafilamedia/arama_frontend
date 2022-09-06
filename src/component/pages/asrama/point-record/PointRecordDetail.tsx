
import React, { Component } from 'react';
import PointRecord from '../../../../models/PointRecord';
import { doItLater } from '../../../../utils/EventUtil';
import Card from '../../../container/Card';
import FormGroup from '../../../form/FormGroup';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';

interface IProps {
  record: PointRecord;
  close(): any;
}
export default class PointRecordDetail extends Component<IProps, any> {

  componentDidMount() {
    const opt: ScrollToOptions = { top: 0, behavior: 'smooth' };
    doItLater(() => {
      window.scrollTo(opt);
    }, 100);
  }

  render() {
    const record = PointRecord.clone(this.props.record);
    const pictureUrl = record.getPicture();
    const timeStamp = new Date(record.time).toString();
    return <Card title={"Detail Pelanggaran"} footerContent={<AnchorWithIcon className="btn btn-dark" onClick={this.props.close} >Ok</AnchorWithIcon>}>
      <FormGroup label="Nama">{record.studentName} - {record.classLevel}{record.classLetter} {record.schoolName}</FormGroup>
      <FormGroup label="Pelanggaran">
        <strong>{record.ruleCategoryName}</strong> - {record.ruleName} <span className="badge badge-dark">{record.point}</span>
      </FormGroup>
      <FormGroup label="Waktu" children={timeStamp} />
      <FormGroup label="Lokasi" children={record.location ?? '-'} />
      <FormGroup label="Deskripsi" children={record.description ?? '-'} />
      <FormGroup label="Diputihkan" children={record.dropped ? new Date(record.dropped).toString() : '-'} />

      <FormGroup label="Gambar">
        {pictureUrl ?
          <img src={pictureUrl} width={200} height={200} className="border border-dark" /> : null}
      </FormGroup>
    </Card>
  }
}