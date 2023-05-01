import "./App.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import Home from "./Home";
import { Link } from "react-router-dom";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import Prescribe from "./Prescribe";
import ManageDocs from "./ManageDocs";
import ManageOps from "./ManageOps";
import ManageDocsD from "./ManageDocsD";
import ManageOpsD from "./ManageOpsD";
import FDOps from "./FDOps";
import DEOps from "./DEOps";
import AddPatient from "./AddPatient";
import ScheduleTest from "./ScheduleTest";
import ScheduleTreatment from "./ScheduleTreatment";
import TestResult from "./TestResult";
import TreatmentResult from "./TreatmentResult";
import DischargePatient from "./DischargePatient";
import Appointment from "./Appointment";
import AdmitPatient from "./AdmitPatient";
import useToken, { checkAuth } from "./useToken";

import AddMedication from "./admin_dashboard/add_medication";
import AddTreatment from "./admin_dashboard/add_treatment";
import AddTest from "./admin_dashboard/add_test";
import AddDepartment from "./admin_dashboard/add_department";
import AddUser from "./admin_dashboard/add_user";
import DeleteUser from "./admin_dashboard/delete_user";

import PrivateRoute from "./PrivateRoute";
import { Button } from "reactstrap";

function App() {
  const server_addr = "127.0.0.0.1:3001";
  const [ userType, setUserType ] = useState();
  const [ userId, setUserId ] = useState();
  const [ status, setStatus ] = useState(JSON.parse(sessionStorage.getItem('token')));
  const { token, setToken } = useToken();
  function handleTypeChange (type){setUserType(type)}

  const auth = JSON.parse(sessionStorage.getItem('token'));

  // const handleLogout = (e) => {
  //     sessionStorage.removeItem("token");
  //     setStatus(sessionStorage.getItem('token'));
  //     alert("logged out!");
  // }

  useEffect(() => {
    console.log("re-rendering!");
}, [status]);

  return (
    <div>
    {/* { (status && status['logged_in']==true) ? <button onClick={(e) => handleLogout(e)}> Logout </button> : <hr/> }  */}
    <BrowserRouter>
        <Routes>
            <Route exact path='/' element ={<Navigate to="/login"/>}/>
            {/* Primary Routes */}
            <Route path="user1" element={<PrivateRoute type={1}> <FDOps server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user2" element={<PrivateRoute type={2}> <DEOps server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user3" element={<PrivateRoute type={3}> <DoctorDashboard did={userId} server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user4" element={<PrivateRoute type={4}> <AdminDashboard server_addr={server_addr}/></PrivateRoute>} />

            {/* Secondary Routes */}            
            <Route path="user1/addpatient" element={<PrivateRoute type={1}> <AddPatient server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user1/admitpatient" element={<PrivateRoute type={1}> <AdmitPatient server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user1/dischargepatient" element={<PrivateRoute type={1}> <DischargePatient server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user1/appointment" element={<PrivateRoute type={1}> <Appointment server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user1/scheduleTest" element={<PrivateRoute type={1}> <ScheduleTest server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user1/scheduleTreatment" element={<PrivateRoute type={1}> <ScheduleTreatment server_addr={server_addr}/></PrivateRoute>} />
            
            <Route path="user2/testResult" element={<PrivateRoute type={2}> <TestResult server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user2/treatmentResult" element={<PrivateRoute type={2}> <TreatmentResult server_addr={server_addr}/></PrivateRoute>} />

            <Route exact path="user3/prescribe" element ={<PrivateRoute type={3}> <Prescribe server_addr={server_addr}/> </PrivateRoute>} />
            
            {/* Admin Dashboard */}
            <Route exact path="user4/managedocs" element={<PrivateRoute type={4}> <ManageDocs server_addr={server_addr}/></PrivateRoute>} render={()=>console.log('checking...')} />
            <Route path="user4/delete" element={<PrivateRoute type={4}> <DeleteUser server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user4/manageops" element={<PrivateRoute type={4}> <ManageOps server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user4/manageopsd" element={<PrivateRoute type={4}> <ManageOpsD server_addr={server_addr}/></PrivateRoute>} />

            <Route path="user4/user" element={<PrivateRoute type={4}> <AddUser server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user4/treatment" element={<PrivateRoute type={4}> <AddTreatment server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user4/test" element={<PrivateRoute type={4}> <AddTest server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user4/medication" element={<PrivateRoute type={4}> <AddMedication server_addr={server_addr}/></PrivateRoute>} />
            <Route path="user4/department" element={<PrivateRoute type={4}> <AddDepartment server_addr={server_addr}/></PrivateRoute>} />

          <Route exact path='/login' element ={<Login server_addr={server_addr} onLogin={ (id) => 
          {
            setStatus(JSON.parse(sessionStorage.getItem('token')))
            setUserId(id);   
            console.log("user id:", id);         
          }}/>
        }/>
        </Routes>
    </BrowserRouter>
    </div>
  );
}
export default App;