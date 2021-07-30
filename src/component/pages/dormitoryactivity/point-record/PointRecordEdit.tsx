import React, { ChangeEvent, FormEvent } from 'react'
import BasePage from './../../BasePage';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../../constant/stores';
import PointRecord from './../../../../models/PointRecord';
import FormGroup from '../../../form/FormGroup';
import Class from './../../../../models/Class';
import StudentService from './../../../../services/StudentService';
import WebResponse from './../../../../models/commons/WebResponse';
import Category from './../../../../models/Category';
import WebRequest from './../../../../models/commons/WebRequest';
import RulePoint from './../../../../models/RulePoint';
import MasterDataService from './../../../../services/MasterDataService';
import InputTime from './../../../form/InputTime';
import { parseDate } from '../../../../utils/DateUtil';
import AnchorWithIcon from './../../../navigation/AnchorWithIcon';
import AttachmentInfo from './../../../../models/settings/AttachmentInfo';
import { getAttachmentInfoFromFile } from '../../../../utils/ComponentUtil';
import Student from './../../../../models/Student'; 
import StudentSearchForm from '../../shared/StudentSearchForm';

class State {
    record : PointRecord  = new PointRecord();
    categories:Category[] = [];
    pointsMap:Record<string, RulePoint[]> = {}; 

    selectedCategoryId:string = "";
    selectedPointId:string = "";

    attachment:AttachmentInfo|undefined;
}
class PointRecordEdit extends BasePage{
    
    state:State = new State();
    studentService:StudentService;
    masterDataService:MasterDataService;
    inputTimeRef:React.RefObject<InputTime> = React.createRef();
    constructor(props) {
        super(props, "Edit Pelanggaran", true);
        this.studentService = this.getServices().studentService;
        this.masterDataService = this.getServices().masterDataService;
    }

    componentReady() {
        this.checkPassedData();
        this.loadCategories();
    }

    categoriesLoaded = (response: WebResponse) => {
        this.setState({categories: response.items});
    }
    
    loadCategories = () => {
        this.commonAjax(
            this.studentService.getCategories,
            this.categoriesLoaded,  this.showCommonErrorAlert
        )
    }
     
    rulePointsLoaded = (categoryId:string, response:WebResponse) => {
        const pointsMap = this.state.pointsMap;
        pointsMap[categoryId.toString()] = response.items;
        this.setState({pointsMap: pointsMap});
    }
    loadRulePoints = (catId:string) => {  
        if (catId === "" || this.state.pointsMap[catId] !== undefined) {
            return;
        }
        const req: WebRequest = {
            filter: {limit:0, fieldsFilter:{category_id: catId}},
            modelName: 'rulepoint',
        }
        this.commonAjax(
            this.masterDataService.list,
            (resp) => this.rulePointsLoaded(catId, resp),
            this.showCommonErrorAlert,
            req
        )
    }

    checkPassedData = () => {
        if (this.props.location &&  this.props.location.state) { 
            this.setState({
                record: PointRecord.clone(this.props.location.state.record),
                attachment: this.props.location.state.attachment
             }, this.updateInput);
        }
    }
    updateInput = () => {
        /**
         * time
         */
        if (this.inputTimeRef.current) {
            this.inputTimeRef.current.updateFromProps();
        }
        /**
         * etc
         */
    }

    updateRecordField =(e:ChangeEvent) => {
        const record = this.state.record;
        const el = e.target as HTMLElement;
        const name = el['name'];
        const value = el['value']
        record[name] =  value;
        this.setState({record: record});
    }
    setSelectedRulePoint = (p:RulePoint) => {
        const record = this.state.record;
        record.rule_point = p;
        record.point_id = p.id;
        this.setState({record: record});
    }

    updateTime = (h: number, m: number, s: number) => {
        const record = this.state.record;
        record.setTime(h, m, s);
        this.setState({ record: record });
    }
    updateDate = (e: ChangeEvent) => {
        const date: Date = parseDate((e.target as HTMLInputElement).value);
        const record = this.state.record;
        record.setDate(date);
        this.setState({ pointRecord: record });
    }
    submit = () => {
        this.commonAjax(
            this.studentService.submitPointRecord,
            this.recordSubmitted,
            this.showCommonErrorAlert,
            this.state.record, this.state.attachment
        )
    }
    recordSubmitted = (r:WebResponse) => {
        this.setState({record : new PointRecord(), attachment: undefined, selectedCategoryId: ""}, ()=> {
            this.showInfo("Data berhasil disimpan");
            this.scrollTop();
        })
    }

