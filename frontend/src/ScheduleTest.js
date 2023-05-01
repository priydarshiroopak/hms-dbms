import React, { useState, useEffect } from 'react';
import { Col, Row, Input, Label } from 'reactstrap';
import TableContainer from './TableContainer';

function ScheduleTest(props) {
    const [tests, setTests] = useState([]);
    const [testId, setTestId] = useState('');
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
        // get all pending tests from db
        fetch('http://' + server_addr + '/front-desk/schedule-test', {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log("Test data: ", data);
                setTests(data['tests']);
                setSlots(data['slots']);
            });
    }, []);

    useEffect(() => {
        console.log(['testId:', testId, 'slotId:', slotId]);
        if (testId !== '' && date !== '') {
            setShowSlots(true);
        }
        else {
            setShowSlots(false);
        }
    }, [testId, date]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit clicked:", ['testID:', testId, 'date:', date, 'slotId:', slotId]);
        if (testId !== '' && date !== '' && slotId !== '') {
            // post to db
            fetch('http://' + server_addr + '/front-desk/schedule-test', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Test_instanceID: testId,
                    date: date,
                    slotID: slotId
                })
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    console.log("Test schedule data: ", data);
                    if (data['message'] == 'OK') {
                        alert("Test scheduled successfully");
                        const updatedTests = tests.filter(test => test.Test_instanceID !== testId);
                        setTests(updatedTests);
                        setTestId('');
                        setSlotId('');
                        setShowSlots(false);
                    }
                    else {
                        alert("Test scheduling failed");
                    }
                });
        }
        else {
            alert("Please fill all the fields");
        }
    }

    const testColumns = [
        {
            Header: 'Test ID',
            accessor: 'Test_instanceID',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Name',
            accessor: 'Test_Name',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Patient',
            accessor: 'Patient_Name',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Assigning Physician',
            accessor: 'Physician_Name',
            Cell: ({ cell: { value } }) => value || "-",
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
                <h1>Schedule Test</h1>
                <hr />
            </header>
            <div className='App-body'>
                <form className='doctor-dashboard'>
                    <div className='form_wrapper'>
                        <Col className='my-col' sm={{ offset: 3, size: 6 }}> Select{(testId !== '') ? 'ed' : ''} Test ID: {testId} </Col>
                        {(tests.length > 0) ? <TableContainer columns={testColumns} data={tests} selectedRow={testId} setSelectedRow={(row) => setTestId(row.values['Test_instanceID'])} TableName="Tests" identifierColumn={'Test_instanceID'} /> : <div>No tests to schedule</div>}
                        <br />
                        <hr />
                        <Row className='align-items-center'>
                            <Col sm={{ offset: 2, size: 3 }} className="my-col justify-content-end"><Label for="app_date"> Select Date: </Label></Col>
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
                                    <button type='submit' className='but_' onClick={(e) => handleSubmit(e)}>Schedule</button>
                                </>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ScheduleTest;