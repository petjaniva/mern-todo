import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Landing from "./pages/Landing"
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes} from "react-router-dom";
import {Route} from "react-router";
import Dashboard from './pages/Dashboard';

const root:ReactDOM.Root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement 
);

root.render(
<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />}  />
      <Route path="/dashboard" element={<Dashboard />}/>
    </Routes>
  </BrowserRouter>
</React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
