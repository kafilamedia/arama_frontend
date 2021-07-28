import { Component } from 'react';
import WebResponse from '../models/commons/WebResponse';
import ApplicationProfile from './../models/ApplicationProfile';
import User from './../models/User';
import Services from './../services/Services';
import { AuthorityType } from '../models/AuthorityType';
import WebRequest from '../models/commons/WebRequest';
import { sendToWebsocket } from './../utils/websockets';
import { doItLater } from './../utils/EventUtil';

export default class BaseComponent extends Component<any, any> {
    parentApp: any;
    authenticated: boolean = true;
    state: any = { updated: new Date() };
    constructor(props: any, authenticated = false) {
        super(props);

        this.authenticated = authenticated
        this.parentApp = props.mainApp;
    }

    validateLoginStatus = (callback ?:() => any) => {
        if (this.authenticated == false) { 
            if (callback) {
                callback();
            }
            return true; }
        if (this.isUserLoggedIn() == false) {
            this.backToLogin();
            return false;
        }
        if (callback) {
            callback();
        }
        return true;
    }

    protected sendWebSocket = (url: string, payload: WebRequest) => {
        sendToWebsocket(url, payload);
    }

    protected setWsUpdateHandler = (handler: Function | undefined) => {
        if (this.parentApp) {
            this.parentApp.setWsUpdateHandler(handler);
        }
    }
    protected resetWsUpdateHandler = () => {
        if (this.parentApp) {
            this.parentApp.resetWsUpdateHandler();
        }
    }

    getApplicationProfile = (): ApplicationProfile => {
        return this.props.applicationProfile == null ? new ApplicationProfile() : this.props.applicationProfile;
    }

    handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type == 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value });
    }


    /**
     * 
     * @param {boolean} withProgress 
     */
    startLoading(withProgress: boolean) {
        this.parentApp.startLoading(withProgress);
    }

    endLoading() {
        this.parentApp.endLoading();
    }
    /**
     * api response must be instance of WebResponse
     * @param method returning Promise
     * @param withProgress 
     * @param successCallback 
     * @param errorCallback 
     * @param params 
     */
    doAjax = (method: Function, withProgress: boolean, successCallback: Function, errorCallback?: Function, ...params: any) => {
        this.startLoading(withProgress);
        
        method(...params).then( (response: WebResponse) => {
            if (successCallback) {
                successCallback(response);
            }
        }).catch( (e) => {
            if (errorCallback) {
                errorCallback(e);
            } else {
                if (typeof (e) == 'string') {
                    alert("Operation Failed: " + e);
                }
                alert("resource not found");
            }
        }).finally(() => {
            this.endLoading();
        })
    }

    commonAjax = (method: Function, successCallback: Function, errorCallback: Function, ...params: any) => {
        this.doAjax(method, false, successCallback, errorCallback, ...params);
    }
    commonAjaxWithProgress = (method: Function, successCallback: Function, errorCallback: Function, ...params: any) => {
        this.doAjax(method, true, successCallback, errorCallback, ...params);
    }
    getLoggedUser = (): User | undefined => {
        const user: User | undefined = this.props.loggedUser;
        if (!user) return undefined;
        user.password = "^_^";
        return Object.assign(new User(), user);
    }
    isAdmin = (): boolean => {
        const user = this.getLoggedUser();
        if (!user) return false;
        return user.hasRole(AuthorityType.admin_asrama);
    }
    scrollTop = () => {
        // console.info("SCROLL TOP");
        const opt:ScrollToOptions = { top:0,  behavior: 'smooth' };
        doItLater(()=>{
        window.scrollTo(opt);
        }, 100);
    }
    isUserLoggedIn = (): boolean => {
        const loggedIn = true == this.props.loginStatus && null != this.props.loggedUser;
        return loggedIn;
    }
    showConfirmation = (body: any): Promise<boolean> => {
        const app = this;
        return new Promise(function (resolve, reject) {
            const onYes = function (e) {
                resolve(true);
            }
            const onNo = function (e) {
                resolve(false);
            }
            app.parentApp.showAlert("Confirmation", body, false, onYes, onNo);
        });

    }
    showConfirmationDanger = (body: any): Promise<any> => {
        const app = this;
        return new Promise(function (resolve, reject) {
            const onYes = function (e) {
                resolve(true);
            }
            const onNo = function (e) {
                resolve(false);
            }
            app.parentApp.showAlertError("Confirmation", body, false, onYes, onNo);
        });

    }
    showInfo = (body: any) => {
        this.parentApp.showAlert("Info", body, true, function () { });
    }
    showError = (body: any) => {

        this.parentApp.showAlertError("Error", body, true, function () { });
    }

    backToLogin() {
        if (!this.authenticated || this.props.history == null) {
            return;
        }
        this.props.history.push("/login");
    }
    refresh() {
        this.setState({ updated: new Date() });
    }

    showCommonErrorAlert = (e: any) => {
        console.error(e);

        let message;
        if (e.response && e.response.data) {
            message = e.response.data.message;
        } else {
            message = e;
        }
        this.showError("Operation Failed: " + message);
    }
    componentDidMount() {
        if (this.validateLoginStatus()) {
        }
    }
    componentDidUpdate() {
        if (this.authenticated == true && this.isUserLoggedIn() == false) {
            console.debug(typeof this, "BACK TO LOGIN");
            this.validateLoginStatus();
        }
    }

    getServices = (): Services => {
        return this.props.services;
    }
}