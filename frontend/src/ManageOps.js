import { useState } from "react";
import { FormGroup, Label, Col, Input, Form, Button } from "reactstrap";

function ManageOps(props) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const server_addr = props.server_addr;

  const handleSubmit = (e) => {
    e.preventDefault();
    const op = { name, role };

    fetch('http://' + server_addr + '/operator', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(op)
    }).then(data => {
      console.log(test);
      alert(data['message']);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Add an Operator</h1>
        <hr />
      </header>
      <div className="App-body">
        <div className="managedocs">
          <Form onSubmit={handleSubmit}>
            <FormGroup row>
              <Label for="name" sm={3}>Name:</Label>
              <Col sm={9}>
                <Input type="text" name="name" id="name" placeholder="Enter name of operator....." required value={name} onChange={(e) => setName(e.target.value)} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="role" sm={3}>Role:</Label>
              <Col sm={9}>
                <Input type="select" name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="front">Front Desk Operator</option>
                  <option value="data">Data Entry Operator</option>
                </Input>
              </Col>
            </FormGroup>
            <FormGroup check row>
              <Col sm={{ size: 9, offset: 4 }}>
                <Button>Add Operator</Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default ManageOps;