import React from 'react';  // import the react library
import ReactDOM from 'react-dom/client';  // import the react dom client
import App from './App';  // import the App component from App.js

// note: this is the entry point for the react app. App.js is the root
// component that will be rendered on the page. the App component is
// imported above and passed to the render function below

// Create a root instance to render the app on the page
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app in strict mode, which will trigger additional checks
// and warnings in the console to help you write better react code
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

