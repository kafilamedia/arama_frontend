
import React, { Component } from 'react'
import PointRecord from './../../../models/PointRecord';
import Card from './../../container/Card';
import FormGroup from './../../form/FormGroup';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';

interface IProps {
    record:PointRecord;
    close():any;
}
export default class PointRecordDetail extends Component<IProps, any> {


    render() {
        const record = PointRecord.clone(this.props.record);
        const pictureUrl = record.getPicture();
        const timeStamp = record.getTimestamp();
        return <Card title={"Record Detail - "+timeStamp} footerContent={<AnchorWithIcon className="btn btn-dark" onClick={this.props.close} >Ok</AnchorWithIcon>}>
            <FormGroup label="Name">{record.student?.user?.name} - {record.student?.kelas?.level} {record.student?.kelas?.rombel}</FormGroup>
            <FormGroup label="Item">
                <strong>{record.rule_point?.category?.name}</strong> - {record.rule_point?.name} <span className="badge badge-dark">{record.rule_point?.point}</span>
            </FormGroup>
            <FormGroup label="Location">
                {record.location??"-"}
            </FormGroup>
            <FormGroup label="Description">
                {record.description??"-"}
            </FormGroup>
            <FormGroup label="Dropped">
                {record.dropped_at??"-"}
            </FormGroup>
            <FormGroup label="Picture">
                {pictureUrl?
                <img src={pictureUrl} width={200} height={200} className="border border-dark" />:null}
            </FormGroup>
        </Card>
    }
}