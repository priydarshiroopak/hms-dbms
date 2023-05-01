import React, {useState, useEffect} from 'react';
import {Col, Label, Row, Input, Button, FormGroup} from 'reactstrap';
import TableContainer from './TableContainer';
import {SelectColumnFilter} from './Filter';

function AdmitPatient(props) {
    const [patients, setPatients] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [patientId, setPatientId] = useState('');
    const [roomId, setRoomId] = useState('');

    const server_addr = props.server_addr;

    const patientColumns = [
        {
            Header: 'Patient SSN',
            accessor: 'id',
            Cell: ({cell: {value}}) => value || "-",
        },
        {
            Header: 'Name',
            accessor: 'Patient_Name',
            Cell: ({cell: {value}}) => value || "-",
        },
        {
            Header: 'Age',
            accessor: 'Age',
            Cell: ({cell: {value}}) => value || "-",
            Filter: SelectColumnFilter,
        },
        {
            Header: 'Gender',
            accessor: 'Gender',
            Cell: ({cell: {value}}) => value || "-",
            Filter: SelectColumnFilter,
        }
    ];
    
    const roomColumns = [
        {
            Header: 'Room ID',
            accessor: 'id',
            Cell: ({ cell: { value } }) => value || "-",
        }
    ]


    useEffect(() => {
        fetch('http://' + server_addr + '/front-desk/admit', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log("fetched data", data);
            setPatients(data['patients']);
            setRooms(data['rooms']);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    const handleAdmit = (e) => {
        e.preventDefault();
        console.log("Admitting patient", patientId, "to room", roomId);
        if(patientId !== '' && roomId !== '') {
            fetch('http://' + server_addr + '/front-desk/admit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient: patientId,
                    room: roomId
                })
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log("fetched data", data);
                if(data['message'] == "OK") {
                    alert("Patient admitted successfully!");
                } else {
                    alert("Patient admission failed!");
                }
                const updatedPatients = patients.filter(patient => patient.id !== patientId);
                setPatients(updatedPatients);
                const updatedRooms = rooms.filter(room => room.id !== roomId);
                setRooms(updatedRooms);
                setPatientId('');
                setRoomId('');
            })
            .catch(err => {
                console.log(err);
            })
        }
        else {
            alert("Please select a patient and a room!");
        }
    }


    return (
        <div className="App">
            <header className="App-header">
                <h1>Admit Patient</h1>
                <hr />
            </header>
            <div className="App-body">
                <div className="form_wrapper">
                    <Col className='my-col' sm={{ offset: 4, size: 7 }}> Select{(patientId !== '') ? "ed" : ""} Patient ID: {patientId}</Col>
                    {(patients.length > 0) ? <TableContainer columns={patientColumns} data={patients} selectedRow={patientId} setSelectedRow={(row) => setPatientId(row.values['id'])} TableName="Patients" identifierColumn={'id'} /> : <><p>Sorry! Unable to fetch Patient data from server.</p><br /></>}
                    <br />
                    <hr />
                    <br />
                    <FormGroup row>
                    <Col className='my-col' sm={4}> Select{(roomId !== '') ? "ed" : ""} Room ID: {roomId}</Col>
                    <Col sm={8}>
                        {(rooms.length > 0) ? (
                            <Input type="select" name="roomSelect" id="roomSelect" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                            <option value="">Select Room</option>
                            {rooms.map((room) => (
                            <option key={room.id} value={room.id}>{room.id}</option>
                            ))}
                            </Input>
                        ) : <><p>Sorry! Unable to fetch Room data from server.</p></>}
                    </Col>
                    </FormGroup>
                    <br />
                    <button type='submit' className='box' onClick={(e) => handleAdmit(e)}>Admit</button>
                </div>
            </div>
        </div >
    );
}

export default AdmitPatient;