import * as appReducer from "./appReducer"
import * as userReducer from "./userReducer"
import { combineReducers } from "redux";

export const rootReducer = combineReducers(
    {
        appState: appReducer.reducer,
        userState: userReducer.reducer,
    }
);

export const initialState = {
    appState: appReducer.initState,
    userState: userReducer.initState,
}

export default rootReducer;