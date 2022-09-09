import React, { ChangeEvent, FormEvent } from 'react'
import BasePage from '../../BasePage';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../../constant/stores';
import PointRecord from '../../../../models/PointRecord';
import FormGroup from '../../../form/FormGroup';
import Class from '../../../../models/Class';
import StudentService from '../../../../services/StudentService';
import WebResponse from '../../../../models/commons/WebResponse';
import Category from '../../../../models/Category';
import WebRequest from '../../../../models/commons/WebRequest';
import RulePoint from '../../../../models/RulePoint';
import MasterDataService from '../../../../services/MasterDataService';
import InputTime from '../../../form/InputTime';
import { parseDate } from '../../../../utils/DateUtil';
import AnchorWithIcon from '../../../navigation/AnchorWithIcon';
import AttachmentInfo from '../../../../models/settings/AttachmentInfo';
import { getAttachmentInfoFromFile } from '../../../../utils/ComponentUtil';
import Student from '../../../../models/Student';
import StudentSearchForm from '../../shared/StudentSearchForm';
import ClassMemberSearchForm from '../../shared/ClassMemberSearchForm';
import { resolve } from 'inversify-react';

class State {
  record = new PointRecord();
  categories: Category[] = [];
  pointsMap: Record<string, RulePoint[]> = {};

  selectedCategoryId = 0;
  selectedPointId = 0;

  attachment: AttachmentInfo | undefined;
  editMode = false;
  editModeRemoveImage = false;
}
class PointRecordEdit extends BasePage {
  state = new State();
  @resolve(StudentService)
  private studentService: StudentService;
  @resolve(MasterDataService)
  private masterDataService: MasterDataService;
  private inputTimeRef = React.createRef<InputTime>();
  constructor(props) {
    super(props, "Edit Pelanggaran", true);
  }

  componentReady() {
    this.checkPassedData();
    this.loadCategories();
  }

  categoriesLoaded = (response: WebResponse) => {
    this.setState({ categories: response.result.items });
  }

