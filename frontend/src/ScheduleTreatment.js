import React, { useState, useEffect } from 'react';
import { Col, Row, Input, Label } from 'reactstrap';
import TableContainer from './TableContainer';

function ScheduleTreatment(props) {
    const [treatments, setTreatments] = useState([]);
    const [treatmentId, setTreatmentId] = useState('');
    const [docId, setDocId] = useState('');
    const [slots, setSlots] = useState([]);
    const [slotId, setSlotId] = useState('');
    const [date, setDate] = useState('');
    const [showSlots, setShowSlots] = useState(false);

    const server_addr = props.server_addr;

    function getMinDate() {
        const today = new Date();
        return today.toISOString().substr(0, 10);
    }

    function getMaxDate() {
        const today = new Date();
        const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
        return twoMonthsLater.toISOString().substr(0, 10);
    }

    useEffect(() => {
        // get all pending treatments from db
        fetch('http://' + server_addr + '/front-desk/schedule-treatment', {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log("Treatment data: ", data);
                setTreatments(data['treatments']);
            });
    }, []);

    useEffect(() => {
        console.log(['treatmentId:', treatmentId, 'docId', docId, 'date:', date]);
        if (treatmentId !== '' && date !== '') {
            // get slots matching PhysicianID from db
            fetch('http://' + server_addr + '/front-desk/schedule-treatment/slots?docId=' + docId + '&date=' + date)
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    console.log("Slot data: ", data);
                    if (data.hasOwnProperty('slots')) {
                        setSlots(data['slots']);
                        setShowSlots(true);
                        setSlotId('');
                    }
                });
        }
        else {
            setShowSlots(false);
        }
    }, [treatmentId, date]);

    const handleTableSelect = (row) => {
        setTreatmentId(row.values['TreatmentID']);
        setDocId(row.values['PhysicianID']);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit clicked:", ['treatmentID:', treatmentId, 'docId', docId, 'date:', date, 'slotId:', slotId]);
        if (treatmentId !== '' && docId !== '' && date !== '' && slotId !== '') {
            // post to db
            fetch('http://' + server_addr + '/front-desk/schedule-treatment/slots', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    treatment_id: treatmentId,
                    physician_id: docId,
                    date: date,
                    slot_id: slotId
                })
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    console.log("Treatment schedule data: ", data);
                    if (data['message'] == 'OK') {
                        alert('Treatment scheduled successfully!');
                        const updatedTreatments = treatments.filter(treatment => treatment['TreatmentID'] !== treatmentId)
                        setTreatments(updatedTreatments);
                        setTreatmentId([]);
                        setDate('');
                        setSlotId('');
                        setShowSlots(false);
                    }
                    else {
                        alert('Error scheduling treatment!');
                    }
                });
        }
        else {
            alert('Please select all fields!');
        }
    }

    const treatmentColumns = [
        {
            Header: 'Treatment ID',
            accessor: 'TreatmentID',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Name',
            accessor: 'Desc_Name',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Patient',
            accessor: 'Patient_Name',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Physician',
            accessor: 'Physician_Name',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Physician ID',
            accessor: 'PhysicianID',
            Cell: ({ cell: { value } }) => value || "-",
            invisible: true
        },
        {
            Header: 'Cost (in ₹)',
            accessor: 'Cost',
            Cell: ({ cell: { value } }) => value || "-",
        }
    ];

    const slotColumns = [
        {
            Header: 'Slot ID',
            accessor: 'SlotID',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Start Time',
            accessor: 'Start',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'End Time',
            accessor: 'End',
            Cell: ({ cell: { value } }) => value || "-",
        }
    ];

    return (
        <div className='App'>
            <header className='App-header'>
                <h1>Schedule Treatment</h1>
                <hr />
            </header>
            <div className='App-body'>
                <form className='doctor-dashboard'>
                    <div className='form_wrapper'>
                        <Col className='my-col' sm={{ offset: 3, size: 6 }}> Select{(treatmentId !== '') ? 'ed' : ''} Treatment ID: {treatmentId} </Col>
                        {(treatments.length > 0) ? <TableContainer columns={treatmentColumns} data={treatments} selectedRow={treatmentId} setSelectedRow={handleTableSelect} TableName="Treatments" identifierColumn={'TreatmentID'} /> : <div>No treatments to schedule</div>}
                        <br />
                        <hr />
                        <Row className='align-items-center'>
                            <Col sm={{ offset: 2, size: 3 }} className="justify-content-end my-col"><Label for="app_date"> Select Date: </Label></Col>
                            <Col className='my-col' sm={4}><Input type="date" min={getMinDate()} max={getMaxDate()} id="app_date" sm="8" value={date} onChange={(e) => setDate(e.target.value)}></Input></Col>
                        </Row>
                        {
                            showSlots && (
                                <>
                                    <br />
                                    <hr />
                                    <Col className='my-col' sm={{ offset: 3, size: 6 }}> Select{(slotId !== '') ? 'ed' : ''} Slot ID: {slotId} </Col>
                                    {(slots.length > 0) ? <TableContainer columns={slotColumns} data={slots} selectedRow={slotId} setSelectedRow={(row) => setSlotId(row.values['SlotID'])} TableName="Slots" identifierColumn={'SlotID'} /> : <div>Sorry! No matching slots found.</div>}
                                    <br />
                                    {(slotId !== '') ? <button type='submit' className='but_' onClick={(e) => handleSubmit(e)}>Schedule</button> : ''}
                                </>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ScheduleTreatment;