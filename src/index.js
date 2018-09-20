import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './main';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(<Router basename={process.env.PUBLIC_URL}>< Main /></Router>, document.getElementById('root'));
