import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useState } from "react";

function PrivateRoute({ children, type }) {

  const [auth, setAuth] = useState(JSON.parse(sessionStorage.getItem('token')));

  const handleLogout = (e) => {
    sessionStorage.removeItem("token");
    setAuth(JSON.parse(sessionStorage.getItem('token')));
    alert("logged out!");
  }
  console.log("auth ", auth)
  return (auth && auth['logged_in'] == true && auth['type'] == type) ? <div><div className='log-out'> <button onClick={handleLogout}> Logout </button></div> {children} </div> : <Navigate to="/login" />;
}

export default PrivateRoute;

// sessionStorage.setItem('token', JSON.stringify(true));