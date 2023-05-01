import React, { useState, useEffect } from 'react';
import Table from './Table';
import jsonData from './db.json';
import { FormGroup, Label, Col, Input, Form, Button } from "reactstrap";

function ManageDocsD(props) {
  const [patients, setPatients] = useState();
  const [result, setResult] = useState([]);
  const [did, setDid] = useState(1);
  const [pid, setPid] = useState();

  const server_addr = props.server_addr;

  useEffect(() => {
    setPatients(jsonData['doctors']);
  }, []);

  useEffect(() => {
    fetch('http://' + server_addr + '/doctor/' + did)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log("doctor's patients", data['Patients']);
        setPatients(data['Patients']);
      });
  }, [])

  const handleQuery = (e, qno) => {
    e.preventDefault();
    fetch('http://' + server_addr + '/doctor/' + did + '?query=' + qno + '&patient=' + pid)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log("query result", data);
        setResult(data);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Delete a Doctor</h1>
        <hr />
      </header>
      <div className="App-body">
        <div className="managedocs">
          {patients ? <Table data={patients} /> : <br />}
          <Form>
            <FormGroup row>
              <Label for="name" sm={3}>Get Details:</Label>
              <Col sm={9}>
                <Input type="text" name="name" id="name" placeholder="Enter Doctor ID...." required value={pid} onChange={(e) => setPid(e.target.value)} />
              </Col>
            </FormGroup>
            <FormGroup check row>
              <Col sm={{ size: 9, offset: 4 }}>
                <Button>Delete Doctor</Button>
              </Col>
            </FormGroup>
          </Form>
          {result ? <Table data={result} /> : <br />}
        </div>
      </div>
    </div >
  );
}
export default ManageDocsD;