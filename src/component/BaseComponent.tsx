import { Component } from 'react';
import WebResponse from './../models/WebResponse';
import ApplicationProfile from './../models/ApplicationProfile';
import User from './../models/User';
import Services from './../services/Services';
import { AuthorityType } from '../models/AuthorityType';
import WebRequest from './../models/WebRequest';
import { sendToWebsocket } from './../utils/websockets';

export default class BaseComponent extends Component<any, any> {
    parentApp: any;
    authenticated: boolean = true;
    state: any = { updated: new Date() };
    constructor(props: any, authenticated = false) {
        super(props);
        
        this.authenticated = authenticated
        this.state = {
            ...this.state
        }
        this.parentApp = props.mainApp;
    }
    
    validateLoginStatus = () => {
        if (this.authenticated == false) return;
        if (this.isLoggedUserNull()) {
            this.backToLogin();
        }
    }

    protected sendWebSocket = (url:string, payload:WebRequest) => {
        sendToWebsocket(url, payload);
    }

    protected setWsUpdateHandler =(handler:Function | undefined) => {
        if (this.parentApp) {
            this.parentApp.setWsUpdateHandler(handler);
        }
    }
    protected resetWsUpdateHandler = () => {
        if (this.parentApp) {
            this.parentApp.resetWsUpdateHandler();
        }
    }

    getApplicationProfile = ():ApplicationProfile => {
        return this.props.applicationProfile == null ? new ApplicationProfile() : this.props.applicationProfile;
    }

    handleInputChange=(event: any) =>{
        const target = event.target;
        const value = target.type == 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value });
        console.debug("input changed: ", target.name, value);
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
     * @param method 
     * @param withProgress 
     * @param successCallback 
     * @param errorCallback 
     * @param params 
     */
    doAjax(method: Function, withProgress: boolean, successCallback: Function, errorCallback?: Function, ...params: any ) {
        this.startLoading(withProgress);

        method(...params).then(function (response:WebResponse) {
            if (successCallback) {
                successCallback(response);
            }
        }).catch(function (e) {
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

    commonAjax(method: Function, successCallback: Function, errorCallback: Function, ...params:any) {
        this.doAjax(method, false, successCallback, errorCallback, ...params);
    }
    commonAjaxWithProgress(method: Function, successCallback: Function, errorCallback: Function, ...params:any) {
        this.doAjax(method, true, successCallback, errorCallback, ...params);
    }
    getLoggedUser():User|undefined {
        const user:User|undefined = this.props.loggedUser;
        if (!user) return undefined;
        user.password = "^_^";
        return Object.assign(new User(), user);
    }
    isAdmin = () : boolean => {
        const user = this.getLoggedUser();
        if (!user) return false;
        return user.hasRole(AuthorityType.admin_asrama);
    }
    isLoggedUserNull(): boolean {
        return false == this.props.loginStatus || null == this.props.loggedUser;
    }
    isUserLoggedIn(): boolean {
        const loggedIn = true == this.props.loginStatus && null != this.props.loggedUser;
        console.debug("LOgged in: ", loggedIn);
        return loggedIn;
    }
    showConfirmation(body:any): Promise<boolean> {
        const app = this;
        return new Promise(function(resolve, reject){
            const onYes = function (e) {
                resolve(true);
            }
            const onNo = function (e) {
                resolve(false);
            }
            app.parentApp.showAlert("Confirmation", body, false, onYes, onNo);
        });
  
    }
    showConfirmationDanger(body: any): Promise<any> {
        const app = this;
        return new Promise(function(resolve, reject){
            const onYes = function (e) {
                resolve(true);
            }
            const onNo = function (e) {
                resolve(false);
            }
            app.parentApp.showAlertError("Confirmation", body, false, onYes, onNo);
        });

    }
    showInfo(body: any) {
        this.parentApp.showAlert("Info", body, true, function () { });
    }
    showError(body: any) {
       
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

    showCommonErrorAlert = (e:any) => {
        console.error(e);
        
        let message;
        if (e.response && e.response.data ) {
            message = e.response.data.message;
        } else {
            message = e;
        } 
        this.showError("Operation Failed: "+message);
    }
    componentDidMount() {
        this.validateLoginStatus();
    }
    componentDidUpdate() {
        if (this.authenticated == true && this.isLoggedUserNull()) {
            console.debug(typeof this , "BACK TO LOGIN");
            this.validateLoginStatus();
        }
    }

    getServices = () : Services => {
        return this.props.services;
    }
}