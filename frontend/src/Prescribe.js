import React, { useState, useEffect } from 'react';
import Table from './Table';
import { Form, Col, Row, Button, FormGroup, Label, Input } from 'reactstrap';
import jsonData from './prescribe_list.json';

function Prescribe(props) {
  const server_addr = props.server_addr;
  const did = props.did;
  const pid = props.pid;
  const appointmentid = props.appointmentid;
  const date = props.date;

  const [selectedType, setSelectedType] = useState('');
  const [listItems, setListItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [prescription, setPrescription] = useState([]);
  const [remarks, setRemarks] = useState("");

  const types = ['Medication', 'Test', 'Treatment'];
  const items = ['item1', 'item2', 'item3'];

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const handleRemarksChange = (event) => {
    // event.preventDefault();
    setRemarks(event.target.value);
  };

  const appendPrescription = (e) => {
    e.preventDefault();
    let list = prescription;
    const type = selectedType;
    const id = selectedItem;
    list.push({ type, id, remarks });
    setPrescription(list);
    // setSelectedType('');
    console.log("updated prescription ", prescription);
  };

  const sendPrescription = (e) => {
    const packed_prescription = { prescription, did, pid, appointmentid, date };
    e.preventDefault();
    console.log("Final Prescription", packed_prescription);

    fetch('http://' + server_addr + '/doctor/' + did + '/prescribes/', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(packed_prescription)
    }).then(() => console.log("Added Prescription!", packed_prescription));
    setPrescription([]);
  };

  useEffect(() => {
    // setListItems(jsonData);
    fetch('http://' + server_addr + '/doctor/' + did + '/prescribes/')
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log("query result :", data);
        setListItems(data);
      });
  }, [])

  return (
    <>
      <br />
      <hr />
      <header className="App-header">
        <h1>Prescribe to a Patient</h1>
        <hr />
      </header>
      <div className="App-body">
        <div className="managedocs">
          <Form>
            <FormGroup  row>
              <Label for="type" sm={3}>Type</Label>
              <Col sm={9}>
                <Input type="select" name="type" id="type" value={selectedType} onChange={handleTypeChange}>
                  <option value="">Select a type</option>
                  {types.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </Input>
              </Col>
            </FormGroup>
            {(selectedType === 'Medication' || selectedType === 'Test' || selectedType === 'Treatment' ? 
              (
                <>
                <FormGroup row>
                <Label for={selectedType} sm={3}>Prescribe {selectedType}</Label>
                <Col sm={9}>
                  <Input type="select" name={selectedType} id={selectedType} value={selectedItem} onChange={handleItemChange}>
                    <option value="">Select {selectedType}</option>
                    {listItems[selectedType].map((item, index) => (
                      <option key={index} value={item['id']}>
                        {item['name']}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup  row>
                <Label for="remarks" sm={3}>Remarks</Label>
                <Col sm={9}>
                  <Input type="textarea" name="remarks" id="remarks" placeholder="Enter Remarks..." value={remarks} onChange={handleRemarksChange} />
                </Col>
              </FormGroup>
              <FormGroup  row>
                <Col sm={{size: 9, offset: 3}}>
                  <Row>
                    <Col sm={3}>
                      <Button onClick={(e) => setPrescription([])}>Clear</Button>
                    </Col>
                    <Col sm={3}>
                      <Button onClick={(e) => appendPrescription(e)}>Add</Button>
                    </Col>
                    <Col sm={2}>
                      {prescription === [] ? <hr /> : <Button onClick={(e) => sendPrescription(e)}>Prescribe</Button>}
                    </Col>
                  </Row>
                </Col>
              </FormGroup>
              </>
              )
             : <br></br>)}
            {prescription ? <Table data={prescription} /> : console.log('no entry found')}
          </Form>
        </div >
      </div>
    </>
  );
}
export default Prescribe;