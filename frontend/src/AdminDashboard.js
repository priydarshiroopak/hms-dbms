import React from "react";
import { Link } from "react-router-dom";
import useToken from "./useToken";
import Login from "./Login";
import { useEffect, useState } from 'react';
import { checkAuth } from './useToken';

function AdminDashboard(props) {
  const server_addr = props.server_addr;
  const [token, setToken] = useState(JSON.parse(sessionStorage.getItem('token')));
  // useEffect(() => {
  //   checkAuth();
  // }, [])
  // if(!token)
  //   return <Login name="Database Administrator" type={4} server_addr={server_addr} setToken={setToken}/>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Admin Dashboard</h1>
        <hr />
      </header>
      <div className="App-body">
        <div className="container_home2">
          <Link to="user" className="box"><button>Add User</button></Link>
          <Link to="managedocs" className="box"><button>Add Doctor</button></Link>
          <Link to="delete" className="box"><button>Delete User</button></Link>
          {/* <Link to="manageops" className="box"><button>Add Data Operators</button></Link> */}
          {/* <Link to="manageopsd" className="box"><button>Delete Data Operators</button></Link> */}
          <Link to="medication" className="box"><button>Add Medication</button></Link>
          <Link to="treatment" className="box"><button>Add Treatment</button></Link>
          <Link to="test" className="box"><button>Add Test</button></Link>
          <Link to="department" className="box"><button>Add Department</button></Link>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;