  loadCategories = () => {
    this.commonAjax(
      this.studentService.getCategories,
      this.categoriesLoaded,
      this.showCommonErrorAlert
    );
  }
  rulePointsLoaded = (categoryId: string, response: WebResponse) => {
    const pointsMap = this.state.pointsMap;
    pointsMap[categoryId.toString()] = response.result.items;
    this.setState({ pointsMap: pointsMap });
  }
  loadRulePoints = (catId: string) => {
    if (catId === '' || this.state.pointsMap[catId] != undefined) {
      return;
    }
    const req: WebRequest = {
      filter: { limit: 0, fieldsFilter: { 'category.id=': catId }, orderBy: 'name' },
      modelName: 'rule-points',
    }
    this.commonAjax(
      this.masterDataService.list,
      (resp) => this.rulePointsLoaded(catId, resp),
      this.showCommonErrorAlert,
      req,
      'asrama'
    )
  }
  checkPassedData = () => {
    if (this.props.location && this.props.location.state) {
      const record = PointRecord.clone(this.props.location.state.record);
      this.setState({
        editMode: true,
        record,
        selectedCategoryId: record.ruleCategoryId,
        attachment: this.props.location.state.attachment
      }, this.updateInput);
      this.loadRulePoints(record.ruleCategoryId?.toString() ?? '');
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
  updateRecordField = (e: ChangeEvent) => {
    const { record } = this.state;
    const el = e.target as HTMLElement;
    const name = el['name'];
    const value = el['value']
    record[name] = value;
    this.setState({ record });
  }
  setSelectedRulePoint = (p: RulePoint) => {
    const { record, selectedCategoryId } = this.state;
    record.rulePointId = p.id;
    record.point = p.point;
    record.ruleName = p.name;
    record.ruleCategoryId = selectedCategoryId;
    this.setState({ record });
  }
  updateTime = (h: number, m: number, s: number) => {
    const { record } = this.state;
    record.setTime(h, m, s);
    this.setState({ record });
  }
  updateDate = (e: ChangeEvent<HTMLInputElement>) => {
    const date = parseDate(e.target.value);
    const record = this.state.record;
    record.time = date;
    this.setState({ pointRecord: record });
  }
  submit = () => {
    const { editMode, editModeRemoveImage } = this.state;
    if (editMode) {
      this.commonAjax(
        this.studentService.updatePointRecord,
        this.recordSubmitted,
        this.showCommonErrorAlert,
        this.state.record,
        this.state.attachment,
        editModeRemoveImage
      )
    } else {
      this.commonAjax(
        this.studentService.insertPointRecord,
        this.recordSubmitted,
        this.showCommonErrorAlert,
        this.state.record,
        this.state.attachment
      )
    }
  }
  recordSubmitted = (r: WebResponse) => {
    this.setState({ record: new PointRecord(), attachment: undefined, selectedCategoryId: '' }, () => {
      this.showInfo("Data berhasil disimpan");
      this.scrollTop();
    })
  }
  validateInput = () => {
    const { classMemberId, rulePointId } = this.state.record;
    return (classMemberId && rulePointId)
  }
  onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!this.validateInput()) {
      this.showError("Input tidak lengkap");
      return;
    }
    this.showConfirmation("Simpan data?")
      .then(ok => {
        if (ok) { this.submit(); }
      })
  }
  onRemoveImageOptionChanged = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ editModeRemoveImage: e.target.checked });
  }
  removeImage = () => {
    this.showConfirmationDanger("Hapus gambar?")
      .then(ok => {
        if (ok) {
          const { record } = this.state;
          record.pictures = [];
          this.setState({ record, attachment: undefined });
        }
      })
  }
  updatePicture = (e: ChangeEvent) => {
    getAttachmentInfoFromFile(e.target as HTMLInputElement)
      .then(attachment => {
        this.setState({ attachment });
      }).catch(console.error)
  }
  setStudent = (s: Student) => {
    const { record } = this.state;
    record.studentName = s.name
    record.classMemberId = s.id;
    record.classLetter = s.classLetter;
    record.classLevel = s.classLevel;
    record.schoolName = s.schoolName;
    this.setState({ record });
  }

  updateCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    this.handleInputChange(e);
    this.loadRulePoints(e.target.value);
  }

  updateRulePoint = (e: ChangeEvent<HTMLSelectElement>) => {
    const { selectedCategoryId, pointsMap } = this.state;
    const filtered = pointsMap[selectedCategoryId].filter((r) => r.id?.toString() == e.target.value);
    if (filtered.length == 0) return;
    this.setSelectedRulePoint(filtered[0]);
  }

  render() {
    const { editMode, editModeRemoveImage, record, selectedCategoryId, pointsMap, attachment } = this.state;
    const pictureUrl = attachment ? attachment.url : record.getPicture();

    return (
      <div className="section-body container-fluid">
        <h2>Form Input Pelanggaran</h2>
        <hr />
        <FormGroup label="Siswa" >
          <ClassMemberSearchForm selectItem={this.setStudent} />
        </FormGroup>
        {
          record.classMemberId &&
          <FormGroup>
            <div>{record.studentName} {record.classLevel}{record.classLetter} {record.schoolName}
            </div>
          </FormGroup>
        }
        <form onSubmit={this.onSubmit}>
          <FormGroup label="Pelanggaran">
            <p>{record.ruleName ?? '-'} {record.point ?? ''}</p>
            <p />
            <select value={selectedCategoryId} name="selectedCategoryId" onChange={this.updateCategory} className="form-control">
              <option value="">Pilih Kategori</option>
              {this.state.categories.map((cat: Category) => {
                return (
                  <option key={`cat_ed_opt_${cat.id}`} value={cat.id}>
                    {cat.name}
                  </option>
                )
              })}
            </select>
            <p />
            <select value={record.rulePointId} className="form-control" onChange={this.updateRulePoint} >
              <option value="">Pilih Pelanggaran</option>
              {
                pointsMap[selectedCategoryId] &&
                pointsMap[selectedCategoryId].map(p => {
                  return (
                    <option key={`rp_ed_opt_${p.id}`} value={p.id}>
                      {p.name} ({p.point})
                    </option>
                  );
                })
              }
            </select>
          </FormGroup>
          <FormGroup label="Tanggal">
            <input type="date" className="form-control" onChange={this.updateDate} name="date" value={record.dateString()} />
          </FormGroup>
          <FormGroup label="Waktu">
            <InputTime ref={this.inputTimeRef} onChange={this.updateTime} value={record.timeString} />
          </FormGroup>
          <FormGroup label="Lokasi">
            <input type="text" name="location" onChange={this.updateRecordField} className="form-control" value={record.location ?? ""} />
          </FormGroup>
          <FormGroup label="Deskripsi">
            <textarea className="form-control" name="description" onChange={this.updateRecordField} value={record.description ?? ""} />
          </FormGroup>
          <FormGroup label="Gambar">
            <div>
              <img
                src={pictureUrl ?? ''}
                width={200}
                height={200}
                className="border border-dark mb-2"
              />
            </div>
            {
              attachment &&
              <AnchorWithIcon className="btn btn-danger btn-sm" onClick={this.removeImage} iconClassName="fas fa-times"  >Hapus Gambar</AnchorWithIcon>
            }
            <div>
              <input
                onChange={this.updatePicture}
                type="file"
                accept="image/*"
                className="form-control"
              />
            </div>
          </FormGroup>
          {
            editMode &&
            <FormGroup label="Hapus Gambar">
              <input id="remove-img-check" type="checkbox" checked={editModeRemoveImage} onChange={this.onRemoveImageOptionChanged} />
              <label htmlFor="remove-img-check" className="ml-2">Hapus Gambar</label>
            </FormGroup>
          }
          <FormGroup>
            <Link className="btn btn-dark" to="/asrama/pointsummary">Kembali</Link>
            <input type="submit" className="btn btn-primary ml-3" value="Submit" />
          </FormGroup>
        </form>
      </div>
    )
  }
}

export default withRouter(connect(mapCommonUserStateToProps)(PointRecordEdit))
