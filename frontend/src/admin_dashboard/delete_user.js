import { useState } from "react";
import { FormGroup, Label, Col, Input, Form, Button } from "reactstrap";

function DeleteUser(props) {
    const [id, setID] = useState('');
    const [type, setType] = useState(1);
    const server_addr = props.server_addr;
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const entity = { id, type }

        fetch('http://' + server_addr + '/admin', {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entity)
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(entity);
                alert(data['message']);
            });
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Delete User</h1>
                <hr />
            </header>
            <div className="App-body">
                <div className="managedocs">
                    <Form onSubmit={handleSubmit}>
                        <FormGroup row>
                        <Label for="type" sm={3}>Type:</Label>
                        <Col sm={9}>
                            <Input type="select" name="type" id="type" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value={'user'}>User</option>
                            <option value={'doctor'}>Doctor</option>
                            <option value={'data-entry'}>Data entry</option>
                            <option value={'front-desk'}>Front-Desk</option>
                            </Input>
                        </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="id" sm={3}>ID:</Label>
                            <Col sm={9}>
                                <Input type="text" name="id" id="id" placeholder="Enter user id...." required value={id} onChange={(e) => setID(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 9, offset: 4 }}    >
                                <Button>Delete</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default DeleteUser;