import "./App.css";
import React, { createContext, useState, useContext, useEffect } from 'react';

import {Route, Routes} from "react-router-dom"
import IndexPage from "./pages/IndexPage";
import Layout from "./pages/Layout";
import Login from "./pages/Login"
import Registration from "./pages/Registration";
import { useAuth } from './pages/AuthContext';

function App() {

  const { isAuthenticated, setIsAuthenticated } = useAuth();


  const handleLoginSuccess = (token) => {
    localStorage.setItem('userToken', token);
    setIsAuthenticated(true);
  };

  return (
    <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Login onLoginSuccess={handleLoginSuccess}/>}></Route>
          <Route path="/register" element={<Registration />} />
        </Route>
        <Route path="/start" element={<Layout />}>
          <Route index element={<IndexPage />}/>
        </Route>
    </Routes>

  );
}

export default App;
