import React from 'react'
import App from './App'
import configureStore from './redux/configureStore'
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Provider as InvesifyProvider } from 'inversify-react';
import { inversifyContainer } from './inversify.config';

const Root = (props: any) => {
  const store = configureStore();
  return (
    <Provider store={store}>
      <InvesifyProvider container={inversifyContainer} >
        <HashRouter>
          <App />
        </HashRouter>
      </InvesifyProvider>
    </Provider>

  );
}


export default Root;