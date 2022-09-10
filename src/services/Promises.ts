
import { commonAuthorizedHeader, commonHeader } from '../middlewares/Common';
import WebResponse from '../models/commons/WebResponse';
import { updateAccessToken } from './../middlewares/Common';
import AttachmentInfo from '../models/settings/AttachmentInfo';
import Axios from 'axios';

const CODE_SUCCESS = '00';

export const rejectedPromise = (message: any) => {
  return new Promise((res, rej) => rej(message));
}

export const emptyPromise = (defaultResponse: any) => new Promise(function (res, rej) {
  res(defaultResponse);
});

export const commonAjaxPostCalls = (endpoint: string, payload?: any, contentType = 'application/json') => {
  const request = payload ?? {};
  return new Promise<WebResponse>(function (resolve, reject) {
    Axios.post(endpoint, request, {
      headers: commonAuthorizedHeader(contentType)
    })
      .then(axiosResponse => {
        updateAccessToken(axiosResponse);
        const response: WebResponse = axiosResponse.data;
        response.rawAxiosResponse = axiosResponse;
        if (response.code == CODE_SUCCESS) {

          resolve(response);
        }
        else { reject(response); }
      })
      .catch((e: any) => {
        console.error(e);
        reject(e);
      });
  })
}
export const commonAjaxPutCalls = (endpoint: string, payload?: any, contentType = 'application/json') => {
  const request = payload ?? {};
  return new Promise<WebResponse>(function (resolve, reject) {
    Axios.put(endpoint, request, {
      headers: commonAuthorizedHeader(contentType)
    })
      .then(axiosResponse => {
        updateAccessToken(axiosResponse);
        const response: WebResponse = axiosResponse.data;
        response.rawAxiosResponse = axiosResponse;
        if (response.code == CODE_SUCCESS) {
          resolve(response);
        }
        else { reject(response); }
      })
      .catch((e: any) => {
        console.error(e);
        reject(e);
      });
  })
}
export const commonAjaxGetCalls = (endpoint: string) => {
  return new Promise<WebResponse>(function (resolve, reject) {
    Axios.get(endpoint, {
      headers: commonAuthorizedHeader()
    })
      .then(axiosResponse => {
        updateAccessToken(axiosResponse);
        const response: WebResponse = axiosResponse.data;
        response.rawAxiosResponse = axiosResponse;
        if (response.code == CODE_SUCCESS) {

          resolve(response);
        }
        else { reject(response); }
      })
      .catch((e: any) => {
        console.error(e);
        reject(e);
      });
  })
}
export const commonAjaxDeleteCalls = (endpoint: string) => {
  return new Promise<WebResponse>(function (resolve, reject) {
    Axios.delete(endpoint, {
      headers: commonAuthorizedHeader()
    })
      .then(axiosResponse => {
        updateAccessToken(axiosResponse);
        const response: WebResponse = axiosResponse.data;
        response.rawAxiosResponse = axiosResponse;
        if (response.code == CODE_SUCCESS) {

          resolve(response);
        }
        else { reject(response); }
      })
      .catch((e: any) => {
        console.error(e);
        reject(e);
      });
  })
}

export const commonAjaxPublicPostCalls = (endpoint: string, payload?: any) => {
  const request = payload == null ? {} : payload;
  return new Promise<WebResponse>(function (resolve, reject) {
    Axios.post(endpoint, request, {
      headers: commonHeader()
    })
      .then(axiosResponse => {

        const response: WebResponse = axiosResponse.data;
        response.rawAxiosResponse = axiosResponse;
        if (response.code == CODE_SUCCESS) {
          resolve(response);
        }
        else { reject(response); }
      })
      .catch((e: any) => {
        console.error(e);
        reject(e);
      });
  })
}
export const commonAjaxPublicGetCalls = (endpoint: string) => {
  return new Promise<WebResponse>(function (resolve, reject) {
    Axios.get(endpoint, {
      headers: commonHeader()
    })
      .then(axiosResponse => {

        const response: WebResponse = axiosResponse.data;
        response.rawAxiosResponse = axiosResponse;
        if (response.code == CODE_SUCCESS) {
          resolve(response);
        }
        else { reject(response); }
      })
      .catch((e: any) => {
        console.error(e);
        reject(e);
      });
  })
}

export const commonAjaxPostCallsWithBlob = (endpoint: string, payload?: any) => {
  const request = payload ?? {};
  return new Promise<AttachmentInfo>((resolve, reject) => {
    Axios.post(endpoint, request, {
      responseType: 'blob',
      headers: commonAuthorizedHeader()
    })
      .then(axiosResponse => {
        updateAccessToken(axiosResponse);

        const response: any = axiosResponse.data;
        response.rawAxiosResponse = axiosResponse;
        console.debug('axiosResponse.headers: ', axiosResponse.headers);
        const contentDisposition = axiosResponse.headers['content-disposition'];
        const fileName = contentDisposition.split('filename=')[1];
        const rawSplit = fileName.split('.');
        const extension = rawSplit[rawSplit.length - 1];
        const blob = new Blob([response], { type: extension });
        const url = window.URL.createObjectURL(blob);
        const attachmentInfo: AttachmentInfo = new AttachmentInfo();
        attachmentInfo.name = fileName;
        attachmentInfo.blob = blob;
        attachmentInfo.url = url;
        resolve(attachmentInfo);

      })
      .catch((e: any) => { console.error(e); reject(e); });
  })
}
export const commonAjaxGetCallsWithBlob = (endpoint: string) => {
  return new Promise<AttachmentInfo>(function (resolve, reject) {
    Axios.get(endpoint, {
      responseType: 'blob',
      headers: commonAuthorizedHeader()
    })
      .then(axiosResponse => {
        updateAccessToken(axiosResponse);

        const response: any = axiosResponse.data;
        response.rawAxiosResponse = axiosResponse;
        console.debug('axiosResponse.headers: ', axiosResponse.headers);
        const contentDisposition = axiosResponse.headers['content-disposition'];
        const fileName = contentDisposition.split('filename=')[1];
        const rawSplit = fileName.split('.');
        const extension = rawSplit[rawSplit.length - 1];
        const blob = new Blob([response], { type: extension });
        const url = window.URL.createObjectURL(blob);
        
        const attachmentInfo: AttachmentInfo = new AttachmentInfo();
        attachmentInfo.name = fileName;
        attachmentInfo.blob = blob;
        attachmentInfo.url = url;
        resolve(attachmentInfo);

      })
      .catch((e: any) => { console.error(e); reject(e); });
  })
}
