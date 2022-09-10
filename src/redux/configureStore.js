import { applyMiddleware, createStore } from 'redux';
import * as userMiddleware from '../middlewares/UserMiddleware';
import { initialState, rootReducer } from './reducers';
 
let store = null;
export const getStore = () => {
    return store;
}
export const configureStore = () => {
    store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(   

            //user related
            userMiddleware.performLoginMiddleware,
            userMiddleware.performLogoutMiddleware,  
            userMiddleware.getLoggedUserMiddleware, 
            userMiddleware.setLoggedUserMiddleware,

        )
    );

    return store;
}
   

export default configureStore;