

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../pages/login/Login';
import DashboardMain from '../pages/dashboard/main/DashboardMain';
import HomeMain from '../pages/home/HomeMain';
import BaseMainMenus from './BaseMainMenus';
import Menu from '../../models/settings/Menu';
import SettingsMain from '../pages/settings/SettingsMain';
import UserProfile from '../pages/settings/UserProfile';
import MusyrifManagement from '../pages/management/MusyrifManagement';
import ManagementMain from '../pages/management/ManagementMain';
import CategoryManagement from '../pages/management/CategoryManagement';
import RulePointManagement from '../pages/management/RulePointManagement';
import StudentList from '../pages/dormitoryactivity/StudentList';
import InputPointForm from '../pages/dormitoryactivity/InputPointForm';
import PointRecordsManagement from '../pages/dormitoryactivity/PointRecordsManagement';
import EditApplicationProfile from '../pages/settings/EditApplicationProfile';
import AboutUs from './../pages/home/AboutUs';
import Register from '../pages/login/Register';

class ApplicationContent extends BaseComponent {

    ref: React.RefObject<BaseMainMenus> = React.createRef();
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
                            console.debug("Home path")
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
                <Settings />
                <StudentsRoute />
                <MusyrifManagementRoute/>
                <Dashboard />
            </Fragment>
        )
    }
    componentDidMount() {
        // document.title = "Login";
    }

}

const MusyrifManagementRoute  = (props) => {

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
        </Switch>
    )
}

const StudentsRoute = (proos) => {

    return (
        <Switch>
             <Route exact path="/dormitoryactivity/studentlist" render={
                (props:any) => <StudentList />
            } />
             <Route exact path="/dormitoryactivity/inputpoint" render={
                (props:any) => <InputPointForm/>
            } />
             <Route exact path="/dormitoryactivity/pointsummary" render={
                (props:any) => <PointRecordsManagement/>
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
            {/* <Route exact path="/dashboard/quizhistory" render={
                (props: any) =>
                    <QuizHistoryPage />
            } /> */}
        </Switch>
    )
}

const Settings = (props) => {
    return (
        <Switch>
            {/* -------- settings --------- */}
            <Route exact path="/settings" render={
                (props: any) =>
                    <SettingsMain />
            } />
            <Route exact path="/settings/user-profile" render={
                (props: any) =>
                    <UserProfile />
            } />
            <Route exact path="/settings/app-profile" render={
                (props: any) =>
                    <EditApplicationProfile />
            } />
        </Switch>
    )
}
 


const mapDispatchToProps = (dispatch: Function) => ({})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(ApplicationContent))