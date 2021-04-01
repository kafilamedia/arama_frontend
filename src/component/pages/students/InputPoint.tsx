
import React from 'react'
import BaseComponent from './../../BaseComponent';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import Student from './../../../models/Student';
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import Modal from './../../container/Modal';
import MasterDataService from './../../../services/MasterDataService';
import FormStepThree from './form/FormStepThree';
import FormStepTwo from './form/FormStepTwo';
import FormStepOne from './form/FormStepOne';
import Category from './../../../models/Category';
import RulePoint from './../../../models/RulePoint';
import SimpleError from './../../alert/SimpleError';
class State {
    student?: Student  
    category?: Category; 
    rulePoint?:RulePoint;
    formStep: number = 1;
}
class InputPoint extends BaseComponent {
    state: State = new State();
    masterDataService: MasterDataService;
    constructor(props) {
        super(props, true);
        this.masterDataService = this.getServices().masterDataService;
    }
    validateStudentData = () => {
        if (!this.props.location.state) {
            return;
        }
        const student = this.props.location.state.student;

        if (student) {
            this.setState({ student: Object.assign(new Student(), student) });
        }
    }
    componentDidMount() {
        super.componentDidMount();
        this.validateStudentData();
    }
    setCategory = (c: Category) => {
        this.setState({ category: c });
    }
    setRulePoint = (r:RulePoint) => {
        this.setState({rulePoint:r});
    }
    nextStep = (step: number) => {
        this.setState({ formStep: step });
    }
    render() {
        const student: Student | undefined = this.state.student;
        if (!student) {
            return  <Warning/>
        }
         
        return (
            <div className="container-fluid section-body">
                <h2>Input Point</h2>
                <Modal title={student.user?.name + " - " + student.kelas?.level + student.kelas?.rombel + " " + student.kelas?.sekolah?.nama}>

                    {this.state.formStep == 1 ? <FormStepOne  category={this.state.category} setSelectedCategory={this.setCategory}
                        onSubmit={() => { this.nextStep(2) }} />
                        : null}
                     {this.state.formStep == 2 && this.state.category? 
                        <FormStepTwo 
                            rulePoint={this.state.rulePoint}    
                            setRulePoint={this.setRulePoint}
                            category={this.state.category} onBack={()=>this.nextStep(1)} onSubmit={() => { this.nextStep(3) }}
                        />:null} 
                    {this.state.formStep == 3 && this.state.category && this.state.rulePoint? 
                        <FormStepThree 
                            rulePoint={this.state.rulePoint} 
                             onBack={()=>this.nextStep(2)} onSubmit={() => { this.nextStep(4) }}
                        />:null} 
                </Modal>
            </div>
        )
    }
}
 
const Warning = () => {
    return (
        <div className="container-fluid section-body">
            <h2>Input Point</h2>
            <SimpleError>
                <i className="fas fa-exclamation-circle"/>&nbsp;Please select student <hr />
                <AnchorWithIcon to={"/students/studentlist"} iconClassName="fas fa-list">Student List</AnchorWithIcon>
            </SimpleError>
        </div>
    )
}

export default withRouter(
    connect(
        mapCommonUserStateToProps
    )(InputPoint)
)