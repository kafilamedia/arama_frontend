import * as types from './types'
import * as url from '../constant/Url'
import { contextPath } from '../constant/Url';
import User from './../models/User';
import ApplicationProfile from './../models/ApplicationProfile';
import WebResponse from '../models/commons/WebResponse';

const usedHost = url.contextPath();
const apiEntityBaseUrl = usedHost + "api/app/entity/"
const apiAdmin = usedHost + "api/app/admin/"

export const setRequestId = (data: WebResponse, app) => ({
  type: types.SET_REQUEST_ID,
  payload: { loginStatus: data.loggedIn, referer: app, ...data },
  meta: {
    type: types.SET_REQUEST_ID,
  }
});

export const performLogout = (app) => {
  app.startLoading();
  let loginRequest = {
    type: types.DO_LOGOUT,
    payload: {},
    meta: { app: app, type: types.DO_LOGOUT, url: contextPath().concat("api/user/logout") }
  };
  return loginRequest;
}

export const performLogin = (email, password, app) => {
  app.startLoading();
  let loginRequest = {
    type: types.DO_LOGIN,
    payload: {},
    meta: {
      type: types.DO_LOGIN,
      url: contextPath().concat("login"),
      email: email, password: password,
      app: app
    }
  };
  return loginRequest;
}

export const getLoggedUser = (app) => {
  app.startLoading();
  let request = {
    type: types.GET_LOGGED_USER,
    payload: {},
    meta: { type: types.GET_LOGGED_USER, url: contextPath('api/user'), app }
  };
  return request;
}

export const setLoggedUser = (user: User) => ({
  type: types.SET_LOGGED_USER,
  payload: Object.assign(new User(), user),
  meta: { type: types.SET_LOGGED_USER }
});

export const setApplicationProfile = (applicationProfile: ApplicationProfile) => ({
  type: types.SET_APPLICATION_PROFILE,
  payload: { applicationProfile },
  meta: { type: types.SET_APPLICATION_PROFILE }
});

export const setMainApp = (mainApp: any) => ({
  type: types.SET_MAIN_APP,
  payload: mainApp,
  meta: { type: types.SET_MAIN_APP }
});

