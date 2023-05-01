import { useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

function AddMedication(props) {
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [desc, setDesc] = useState('');

    const server_addr = props.server_addr;

    const handleSubmit = (e) => {
        e.preventDefault();
        const med = { medicationid : id, name, brand, description : desc, type:'medication' };

        fetch('http://' + server_addr + '/admin', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(med)
        })
        .then(res => {
            return res.json();
          })
          .then(data => {
            console.log(med);
            alert(data['message']);
          });
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Add a Medication</h1>
                <hr />
            </header>
            <div className="App-body">
                <div className="managedocs">
                    <Form onSubmit={handleSubmit}>
                        <FormGroup row>
                            <Label for="name" sm={3}>Name:</Label>
                            <Col sm={9}>
                                <Input type="text" name="name" id="name" placeholder="Enter name of medication....." required value={name} onChange={(e) => setName(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="id" sm={3}>ID:</Label>
                            <Col sm={9}>
                                <Input type="text" name="id" id="id" placeholder="Enter medication id...." required value={id} onChange={(e) => setID(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="brand" sm={3}>Brand:</Label>
                            <Col sm={9}>
                                <Input type="text" name="brand" id="brand" placeholder="Enter brand name...." required value={brand} onChange={(e) => setBrand(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="desc" sm={3}>Description:</Label>
                            <Col sm={9}>
                                <Input type="text" name="desc" id="desc" placeholder="Enter description....." required value={desc} onChange={(e) => setDesc(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={{ size: 9, offset: 4 }}>
                                <Button type="submit" color="primary">Add Medication</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddMedication;