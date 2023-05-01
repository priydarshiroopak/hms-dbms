import { useState } from "react";
import { FormGroup, Label, Col, Input, Form, Button } from "reactstrap";

function AddTest(props) {
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');

    const server_addr = props.server_addr;

    const handleSubmit = (e) => {
        e.preventDefault();
        const test = { testid: id, name, cost, type: 'test' };

        fetch('http://' + server_addr + '/admin', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(test)
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(test);
                alert(data['message']);
            });
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Add a Test</h1>
                <hr />
            </header>
            <div className="App-body">
                <div className="managedocs">
                    <Form onSubmit={handleSubmit}>
                        <FormGroup row>
                            <Label for="name" sm={3}>Name:</Label>
                            <Col sm={9}>
                                <Input type="text" name="name" id="name" placeholder="Enter name of test....." required value={name} onChange={(e) => setName(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="id" sm={3}>ID:</Label>
                            <Col sm={9}>
                                <Input type="text" name="id" id="id" placeholder="Enter test id...." required value={id} onChange={(e) => setID(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="cost" sm={3}>Cost:</Label>
                            <Col sm={9}>
                                <Input type="text" name="cost" id="cost" placeholder="Enter cost ...." required value={cost} onChange={(e) => setCost(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 9, offset: 4 }}    >
                                <Button>Add Test</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddTest;