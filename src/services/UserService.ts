import 'reflect-metadata';
import { injectable } from 'inversify';
import { AxiosResponse } from 'axios';
import WebResponse from '../models/commons/WebResponse';
import { contextPath } from './../constant/Url';
import { updateAccessToken } from './../middlewares/Common';
import { commonAjaxGetCalls, commonAjaxPublicGetCalls } from './Promises';

@injectable()
export default class UserService {
  requestApplicationId = (callbackSuccess: (response: WebResponse) => any, callbackError: () => any) => {
    const url = contextPath() + 'api/public/asrama/config';
    commonAjaxGetCalls(url).then((data) => {
      if (data.code != '00') {
        alert('Error requesting app ID');
        return;
      }
      const response = data.rawAxiosResponse as AxiosResponse;
      if (!response.headers['access-token'] || response.headers['access-token'] == '') {
        throw new Error('Unauthenticated');
      }
      updateAccessToken(response);
      console.debug('Header.AccessToken:', response.headers['access-token']);
      callbackSuccess(data);
    }).catch(e => {
      console.error('Req app id: ', e);
      callbackError();
    });
  }
  getLoggedUser = (callbackSuccess: (data) => any, callbackError: () => any) => {
    const url = contextPath() + 'api/user';
    commonAjaxGetCalls(url).then(callbackSuccess)
      .catch(e => {
        console.error('ERROR requestApplicationId: ', e);
        callbackError();
      });
  }
  requestApplicationIdNoAuth = (callbackSuccess: (response: WebResponse) => any, callbackError: () => any) => {
    const url = contextPath() + 'api/public/asrama/config';
    commonAjaxPublicGetCalls(url).then(data => {
      if (data.code != '00') {
        alert('Error requesting app ID');
        return;
      }
      callbackSuccess(data);
    }).catch(e => {
      console.error('ERROR requestApplicationId No Auth: ', e);
      //   alert('Error, please reload OR try again');
      callbackError();
    });
  }
}
