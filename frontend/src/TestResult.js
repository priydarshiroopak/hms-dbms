import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Col, Input, Button, FormText } from 'reactstrap';
import TableContainer from './TableContainer';


let fileToHexString = (file) => {
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        const arrayBuf = event.target.result;
        let fileArrayBuffer = new Uint8Array(arrayBuf).buffer;
        let fileHexString = [...new Uint8Array(fileArrayBuffer)]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("");
        // //try to get back the array buffer
        // let fileArrayBuffer2 = new Uint8Array(
        //   fileHexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
        // ).buffer;
        // //convert to blob and open in new window
        // let blob = new Blob([fileArrayBuffer2], { type: "application/pdf" });
        // let url = URL.createObjectURL(blob);
        // window.open(url);
        resolve(fileHexString);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  
function TestResult(props) {
    const [tests, setTests] = useState([]);
    const [testId, setTestId] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [file, setFile] = useState(null);

    const server_addr = props.server_addr;

    const handleRemarksChange = (event) => {
        const { value } = event.target;
        setRemarks(value);
    };

    useEffect(() => {
        // get all scheduled tests from db
        fetch('http://' + server_addr + '/data-entry/test-result', {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log("Test data: ", data);
                if (data.hasOwnProperty('tests')) setTests(data['tests']);
            });
    }, []);

    useEffect(() => {
        console.log(['testId:', testId]);
        if (testId !== '') {
            setShowForm(true);
        }
        else {
            setShowForm(false);
        }
    }, [testId]);

    const testColumns = [
        {
            Header: 'Test ID',
            accessor: 'Test_instanceID',
            Cell: ({ cell: { value } }) => value || "-",
            invisible: true,
        },
        {
            Header: 'Test Name',
            accessor: 'Test_Name',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Patient',
            accessor: 'Patient_Name',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Date',
            accessor: 'Date',
            Cell: ({ cell: { value } }) => value || "-",
        },
        {
            Header: 'Time',
            accessor: 'Start',
            Cell: ({ cell: { value } }) => value || "-",
        }
    ];
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(['remarks:', remarks, 'file:', file]);
        if(testId !== '' && remarks !== '' && remarks !== null) {
            let fileHexString = await fileToHexString(file);
            // post to db
            fetch('http://' + server_addr + '/data-entry/test-result', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    test_id: testId,
                    remarks: remarks,
                    file: fileHexString
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log("Test result data: ", data);
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
                if (data['message'] == 'OK') {
                    alert('Test result added successfully');
                    const newTests = tests.filter((test) => test['Test_instanceID'] !== testId);
                    setTests(newTests);
                    setFile(null);
                    setTestId('');
                }
                else {
                    alert('Error adding treatment result');
                }
            })
            .catch(error => {
                console.log('Error adding test result: ', error);
                alert('Error adding test result');
            });
        }
        else {
            alert('Please enter remarks');
        }
    }
    

    return (
        <div className='App'>
            <header className='App-header'>
                <h1>Upload Test results</h1>
                <hr />
            </header>
            <div className='App-body'>
                <Col className='my-col' sm={{ offset: 3, size: 6 }}> Select{(testId !== '') ? 'ed' : ''} Test: {testId} </Col>
                {(tests.length > 0) ? <TableContainer columns={testColumns} data={tests} selectedRow={testId} setSelectedRow={(row) => setTestId(row.values['Test_instanceID'])} identifierColumn="Test_instanceID" /> : <div>No tests scheduled</div>}
                <br />
                <hr />
                <br />
                {
                    showForm && (
                        <div className='managedocs'>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup row>
                                    <Label for="remarks" sm={3}>Remarks</Label>
                                    <Col sm={9}>
                                    <Input type="textarea" name="remarks" id="remarks" style={{ maxHeight: '25vh' }} value={remarks} onChange={handleRemarksChange} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="fileUpload" sm={3}>Upload Image(png)</Label>
                                    <Col sm={9}>
                                        <Input type="file" onChange={(e)=>setFile(e.target.files[0])} name="file" />
                                        <FormText color="muted">
                                            max allowed file size is 100KB
                                        </FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup check row>
                                    <Col sm={{ size: 9, offset: 3 }}>
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

export default TestResult;