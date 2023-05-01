import { useState } from "react";
import { FormGroup, Label, Col, Input, Form, Button } from "reactstrap";

function ManageOpsD(props) {
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
    }).then(() => console.log("Added Operator!", op));
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Delete an Operator</h1>
        <hr />
      </header>
      <div className="App-body">
        <div className="managedocs">
          <Form onSubmit={handleSubmit}>
            <FormGroup row>
              <Label sm={3}>Operator ID:</Label>
              <Col sm={9}>
              <Input type="text" placeholder="Enter operator ID...." required value={name} onChange={(e) => setName(e.target.value)} />
              </Col>
            </FormGroup>
            {/* <FormGroup row>
              <Label sm={3}>Role:</Label>
              <Col sm={9}>
              <Input type="text" placeholder="Enter role...." required value={role} onChange={(e) => setRole(e.target.value)} />
              </Col>
            </FormGroup> */}
            <FormGroup check row>
              <Col sm={{ size: 9, offset: 4 }}>
                <Button>Delete Doctor</Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default ManageOpsD;