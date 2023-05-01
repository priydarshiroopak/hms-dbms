import React, { useState, useEffect } from 'react';
import Table from './Table';
import { Col, Label, Row, Input, Button } from 'reactstrap';
import TableContainer from './TableContainer';
import { SelectColumnFilter } from './Filter';
import jsonData from './db.json';

function AdmitPatient(props) {
    const [patients, setPatients] = useState([]);
    const [result, setResult] = useState();
    const [patientId, setPatientId] = useState();

    const server_addr = props.server_addr;

    // useEffect(() => {
    //     setPatients(jsonData['patients']);
    // }, []);

    useEffect(() => {
        fetch('http://' + server_addr + '/front-desk/discharge')
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log("doctor's patients", data['rows']);
                setPatients(data['rows']);
            });
    }, [])

    const handleQuery = (e) => {
        e.preventDefault();
        const test = { patient : patientId };
        console.log(test)
        fetch('http://' + server_addr + '/front-desk/discharge', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(test)
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(test);
                if(data['message'] == 'OK') {
                    const updatedPatients = patients.filter(patient => patient.Patient_SSN !== patientId)
                    setPatients(updatedPatients)
                    setPatientId('')
                    alert('patient discharged successfuly!')
                }
                else {
                    alert('Unable to process request!')
                }
            });
    }

    const patientColumns = [
        {
            Header: 'Patient SSN',
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
        }
    ];

    return (
        <div className="App">
            <header className="App-header">
                <h1>Discharge a Patient</h1>
                <hr />
            </header>
            <div className="App-body">
                <div className="doctor_dashboard">
                    <Col className='my-col' sm={{ offset: 3, size: 6 }}> Select{(patientId !== '') ? "ed" : ""} Patient ID: {patientId}</Col>
                    {(patients.length > 0) ? <TableContainer columns={patientColumns} data={patients} selectedRow={patientId} setSelectedRow={(row) => setPatientId(row.values['Patient_SSN'])} TableName="Patients" identifierColumn={'Patient_SSN'} /> : <><p>Sorry! Unable to fetch Patient data from server.</p><br /></>}
                    <div className='form_wrapper'>
                        <form>
                            {/* <label>ID:</label> */}
                            {/* <input type="text" placeholder="Enter Patient ID...." required value={pid} onChange={(e) => setPid(e.target.value)} /> */}
                            <button className='but_' onClick={handleQuery}>Discharge</button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default AdmitPatient;