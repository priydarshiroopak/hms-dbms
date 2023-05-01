import { useState } from "react";
import { FormGroup, Label, Col, Input, Form, Button } from "reactstrap";

function AddDepartment(props) {
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [headid, setHeadID] = useState('');
    const [desc, setDesc] = useState('');

    const server_addr = props.server_addr;

    const handleSubmit = (e) => {
        e.preventDefault();
        const dep = { departmentid: id, name, head: headid, type: 'department' };

        fetch('http://' + server_addr + '/admin', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dep)
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(dep);
                alert(data['message']);
            });
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Add a Department</h1>
                <hr />
            </header>
            <div className="App-body">
                <div className="managedocs">
                    <Form onSubmit={handleSubmit}>
                        <FormGroup row>
                            <Label for="name" sm={3}>Name:</Label>
                            <Col sm={9}>
                                <Input type="text" name="name" id="name" placeholder="Enter name of department....." required value={name} onChange={(e) => setName(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="id" sm={3}>ID:</Label>
                            <Col sm={9}>
                                <Input type="text" name="id" id="id" placeholder="Enter department id...." required value={id} onChange={(e) => setID(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="headid" sm={3}>Head ID:</Label>
                            <Col sm={9}>
                                <Input type="text" name="headid" id="headid" placeholder="Enter ID of head ...." required value={headid} onChange={(e) => setHeadID(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 9, offset: 4 }}    >
                                <Button>Add Department</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddDepartment;