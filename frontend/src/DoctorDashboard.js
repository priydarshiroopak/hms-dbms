import React, { useState, useEffect } from 'react';
import Table from './Table';
import TableContainer from './TableContainer';
import { SelectColumnFilter } from './Filter';
import { Col, Row } from 'reactstrap';
import Prescribe from './Prescribe';
import jsonData from './db.json';

function DoctorDashboard(props) {
  const [patients, setPatients] = useState();
  const [upcoming, setUpcoming] = useState();
  const [result, setResult] = useState([]);
  const [did, setDid] = useState(1);
  const [pid, setPid] = useState();
  const [testId, setTestId] = useState();
  const [appointmentid, setAppointmentid] = useState();
  const [date, setDate] = useState();
  const [qtype, setQtype] = useState();
  const [testReport, setTestReport] = useState();

  const server_addr = props.server_addr;
  // const did = props.did;

  // useEffect(() => {
  //   setPatients(jsonData['doctors']);
  //   setUpcoming(jsonData['doctors']);
  // }, []);

  useEffect(() => {
    setDid(props.did)
    console.log("requesting all patient data");
    fetch('http://' + server_addr + '/doctor/' + did)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log("doctor's patients", data['past_appointments']);
        setPatients(data['past_appointments']);
        setUpcoming(data['upcoming_appointments']);
      });
  }, [])

  const handleQuery = (e, qno) => {
    e.preventDefault();
    setQtype(qno); console.log("qno ",qno)
    fetch('http://' + server_addr + '/doctor/' + did + '?type=' + qno + '&patient=' + pid)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log("query result", data['rows']);
        setResult(data['rows']);
      });
      console.log(result)
  }

  const handleShowReport = (e) => {
    e.preventDefault();
    alert("Getting Image!");
    console.log('http://' + server_addr + '/doctor/' + did + '?type=test_image&id=' + testId + '&patient=' + pid)
    fetch('http://' + server_addr + '/doctor/' + did + '?type=test_image&id=' + testId + '&patient=' + pid)
      .then(res => {
        return res.json();
      })
      .then(data => {
          // DECODE
          const buffer = data.image.data;
          let binary = [...new Uint8Array(buffer)]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("");
          const binaryData = new Uint8Array(
          (binary )
          .match(/[\da-f]{2}/gi)
          .map(function (h) {
              return parseInt(h, 16);
          })
          ).buffer;

          const blob = new Blob([binaryData], {
          type: "image/png",
          });
          console.log(blob);
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.target = "_blank";
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
          return;
      });
      console.log("test request", testReport['image'])
  }

  const handleTableSelect = (row) => {
    setPid(row.values['Patient_SSN']);
    setAppointmentid(row.values['id']);
    setDate(row.values['Date']);
  }

  const handleTestTableSelect = (row) => {
    setTestId(row.values['TestID']);
  }

  const patient_columns = [
    {
      Header: 'Appointment ID',
      accessor: 'id',
      Cell: ({ cell: { value } }) => value || "-",
      // Filter: SelectColumnFilter
    },
    {
      Header: 'Patient ID',
      accessor: 'Patient_SSN',
      Cell: ({ cell: { value } }) => value || "-",
    },
    {
      Header: 'Name',
      accessor: 'Patient_Name',
      Cell: ({ cell: { value } }) => value || "-",
    },
    {
      Header: 'Age',
      accessor: 'Age',
      Cell: ({ cell: { value } }) => value || "-",
      Filter: SelectColumnFilter,
    },
    {
      Header: 'Gender',
      accessor: 'Gender',
      Cell: ({ cell: { value } }) => value || "-",
      Filter: SelectColumnFilter,
    },
    {
      Header: 'Date',
      accessor: 'Date',
      Cell: ({ cell: { value } }) => value || "-",
      Filter: SelectColumnFilter
    }
  ];

  const test_columns = [
    {
      Header: 'Entry ID',
      accessor: 'TestID',
      Cell: ({ cell: { value } }) => value || "-",
      // Filter: SelectColumnFilter
    },
    {
      Header: 'Test Name',
      accessor: 'Test_Name',
      Cell: ({ cell: { value } }) => value || "-",
      // Filter: SelectColumnFilter
    },
    {
      Header: 'Date',
      accessor: 'Date',
      Cell: ({ cell: { value } }) => value || "-",
    },
    {
      Header: 'Result',
      accessor: 'Result',
      Cell: ({ cell: { value } }) => value || "-",
    }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Doctor Dashboard</h1>
        <hr />
        <h2>Your Patients' Appointment History</h2>
      </header>
      <div className="App-body">
        <div className="doctor_dashboard">

          {/* {patients ? <Table data={patients} /> : <br />} */}
          <Col className='my-col' sm={{ offset: 3, size: 6 }}> Select{(pid !== '') ? "ed" : ""} Patient ID: {pid}</Col>
          {patients ? <TableContainer columns={patient_columns} data={patients} selectedRow={pid} setSelectedRow={handleTableSelect} identifierColumn="id" TableName="Patients" /> : <br />}
          <br />
          <form>
            {/* <label>Get Patient Details:</label>
            <input type="text" placeholder="Enter Patient ID...." required value={pid} onChange={(e) => setPid(e.target.value)} /> */}
            <div className='button_row'>
              <button onClick={(e) => handleQuery(e, 'treatment')}>Treatment</button>
              <button onClick={(e) => handleQuery(e, 'medication')}>Medicine Prescribed</button>
              <button onClick={(e) => handleQuery(e, 'appointment')}>Appointment History</button>
              <button onClick={(e) => handleQuery(e, 'test')}>Test Result</button>
            </div>
          </form>
          {result && qtype!='test' ? <Table data={result} /> : console.log('no entry found')}
          {result && qtype=='test' ? <TableContainer columns={test_columns} data={result} selectedRow={testId} setSelectedRow={handleTestTableSelect} identifierColumn="TestID" TableName="Test Result" /> : console.log('no entry found')}
          {
            result && qtype=='test' ? <div className='button_row'>
              <button onClick={(e) => handleShowReport(e)}>Show Report</button>
            </div> 
            : 
            console.log('no entry found')
          }
          {pid ? <Prescribe server_addr={server_addr} pid={pid} did={did} appointmentid={appointmentid} date={date} /> : console.log('no patient selected')}
          {/* <Link to="prescribe"><button align='center'>Prescribe</button></Link> */}
      </div> 
      <br />
      <hr />
      <header className="App-header">
        <h1>Future Appointments</h1>
      </header>
      <div className="App-body">
          {upcoming ? <Table data={upcoming} /> : console.log('no entry found')}
      </div>
    </div >
    </div >
  );
}
export default DoctorDashboard;