import { RecoilRoot } from 'recoil';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import './utils/firebase';
import './utils/i18n';

import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Router>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
