import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import CoffeeApp from './App';
import * as serviceWorker from './serviceWorker';
// import registerServiceWorker  from 'react-service-worker';

ReactDOM.render(<CoffeeApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
// registerServiceWorker();
