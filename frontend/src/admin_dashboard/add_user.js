import { useState } from "react";
import { FormGroup, Label, Col, Input, Form, Button } from "reactstrap";

function AddUser(props) {
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [user_type, setUserType] = useState(3);
    const [password, setPassword] = useState('');

    const server_addr = props.server_addr;

    const handleSubmit = (e) => {
        e.preventDefault();
        const med = { employeeid: id, name, email, password, user_type, type: 'user' };

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
                <h1>Add a User</h1>
                <hr />
            </header>
            <div className="App-body">
                <div className="managedocs">
                    <Form onSubmit={handleSubmit}>
                        <FormGroup row>
                            <Label for="name" sm={3}>Name:</Label>
                            <Col sm={9}>
                                <Input type="text" name="name" id="name" placeholder="Enter name of user....." required value={name} onChange={(e) => setName(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="id" sm={3}>ID:</Label>
                            <Col sm={9}>
                                <Input type="text" name="name" id="name" placeholder="Enter user id....." required value={id} onChange={(e) => setID(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="type" sm={3}>Type:</Label>
                            <Col sm={9}>
                                <Input type="select" value={user_type} onChange={(e) => setUserType(e.target.value)}>
                                    <option value={3}>Doctor</option>
                                    <option value={1}>Front-Desk Operator</option>
                                    <option value={2}>Data-Entry Operator</option>
                                    <option value={4}>Administrator</option>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="email" sm={3}>Email ID:</Label>
                            <Col sm={9}>
                                <Input type="text" name="email" id="email" placeholder="Enter email ID....." required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="password" sm={3}>Password:</Label>
                            <Col sm={9}>
                                <Input type="password" name="password" id="password" placeholder="Set password....." required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 9, offset: 4 }}>
                                <Button>Add User</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddUser;