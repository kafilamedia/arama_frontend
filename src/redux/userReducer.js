import * as types from './types'
import * as menuData from '../constant/Menus'
import { setLoginKeyCookie } from './../middlewares/Common';

export const initState = {
  loginKey: null,
  loginStatus: false,
  loginFailed: false,
  menus: menuData.getMenus(),
  loggedUser: null,
  loginAttempt: false,
  requestId: null,
  applicationProfile: {},
  assetsPath: ""
};

export const reducer = (state = initState, action) => {

  let result = {};
  switch (action.type) {
    case types.SET_REQUEST_ID:

      result = {
        ...state,
        requestId: action.payload.requestId,
        applicationProfile: action.payload.result ?? {},
        assetsPath: "http://FIXME"
      };

      result.loginStatus = false;
      result.loggedUser = null;
      // console.debug("result");
      // console.debug("action.payload.requestId: ",action.payload.message); 
      // console.debug("REQUEST_ID result.loginStatus:", result.loginStatus)
      action.payload.referer.refresh();

      return result;
    case types.DO_LOGIN:
      result = {
        ...state,
        loginAttempt: true,
        loginStatus: action.payload.loginStatus,
        loginKey: action.payload.loginKey,
        loginFailed: action.payload.loginStatus == false,
        loggedUser: action.payload.loggedUser
      };
      return result;
    case types.DO_LOGOUT:
      result = {
        ...state,
        loginStatus: false,
        loggedUser: null
      };
      setLoginKeyCookie(null);
      return result;
    case types.REFRESH_LOGIN:
      result = {
        ...state,
        loginStatus: action.payload.loginStatus,
        loggedUser: action.payload.loggedUser,
        requestId: action.payload.requestId,
      };
      return result;
    case types.GET_LOGGED_USER:
      result = {
        ...state, loggedUser: action.payload.data
      };
      return result;
    case types.SET_LOGGED_USER:
      result = {
        ...state, loggedUser: action.payload, loginStatus: true
      };
      return result;
    case types.SET_APPLICATION_PROFILE:
      result = {
        ...state, applicationProfile: action.payload.applicationProfile
      };
      return result;
    default:
      return { ...state };

  }
}

export default reducer;