import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
// main.jsx or index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { store } from './store.ts';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
 <BrowserRouter>
 <Provider store={store}>
      <App />
 </Provider>
  </BrowserRouter>
  </StrictMode>,
)
