import { useState } from "react";
import { FormGroup, Label, Col, Input, Form, Button } from "reactstrap";

function AddPatient(props) {
    const [ssn, setSSN] = useState('');
    const [name, setName] = useState('');
    const [addr, setAddr] = useState('');
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [insuranceID, setInsuranceID] = useState('');
    const [email, setEMAIL] = useState('');

    const server_addr = props.server_addr;

    const handleSubmit = (e) => {
        e.preventDefault();
        const patient = { patient_ssn : ssn, patient_name : name, address : addr, gender, age, phone, insuranceID, email };

        fetch('http://' + server_addr + '/front-desk/register', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patient)
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(patient);
            alert(data['message']);
        });
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Add a Patient</h1>
                <hr />
            </header>
            <div className="App-body">
                <div className="managedocs">
                    <Form onSubmit={handleSubmit}>
                        <FormGroup row>
                            <Label for="ssn" sm={3}>SSN:</Label>
                            <Col sm={9}>
                                <Input type="text" name="ssn" id="ssn" placeholder="Enter SSN of patient....." required value={ssn} onChange={(e) => setSSN(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="name" sm={3}>Name:</Label>
                            <Col sm={9}>
                                <Input type="text" name="name" id="name" placeholder="Enter name of patient....." required value={name} onChange={(e) => setName(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="addr" sm={3}>Address:</Label>
                            <Col sm={9}>
                                <Input type="text" name="addr" id="addr" placeholder="Enter address of patient...." required value={addr} onChange={(e) => setAddr(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="age" sm={3}>Age:</Label>
                            <Col sm={9}>
                                <Input type="text" name="age" id="age" placeholder="Enter age of patient...." required value={age} onChange={(e) => setAge(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="exampleSelect" sm={3}>Gender:</Label>
                            <Col sm={9}>
                                <Input type="select" name="select" id="exampleSelect" onChange={(e) => setGender(e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="phone" sm={3}>Phone:</Label>
                            <Col sm={9}>
                                <Input type="text" name="phone" id="phone" placeholder="Enter phone number of patient...." required value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="insuranceID" sm={3}>Insurance ID:</Label>
                            <Col sm={9}>
                                <Input type="text" name="insuranceID" id="insuranceID" placeholder="Enter insurance ID of patient...." required value={insuranceID} onChange={(e) => setInsuranceID(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="email" sm={3}>EMAIL:</Label>
                            <Col sm={9}>
                                <Input type="text" name="email" id="email" placeholder="Enter EMAIL of patient...." required value={email} onChange={(e) => setEMAIL(e.target.value)} />
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 9, offset: 4 }}    >
                                <Button>Add Patient</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddPatient;