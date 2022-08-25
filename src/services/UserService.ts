
import User from './../models/User';
import WebRequest from '../models/commons/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxGetCalls, commonAjaxPostCalls, commonAjaxPublicGetCalls, commonAjaxPublicPostCalls } from './Promises';
import WebResponse from '../models/commons/WebResponse';
import { updateAccessToken } from './../middlewares/Common';
import { AxiosResponse } from 'axios';
export default class UserService {
  private static instance?: UserService;

  static getInstance = () => UserService.instance ? UserService.instance : UserService.instance = new UserService();

  updateProfile = (user: User) => {
    const request: WebRequest = { user }
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
  requestApplicationId = (callbackSuccess: (response: WebResponse) => any, callbackError: () => any) => {
    const url = contextPath() + "api/public/index";
    commonAjaxGetCalls(url).then((data) => {
      if (data.code != "00") {
        alert("Error requesting app ID");
        return;
      }
      const response = data.rawAxiosResponse as AxiosResponse;
      if (!response.headers['access-token'] || response.headers['access-token'] == '') {
        throw new Error('Unauthenticated');
      }
      updateAccessToken(response);
      console.debug("response header:", response.headers['access-token']);
      callbackSuccess(data);
    }).catch(e => {
      console.error("ERROR requestApplicationId: ", e);
      callbackError();
    });
  }
  getLoggedUser = (callbackSuccess: (data) => any, callbackError: () => any) => {
    const url = contextPath() + "api/user";
    commonAjaxGetCalls(url).then(callbackSuccess)
      .catch(e => {
        console.error("ERROR requestApplicationId: ", e);
        callbackError();
      });
  }
  requestApplicationIdNoAuth = (callbackSuccess: (response: WebResponse) => any, callbackError: () => any) => {
    const url = contextPath() + "api/public/index";
    commonAjaxPublicGetCalls(url).then(data => {
      if (data.code != "00") {
        alert("Error requesting app ID");
        return;
      }
      callbackSuccess(data);
    }).catch(e => {
      console.error("ERROR requestApplicationId No Auth: ", e);
      //   alert("Error, please reload OR try again");
      callbackError();
    })

  }

}