
import User from './../models/User';
import WebRequest from '../models/commons/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls, commonAjaxPublicPostCalls } from './Promises';
import WebResponse from '../models/commons/WebResponse';
import { updateAccessToken } from './../middlewares/Common';
export default class UserService {
    private static instance?: UserService;

    static getInstance(): UserService {
        if (this.instance == null) {
            this.instance = new UserService();
        }
        return this.instance;
    }
    updateProfile = (user: User) => {

        const request: WebRequest = {
            user: user
        }

        const endpoint = contextPath().concat("api/member/account/updateprofile")
        return commonAjaxPostCalls(endpoint, request);
    }
    saveUser = (user: User) => {

        const request: WebRequest = {
            user: user
        } 
        const endpoint = contextPath().concat("api/public/register")
        return commonAjaxPublicPostCalls(endpoint, request);
    }
    requestApplicationId = (callbackSuccess: (response: WebResponse) => any, callbackError: ()=>any) => {
        const url = contextPath() + "api/accountdashboard/requestid";
        commonAjaxPostCalls(url, {}).then(data => {
            if (data.code != "00") {
                alert("Error requesting app ID");
                return;
            }
            const response = data.rawAxiosResponse;
            updateAccessToken(response);
            console.debug("response header:", response.headers['api_token']);
            callbackSuccess(data);
        }).catch(e => {
            console.error("ERROR requestApplicationId: ", e);
            callbackError();
        })

    }
    requestApplicationIdNoAuth = (callbackSuccess: (response:WebResponse)=>any, callbackError: ()=>any) => {
        const url =   contextPath() + "api/account/requestid";
        commonAjaxPublicPostCalls(url, {}).then(data => {
          if (data.code != "00") {
              alert("Error requesting app ID");
              return;
          } 
          callbackSuccess(data);
      }).catch(e=>{
          console.error("ERROR requestApplicationId No Auth: ", e);
        //   alert("Error, please reload OR try again");
            callbackError();
      })
          
      }

}