    validateInput = () => {
        const rec = this.state.record;
        return ( rec.student_id && rec.point_id  )
    }

    onSubmit = (e:FormEvent) => {
        e.preventDefault();
        if (!this.validateInput()) {
            this.showError("Input tidak lengkap");
            return;
        }
        this.showConfirmation("Simpan data?")
        .then(ok=>{
            if (ok) {  this.submit();  }
        })
    }
    removeImage = () => {
        this.showConfirmationDanger("Hapus gambar?")
        .then(ok=>{
            if (ok) {
                const record = this.state.record;
                record.pictures = [];
                this.setState({record: record, attachment: undefined});
            }
        })
    }
    updatePicture = (e:ChangeEvent) => {
        getAttachmentInfoFromFile(e.target as HTMLInputElement)
        .then(attachment=>{ 
            this.setState({attachment:attachment});
        }).catch(console.error)
    }
    setStudent = (s:Student) => {
        const record = this.state.record;
        record.student = s;
        record.student_id = s.id;
        this.setState({record: record, });
    }
    
    render() {

        const record = this.state.record;
        const categoryID = this.state.selectedCategoryId;
        const pointsMap = this.state.pointsMap;
        const pictureUrl = this.state.attachment?this.state.attachment.url : record.getPicture();

        return (
            <div className="section-body container-fluid">
                <h2>Form Input Pelanggaran</h2>
                <hr/>
                <FormGroup  label="Siswa" >
                    <StudentSearchForm selectItem={this.setStudent} />
                </FormGroup>
                {record.student? <FormGroup>
                    <div  >{record.student.user?.name ?? ""} {Class.studentClassString(record.student)}
                    </div> 
                </FormGroup>
                : null}
                 
                <form onSubmit={this.onSubmit}>
                    <FormGroup label="Pelanggaran">
                        <p>{record.rule_point?.name??"-"} {record.rule_point? `(${record.rule_point.point})` :""}</p>
                        <p/>
                        <select value={categoryID} name="selectedCategoryId" onChange={this.handleInputChange} className="form-control">
                             <option value="">Pilih Kategori</option>
                             {this.state.categories.map((cat:Category)=>{
                                 return (
                                    <option onClick={(e)=> this.loadRulePoints(cat.id.toString())} key={`cat_ed_opt_${cat.id}`} value={cat.id}>
                                        {cat.name}
                                    </option>
                                 )
                             })}
                         </select>
                         <p/>
                         <select className="form-control" >
                             <option value="">Pilih Pelanggaran</option>
                             {pointsMap[categoryID]?
                                pointsMap[categoryID].map(p=>{
                                 return (
                                    <option onClick={(e)=> this.setSelectedRulePoint(p)} key={`rp_ed_opt_${p.id}`} value={p.id}>
                                        {p.name} ({p.point})
                                    </option>
                                 )
                             }) : null}
                         </select>
                    </FormGroup>
                    <FormGroup label="Tanggal">
                        <input type="date" className="form-control" onChange={this.updateDate} name="date" value={record.dateString()} />
                    </FormGroup>
                    <FormGroup label="Waktu">
                        <InputTime ref={this.inputTimeRef} onChange={this.updateTime} value={record.time} />
                    </FormGroup>
                    <FormGroup label="Lokasi">
                        <input type="text" name="location" onChange={this.updateRecordField} className="form-control" value={record.location??""} />
                    </FormGroup>
                    <FormGroup label="Deskripsi">
                        <textarea className="form-control" name="description" onChange={this.updateRecordField} value={record.description??""} />
                    </FormGroup>
                    <FormGroup label="Gambar">
                        {pictureUrl?
                            <>
                                <img src={pictureUrl} width={200} height={200} className="border border-dark" />
                                <p/> 
                                <AnchorWithIcon className="btn btn-danger btn-sm"  onClick={this.removeImage} iconClassName="fas fa-times"  >Hapus Gambar</AnchorWithIcon>
                            </>:
                            <div>
                                <input onChange={this.updatePicture} type="file" accept="image/*" className="form-control" />
                            </div>
                        }
                    </FormGroup>
                    <FormGroup>
                        <Link className="btn btn-dark" to="/dormitoryactivity/pointsummary">Kembali</Link>
                        <input type="submit" className="btn btn-primary ml-3" value="Submit" />
                    </FormGroup>
                    {/* <FormGroup label="Siswa">
                        <input type="text" className="form-control" value={record.student?.user?.name} />
                    </FormGroup> */}
                </form>
            </div>
        )
    }
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    
)(PointRecordEdit))
