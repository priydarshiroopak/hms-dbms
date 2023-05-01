import React, { useState, useEffect } from 'react';
import TableContainer from './TableContainer';
import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

function TreatmentResult(props) {
    const [treatments, setTreatments] = useState([]);
    const [treatmentId, setTreatmentId] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [success, setSuccess] = useState(true);
    const [remarks, setRemarks] = useState('');

    const server_addr = props.server_addr;

    const handleRemarksChange = (event) => {
        const { value } = event.target;
        setRemarks(value);
    };

    useEffect(() => {
        // get all scheduled treatments from db
        fetch('http://' + server_addr + '/data-entry/treatment-result', {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log("Treatment data: ", data);
                if (data.hasOwnProperty('treatments')) setTreatments(data['treatments']);
            });
    }, []);

    useEffect(() => {
        console.log(['treatmentId:', treatmentId]);
        if (treatmentId !== '') {
            setShowForm(true);
        }
        else {
            setShowForm(false);
        }
    }, [treatmentId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(['remarks:', remarks, 'success:', success]);
        if(treatmentId !== '' && remarks !== '' && remarks !== null) {
            // post to db
            fetch('http://' + server_addr + '/data-entry/treatment-result', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    treatmentid: treatmentId,
                    treatment_remarks: remarks,
                    successful: success
                })
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    console.log("Treatment result data: ", data);
                    if (data['message'] == 'OK') {
                        alert('Treatment result added successfully');
                        const newTreatments = treatments.filter(treatment => treatment['TreatmentID'] !== treatmentId);
                        setTreatments(newTreatments);
                        setSuccess(true);
                        setTreatmentId('');
                    }
                    else {
                        alert('Error adding treatment result');
                    }
                });
        }
        else {
            alert('Please enter remarks');
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
        }
    ];

    return (
        <div className='App'>
            <header className='App-header'>
                <h1>Upload Treatment results</h1>
                <hr />
            </header>
            <div className='App-body'>
                <Col className='my-col' sm={{ offset: 3, size: 6 }}> Select{(treatmentId !== '') ? 'ed' : ''} Treatment: {treatmentId} </Col>
                {(treatments.length > 0) ? <TableContainer columns={treatmentColumns} data={treatments} selectedRow={treatmentId} setSelectedRow={(row) => setTreatmentId(row.values['TreatmentID'])} identifierColumn={'TreatmentID'} /> : <div>No new treatments scheduled</div>}
                <hr />
                {
                    showForm && (
                        <div className='managedocs'>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup row>
                                    <Label for="remarks" sm={3}>Remarks:</Label>
                                    <Col sm={9}>
                                    <Input type="textarea" name="text" id="remarks" style={{ maxHeight: '25vh' }} value={remarks} onChange={handleRemarksChange} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="status" sm={3}>Status:</Label>
                                    <Col sm={9} className="d-flex align-items-center">
                                    <Label check>
                                        <Input type="checkbox" id="status" checked={success} onChange={(e) => setSuccess(e.target.checked)} style={{ backgroundColor: 'green' }} />
                                        {' '} Successful?
                                    </Label>
                                    </Col>
                                </FormGroup>
                                <FormGroup check row>
                                    <Col sm={{ size: 10, offset: 3 }}>
                                        <Button sm={3} type="submit">Submit</Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default TreatmentResult;