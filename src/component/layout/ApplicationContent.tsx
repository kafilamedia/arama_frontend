

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../pages/login/Login';
import DashboardMain from '../pages/dashboard/main/DashboardMain';
import HomeMain from '../pages/home/HomeMain';
import Menu from '../../models/settings/Menu'; 
import MusyrifManagement from '../pages/management/MusyrifManagement';
import ManagementMain from '../pages/management/ManagementMain';
import CategoryManagement from '../pages/management/CategoryManagement';
import RulePointManagement from '../pages/management/RulePointManagement';
import StudentList from '../pages/asrama/StudentList';
import InputPointForm from '../pages/asrama/InputPointForm';
import PointRecordsManagement from '../pages/management/PointRecordsSummary';
import MedicalRecordForm from '../pages/asrama/medicalrecord/MedicalRecordForm';
import AboutUs from './../pages/home/AboutUs';
import Register from '../pages/login/Register'; 
import PointRecordEdit from '../pages/asrama/point-record/PointRecordEdit';
import FollowUpReminder from '../pages/dashboard/main/FollowUpReminder';
import WarningActionManagement from '../pages/management/WarningActionManagement';
import ConfigSettingPage from '../pages/settings/ConfigSettingPage';
import StudentSemesterReport from '../pages/report/StudentSemesterReport';
import CategoryPredicateManagement from '../pages/management/CategoryPredicateManagement';
import RuleViolationManagement from '../pages/management/RuleViolationManagement';

class ApplicationContent extends BaseComponent {
 
    constructor(props: any) {
        super(props, false);
    }
    setSidebarMenus = (menus: Menu[]) => {
        this.props.setSidebarMenus(menus);
    }
    render() {
        return (
            <Fragment>
                <Switch>
                   
                    {/* -------- home -------- */}
                    <Route exact path="/home" render={
                        (props: any) => {
                            return <HomeMain />
                        }
                    } />
                    <Route exact path="/" render={
                        (props: any) =>
                            <HomeMain />
                    } />
                    <Route exact path="/about" render={
                        (props: any) =>
                            <AboutUs />
                    } />
                     
{/* 
                     
                    <Route exact path="/management" render={
                        (props: any) => {
                            console.debug("MANAGEMENTS path")
                            return <MasterDataMain setSidebarMenus={this.setSidebarMenus} />
                        }
                    } />
                    <Route exact path="/management/:code" render={
                        (props: any) =>
                            <MasterDataMain setSidebarMenus={this.setSidebarMenus} />
                    } /> */}


                    {/* ///////// PUBLIC ///////// */}

                </Switch>
                <LoginRoute />
                <Asrama     />
                <Management />
                <Dashboard  />
                <Setting    />
                <Report     />
            </Fragment>
        )
    }
    componentDidMount() {
        // document.title = "Login";
    }

}

const Setting  = (props) => {

    return (
        <Switch>
            <Route exact path="/settings/config" render={
                (props:any) => <ConfigSettingPage />
            } />
        </Switch>
    )
}
const Report  = (props) => {

    return (
        <Switch>
            <Route exact path="/report/studentreport" render={
                (props:any) => <StudentSemesterReport />
            } />
        </Switch>
    )
}
const Management  = (props) => {

    return (
        <Switch>
            <Route exact path="/management" render={
                (props:any) => <ManagementMain />
            } />
            <Route exact path="/management/musyrifmanagement" render={
                (props:any) => <MusyrifManagement />
            } />
            <Route exact path="/management/rule_category" render={
                (props:any) => <CategoryManagement />
            } />
            <Route exact path="/management/rule_point" render={
                (props:any) => <RulePointManagement />
            } />
            <Route exact path="/management/warning_action" render={
                (props:any) => <WarningActionManagement />
            } />
            <Route exact path="/management/category_predicate" render={
                (props:any) => <CategoryPredicateManagement />
            } />
            <Route exact path="/management/rule_violation" render={
                (props:any) => <RuleViolationManagement />
            } />
        </Switch>
    )
}

const Asrama = (proos) => {

    return (
        <Switch>
             <Route exact path="/asrama/studentlist" render={
                (props:any) => <StudentList />
            } />
             <Route exact path="/asrama/inputpoint" render={
                (props:any) => <InputPointForm/>
            } />
             <Route exact path="/asrama/pointsummary" render={
                (props:any) => <PointRecordsManagement/>
            } />
             <Route exact path="/asrama/pointrecordedit" render={
                (props:any) => <PointRecordEdit/>
            } />
             <Route exact path="/asrama/medicalrecord" render={
                (props:any) => <MedicalRecordForm/>
            } />
            
        </Switch>
    )
}
const LoginRoute = (props) => {

    return (
        <Switch>
            <Route exact path="/login" render={
                (props: any) =>
                    <Login />
            } />
            <Route exact path="/register" render={
                (props: any) =>
                    <Register />
            } />
        </Switch>
    )
}


const Dashboard = (props) => {
    return (
        <Switch>
            {/* -------- dashboard -------- */}
            <Route exact path="/dashboard" render={
                (props: any) => {
                   
                        console.debug("dashboard path")   
                       return  <DashboardMain />
                }
                   
            } />
              <Route exact path="/dashboard/followup" render={
                (props: any) =>
                    <FollowUpReminder />
            } /> 
        </Switch>
    )
}
 

const mapDispatchToProps = (dispatch: Function) => ({})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(ApplicationContent))