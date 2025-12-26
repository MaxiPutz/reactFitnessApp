import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import store from './components/redux/store'
import { Provider } from 'react-redux'

import { BrowserRouter } from 'react-router-dom'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter basename={import.meta.env.VITE_UI_BASE ?? ""}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Provider>

);

